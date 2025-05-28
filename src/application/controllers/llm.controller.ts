import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { GenerateRecipeUseCase, RecipeProgressEvent } from '~/application/use-cases/generate-recipe.use-case';
import { GenerateRecipeNamesUseCase } from '~/application/use-cases/generate-recipe-names.use-case';
import { LLMService, type LLMRequest, TOOL_COMPLETION_REQUEST } from '~/infrastructure/services/llm.service';
import { StorageService } from '~/infrastructure/services/storage.service';
import { ImageService } from '~/infrastructure/services/image.service';
import { redisService } from '~/infrastructure/services/redis.service';
import { DeepseekModel, ModelFamily } from '~/domain/entities/llm.entity';
import { DbRecipe, Cuisine } from '~/domain/entities/recipe.entity';

// Define types for better type safety
export type ChatProgressEvent = {
  stage: 'Processing' | 'Complete';
  progress: number;
  output:
    | { status: 'pending'; message: string }
    | { status: 'error'; message: string }
    | { status: 'success'; response: string; recipes: DbRecipe[] };
};

export type { RecipeProgressEvent };

export class LLMController {
  // Helper function to validate required search parameters
  private static validateSearchParam(
    searchParams: URLSearchParams,
    paramName: string,
    errorMessage?: string
  ): string | NextResponse {
    const value = searchParams.get(paramName);
    if (!value?.trim()) {
      return NextResponse.json(
        { error: errorMessage || `${paramName} is required` },
        { status: 400 }
      );
    }
    return value;
  }

  // Helper function to parse JSON search parameter safely
  private static parseJsonParam<T>(
    paramValue: string | null,
    defaultValue: T,
    paramName: string
  ): T | NextResponse {
    if (!paramValue) return defaultValue;
    
    try {
      const parsed = JSON.parse(paramValue);
      return parsed;
    } catch {
      return NextResponse.json(
        { error: `Invalid ${paramName} format` },
        { status: 400 }
      );
    }
  }

  static async generateRecipe(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = request.nextUrl;
    const taskId = searchParams.get('taskId');

    // Handle SSE connections for progress updates
    if (taskId) {
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          // Send keep-alive every 15 seconds
          const keepAlive = setInterval(() => {
            try {
              // Check if controller is still open before enqueuing
              controller.enqueue(encoder.encode(':keep-alive\n\n'));
            } catch (error) {
              // If controller is closed, clear the interval
              clearInterval(keepAlive);
              console.error(error);
            }
          }, 15000);

          // Listen for Redis updates
          const subscriber = await redisService.subscribe(taskId, (message: string) => {
            controller.enqueue(encoder.encode(`data: ${message}\n\n`));
          });

          // Cleanup
          return () => {
            clearInterval(keepAlive);
            subscriber.unsubscribe();
            subscriber.quit();
          };
        },
      });

      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      });
    }

    // Original GET handler with progress support
    try {
      // Validate required parameters using helper functions
      const name = this.validateSearchParam(searchParams, 'name', 'Recipe name is required');
      if (name instanceof NextResponse) return name;

      const family = this.validateSearchParam(searchParams, 'family', 'Model family is required');
      if (family instanceof NextResponse) return family;

      const model = this.validateSearchParam(searchParams, 'model', 'Model is required');
      if (model instanceof NextResponse) return model;

      // Validate family and model types
      const validatedFamily = family as LLMRequest['family'];
      const validatedModel = model as unknown as LLMRequest['model'];

      const taskId = uuidv4();

      // Start generation in background, callback task progress
      const llmService = new LLMService();
      const storageService = new StorageService();
      const imageService = new ImageService();
      const useCase = new GenerateRecipeUseCase(llmService, storageService, imageService);

      // Execute use case in background
      useCase.execute(name, validatedFamily, validatedModel, async (event: RecipeProgressEvent) => {
        await redisService.publish(taskId, JSON.stringify(event));
      }).catch(error => {
        console.error('Recipe generation failed:', error);
      });

      return NextResponse.json({ taskId });
    } catch (error) {
      console.error('Recipe generation failed:', error);
      return NextResponse.json({ error: 'Failed to start generation' }, { status: 500 });
    }
  }

  static async generateRecipeNames(request: NextRequest): Promise<NextResponse> {
    try {
      const { searchParams } = request.nextUrl;
      const cuisinesParam = searchParams.get('cuisines');
      const lengthParam = searchParams.get('length');

      // Validate required parameters using helper functions
      const familyValue = this.validateSearchParam(searchParams, 'family', 'Model family is required');
      if (familyValue instanceof NextResponse) return familyValue;

      const modelValue = this.validateSearchParam(searchParams, 'model', 'Model is required');
      if (modelValue instanceof NextResponse) return modelValue;

      // Parse and validate cuisines parameter
      const cuisines = this.parseJsonParam<Cuisine[]>(cuisinesParam, [], 'cuisines');
      if (cuisines instanceof NextResponse) return cuisines;

      if (!Array.isArray(cuisines)) {
        return NextResponse.json({ error: 'Cuisines must be an array' }, { status: 400 });
      }

      const length = lengthParam ? parseInt(lengthParam, 10) : 1;
      if (isNaN(length) || length < 1 || length > 50) {
        return NextResponse.json({ error: 'Length must be a number between 1 and 50' }, { status: 400 });
      }

      const family = familyValue as LLMRequest['family'];
      const model = modelValue as unknown as LLMRequest['model'];

      // Generate names using clean architecture
      const llmService = new LLMService();
      const useCase = new GenerateRecipeNamesUseCase(llmService);
      const names = await useCase.execute(cuisines, length, family, model);
      
      return NextResponse.json(names);
    } catch (error) {
      console.error('Error generating recipe names:', error);
      return NextResponse.json({ error: 'Failed to generate recipe names' }, { status: 500 });
    }
  }

  static async processChat(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const { 
        messages, 
        model = DeepseekModel.CHAT, 
        family = ModelFamily.DEEPSEEK 
      } = body;

      // Validate required parameters
      if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
      }

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Helper function to send progress updates
        const sendProgress = (
          stage: ChatProgressEvent['stage'],
          progress: number,
          output?: ChatProgressEvent['output'],
        ) => {
          const event: ChatProgressEvent = {
            stage,
            progress,
            output: output || { status: 'pending', message: 'Processing...' },
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        try {
          sendProgress('Processing', 0);

          const llmService = new LLMService();

          const systemPrompt = {
            role: 'system',
            content: `You are a cooking assistant.`,
          };

          const fullMessages = [systemPrompt, ...(messages || [])];
          const tools = [TOOL_COMPLETION_REQUEST.getMenuReference];

          const response = await llmService.processLlm<{
            message: string;
            recipes: DbRecipe[]
          }>({
            messages: fullMessages,
            family,
            model,
            tools,
          });

          sendProgress('Complete', 100, {
            status: 'success',
            response: response.content.message,
            recipes: response.content.recipes,
          });
        } catch (error) {
          console.error('Error in chat processing:', error);
          sendProgress('Complete', 100, {
            status: 'error',
            message: error instanceof Error ? error.message : 'An error occurred',
          });
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
    } catch (error) {
      console.error('Error in chat processing setup:', error);
      return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
    }
  }
} 