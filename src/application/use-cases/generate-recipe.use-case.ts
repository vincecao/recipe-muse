import { DbRecipe, Lang, Recipe } from '~/domain/entities/recipe.entity';
import { LLMService, type LLMRequest } from '~/infrastructure/services/llm.service';
import { StorageService } from '~/infrastructure/services/storage.service';
import { ImageService, OUTPUT_CONTENT_TYPE } from '~/infrastructure/services/image.service';
import { firebaseDb, normalizeRecipeName } from '~/infrastructure/services/firebase.service';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import generate from '~/infrastructure/prompts/generate-recipe';
import translate from '~/infrastructure/prompts/translate-recipe';
import image from '~/infrastructure/prompts/generate-recipe-image';

const LANGUAGE_MAPPING: { [key in Lang]: string } = {
  en: 'English',
  zh: 'Simplified Chinese',
  ja: 'Japanese',
};

const IMAGE_COUNT = 1;

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

export class GenerateRecipeUseCase {
  constructor(
    private llmService: LLMService,
    private storageService: StorageService,
    private imageService: ImageService,
  ) {}

  async execute(
    name: string,
    family: LLMRequest['family'],
    model: LLMRequest['model'],
    onProgress?: (event: RecipeProgressEvent) => void,
  ): Promise<DbRecipe> {
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

    const version: DbRecipe['version'] = { recipe: 'unknown', translator: 'unknown' };

    try {
      sendProgress('Checking Database', 10);
      const existingRecipe = await firebaseDb.getRecipeByName(name);
      
      if (existingRecipe) {
        console.log('Recipe found in database:', name);

        // Check and regenerate missing images
        if (existingRecipe.images.length === 0) {
          console.log('Generating missing images for:', name);
          sendProgress('Generating Image', 60);
          const images = await this.generateImages(existingRecipe.en.title, existingRecipe.en.description);

          // Update Firebase with new images
          const updatedRecipe = await firebaseDb.updateRecipe(existingRecipe.id, { images });
          if (!updatedRecipe) {
            throw new Error('Failed to update recipe with images');
          }
          sendProgress('Complete', 100, {
            status: 'success',
            recipe: updatedRecipe,
          });
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
          const translated = await this.generateMultiTranslatedRecipes(existingRecipe.en, langs);
          const updatedRecipe = await firebaseDb.updateRecipe(existingRecipe.id, {
            ...translated,
            version: { ...existingRecipe.version, translator: version.translator },
          });
          
          if (!updatedRecipe) {
            throw new Error('Failed to update recipe with translations');
          }
          
          sendProgress('Complete', 100, {
            status: 'success',
            recipe: updatedRecipe,
          });
          return updatedRecipe;
        }

        sendProgress('Complete', 100, {
          status: 'success',
          recipe: existingRecipe,
        });
        return existingRecipe;
      }

      // Generate new recipe
      sendProgress('Generating English Recipe', 30);
      const enRecipe = await this.generateEnRecipe(name, model, family);
      version.recipe = enRecipe.version;

      sendProgress('Generating Image', 60);
      const images = await this.generateImages(enRecipe.recipe.title, enRecipe.recipe.description);

      const langs: Lang[] = ['zh', 'ja'];
      sendProgress('Translating', 80);
      const translated = await this.generateMultiTranslatedRecipes(enRecipe.recipe, langs);

      // Store the new recipe in Firebase
      sendProgress('Uploading', 90);
      const stored = await firebaseDb.saveRecipeByName({
        id: uuidv4(),
        en: { ...enRecipe.recipe, id: `rid:${uuidv4()}` },
        ...translated,
        version,
        images,
      });
      
      console.log('New recipe saved to database:', name);
      
      sendProgress('Complete', 100, {
        status: 'success',
        recipe: stored,
      });
      
      return stored;
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
  }

  private async generateEnRecipe(name: string, model: LLMRequest['model'], family: LLMRequest['family']) {
    console.log('Generating new en recipe:', name);
    const [system, user, , responseFormat, recipeVer] = generate(name);
    
    const response = await this.llmService.processLlm<Omit<Recipe, 'id'>>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      model,
      family,
      response_format: responseFormat,
    });
    
    return {
      recipe: response.content,
      version: recipeVer,
    };
  }

  private async generateImages(title: string, description: string): Promise<string[]> {
    const [prompt, imgVersion] = image(title, description);
    const imageFiles = await this.imageService.generateRecipeImages(prompt, IMAGE_COUNT);

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
        this.storageService.upload(
          `${normalizeRecipeName(title)}_v${imgVersion}_${index}.${contentType.split('/')[1]}`,
          buffer,
          contentType,
        ),
      ),
    );

    return uploads;
  }

  private async generateTranslatedRecipe(r: Partial<Recipe>, lang: Lang): Promise<Omit<Recipe, 'id'>> {
    console.log(`Translating en recipe to ${lang}(${LANGUAGE_MAPPING[lang]})`);
    const [system, user, , responseFormat] = translate(r, LANGUAGE_MAPPING[lang]);
    
    const response = await this.llmService.processLlm<Omit<Recipe, 'id'>>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      model: 'claude-3.5-sonnet' as never,
      family: 'anthropic' as never,
      response_format: responseFormat,
    });
    
    return response.content;
  }

  private async generateMultiTranslatedRecipes(r: Omit<Recipe, 'id'>, langs: Lang[]) {
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
        const translated = await this.generateTranslatedRecipe(
          { title, description, time, tags, servingSize, allergens, cuisine, ingredients, instructions, tools },
          lang,
        );
        return { [lang]: { ...original, ...translated, id: `rid:${uuidv4()}` } };
      }),
    );

    return translatedRecipes.reduce((prev, curr) => ({ ...prev, ...curr }), {});
  }
} 