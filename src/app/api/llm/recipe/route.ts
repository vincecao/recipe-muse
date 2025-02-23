import { NextRequest, NextResponse } from 'next/server';
import { DbRecipe, Lang, Recipe } from '~/core/type';
import { firebaseDb, normalizeRecipeName } from '~/app/api/_services/firebase';
import { LLMClient, type LLMRequest } from '~/app/api/_services/llm-client';
import { v4 as uuidv4 } from 'uuid';
import { getRecipeImages, OUTPUT_CONTENT_TYPE } from '~/app/api/_services/image-generator';
import { SupabaseStorageService } from '~/app/api/_services/supabase-storage';
import generate from '../_prompts/generate-recipe';
import translate from '../_prompts/translate-recipe';
import image from '../_prompts/generate-recipe-image';
import sharp from 'sharp';
import { getRedisClient } from '~/core/redis';

const LANGUAGE_MAPPING: { [key in Lang]: string } = {
  en: 'English',
  zh: 'Simplified Chinese',
  ja: 'Japanese',
};

const storageService = new SupabaseStorageService();
const IMAGE_COUNT = 1;

// New helper type for progress events
export type RecipeProgressEvent = {
  stage:
    | 'Checking Database'
    | 'Generating English Recipe'
    | 'Translating'
    | 'Generating Image'
    | 'Uploading'
    | 'Complete';
  progress: number;
  output:
    | {
        status: 'pending';
        message: string;
      }
    | {
        status: 'error';
        message: string;
      }
    | {
        status: 'success';
        recipe: DbRecipe;
      };
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name');
  const model = searchParams.get('model') as LLMRequest['model'];
  const taskId = searchParams.get('taskId');

  // Handle SSE connections for progress updates
  if (taskId) {
    const redis = await getRedisClient();
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
        const subscriber = redis.duplicate();
        await subscriber.connect();
        await subscriber.subscribe(taskId, (message) => {
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
    if (!name || !model) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const redis = await getRedisClient();
    const taskId = uuidv4();

    // Start generation in background, callback task progress
    generateRecipeByName(name, model, async (event: RecipeProgressEvent) => {
      await redis.publish(taskId, JSON.stringify(event));
    });

    return NextResponse.json({ taskId });
  } catch (error) {
    console.error('Recipe generation failed:', error);
    return NextResponse.json({ error: 'Failed to start generation' }, { status: 500 });
  }
}

const generateRecipeByName = async (
  name: string,
  model: LLMRequest['model'],
  onProgress?: (event: RecipeProgressEvent) => void,
) => {
  const sendProgress = (
    stage: RecipeProgressEvent['stage'],
    progress: number,
    output?: RecipeProgressEvent['output'],
  ) => {
    onProgress?.({
      stage,
      progress: Math.min(100, Math.max(0, progress)),
      output: output ?? {
        status: 'pending',
        message: `${stage}...`,
      },
    });
  };

  const postGeneration = async ({ id }: DbRecipe) => {
    const finalRecipe = await firebaseDb.getRecipe(id);
    if (finalRecipe) {
      sendProgress('Complete', 100, {
        status: 'success',
        recipe: finalRecipe,
      });
      return NextResponse.json('ok');
    }
    return NextResponse.json({ error: 'Can not locate recipe from db' }, { status: 404 });
  };

  const llmClient = new LLMClient();
  const version: DbRecipe['version'] = { recipe: 'unknown', translator: 'unknown' };

  const generateImages = async (title: string, description: string) => {
    const [prompt, imgVersion] = image(title, description);
    const imageFiles = await getRecipeImages(prompt, IMAGE_COUNT);

    // Process images with fallback
    const processedImages = await Promise.all(
      imageFiles.map(async (originalBuffer) => {
        try {
          const processedBuffer = await sharp(originalBuffer)
            .webp({
              quality: 80,
              alphaQuality: 80,
              lossless: false,
              force: true,
            })
            .toBuffer();

          return {
            buffer: processedBuffer,
            contentType: 'image/webp',
            success: true,
          };
        } catch (error) {
          console.warn('WebP conversion failed, using original format:', error);
          return {
            buffer: originalBuffer,
            contentType: `image/${OUTPUT_CONTENT_TYPE}`,
            success: false,
          };
        }
      }),
    );

    const uploads = await Promise.all(
      processedImages.map(({ buffer, contentType }, index) =>
        storageService.upload(
          `${normalizeRecipeName(title)}_v${imgVersion}_${index}.${contentType.split('/')[1]}`,
          buffer,
          contentType,
        ),
      ),
    );

    return uploads;
  };

  const generateTranslatedRecipe = async (r: Partial<Recipe>, lang: Lang) => {
    console.log(`Translating en recipe to ${lang}(${LANGUAGE_MAPPING[lang]}):`, name);
    const [system, user, , translatorVer] = translate(r, LANGUAGE_MAPPING[lang]);
    version.translator = translatorVer;
    const response = await llmClient.generate({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      model,
    });
    return JSON.parse(response.content) as Omit<Recipe, 'id'>;
  };

  const generateMultiTranslatedRecipes = async (r: Omit<Recipe, 'id'>, langs: Lang[]) => {
    const translatedRecipes = await Promise.all(
      langs.map(async (lang) => {
        const {
          title,
          description,
          time,
          tags,
          servingSize,
          allergens,
          cuisine,
          ingredients,
          instructions,
          tools,
          ...original
        } = r;
        const translated = await generateTranslatedRecipe(
          { title, description, time, tags, servingSize, allergens, cuisine, ingredients, instructions, tools },
          lang,
        );
        return { [lang]: { ...original, ...translated, id: `rid:${uuidv4()}` } };
      }),
    );

    return translatedRecipes.reduce((prev, curr) => ({ ...prev, ...curr }), {});
  };

  try {
    sendProgress('Checking Database', 10);
    const existingRecipe = await firebaseDb.getRecipeByName(name);
    if (existingRecipe) {
      console.log('Recipe found in database:', name);

      // Check and regenerate missing images
      if (existingRecipe.images.length === 0) {
        console.log('Generating missing images for:', name);
        sendProgress('Generating Image', 60);
        const images = await generateImages(existingRecipe.en.title, existingRecipe.en.description);

        // Update Firebase with new images
        const updatedRecipe = await firebaseDb.updateRecipe(existingRecipe.id, { images });
        return updatedRecipe;
      }

      // Check and regenerate missing translations
      if (!existingRecipe.zh || !existingRecipe.ja) {
        const langs: Lang[] = [];
        if (!existingRecipe.zh) langs.push('zh');
        if (!existingRecipe.ja) langs.push('ja');

        console.log('Generating missing translations for:', name);

        // Update Firebase with new translation
        sendProgress('Translating', 80);
        const updatedRecipe = await firebaseDb.updateRecipe(existingRecipe.id, {
          ...(await generateMultiTranslatedRecipes(existingRecipe.en, langs)),
          version: { ...existingRecipe.version, translator: version.translator },
        });
        return updatedRecipe;
      }

      return await postGeneration(existingRecipe);
    }

    const generateEnRecipe = async () => {
      // If not found, generate new recipe
      console.log('Generating new en recipe:', name);
      const [system, user, , recipeVer] = generate(name);
      version.recipe = recipeVer;
      const response = await llmClient.generate({
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        model,
      });
      return JSON.parse(response.content) as Omit<Recipe, 'id'>;
    };

    sendProgress('Generating English Recipe', 30);
    const enRecipe = await generateEnRecipe();

    sendProgress('Generating Image', 60);
    const images = await generateImages(enRecipe.title, enRecipe.description);

    const langs: Lang[] = ['zh', 'ja'];
    sendProgress('Translating', 80);
    const translated = await generateMultiTranslatedRecipes(enRecipe, langs);

    // Store the new recipe in Firebase
    sendProgress('Uploading', 90);
    const stored = await firebaseDb.saveRecipeByName({
      id: uuidv4(),
      en: { ...enRecipe, id: `rid:${uuidv4()}` },
      ...translated,
      version,
      images,
    });
    console.log('New recipe saved to database:', name);
    return await postGeneration(stored);
  } catch (error) {
    onProgress?.({
      stage: 'Complete',
      progress: 100,
      output: {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
    });
    throw error;
  }
};
