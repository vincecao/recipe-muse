import { NextRequest } from 'next/server';
import { DeepseekModel, ModelFamily } from '~/types/llm';
import { LLMClient, TOOL_COMPLETION_REQUEST } from '../_services/llm-client';

// Define types for better type safety
export type ChatProgressEvent = {
  stage: 'Processing' | 'Complete';
  progress: number;
  output:
    | { status: 'pending'; message: string }
    | { status: 'error'; message: string }
    | { status: 'success'; response: string; references: string[] };
};

// Helper function to send progress updates
const sendProgress = (
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
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

// Main POST handler
export async function POST(request: NextRequest) {
  const { messages, model = DeepseekModel.CHAT, family = ModelFamily.DEEPSEEK } = await request.json();

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        sendProgress(controller, encoder, 'Processing', 0);

        const llmClient = new LLMClient();

        const systemPrompt = {
          role: 'system',
          content: `You are a cooking assistant.`,
          // You can only answer questions about recipes or menu items by using the getMenuEvidence tool.
          // Do not answer from your own knowledge.
          // If you cannot find a relevant recipe, say "No suitable recipe found."
          // `,
        };

        const fullMessages = [systemPrompt, ...(messages || [])];

        const schema = {
          name: 'chatResponse',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', description: 'The chat response message from the chat assistant' },
              recipeReferenceIds: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of recipe ids associated with the response',
              },
            },
            required: ['message', 'recipeReferenceIds'],
            additionalProperties: false,
          },
        };

        const tools = [TOOL_COMPLETION_REQUEST.getMenuEvidence];

        const response = await llmClient.processLlm<{
          message: string;
          recipeReferenceIds: string[];
        }>({
          messages: fullMessages,
          family,
          model,
          response_format: {
            type: 'json_schema',
            json_schema: schema,
          },
          tools,
        });

        sendProgress(controller, encoder, 'Complete', 100, {
          status: 'success',
          response: response.content.message,
          references: response.content.recipeReferenceIds,
        });
      } catch (error) {
        console.error('Error in /chat endpoint:', error);
        sendProgress(controller, encoder, 'Complete', 100, {
          status: 'error',
          message: error instanceof Error ? error.message : 'An error occurred',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
