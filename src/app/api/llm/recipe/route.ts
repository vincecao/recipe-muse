import { NextRequest, NextResponse } from 'next/server';
import { DbRecipe, Lang, Recipe } from '~/core/type';
import { firebaseDb, normalizeRecipeName } from '~/app/api/_services/firebase';
import { LLMClient, type LLMRequest } from '~/app/api/_services/llm-client';
import { v4 as uuidv4 } from 'uuid';
import { getRecipeImages } from '~/app/api/_services/image-generator';
import { SupabaseStorageService } from '~/app/api/_services/supabase-storage';
import generate from '../_prompts/generate-recipe';
import translate from '../_prompts/translate-recipe';
import image from '../_prompts/generate-recipe-image';
import { LANGUAGE_MAPPING } from '~/core/use-language';

const storageService = new SupabaseStorageService();
const IMAGE_COUNT = 1;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const model = searchParams.get('model') as LLMRequest['model'];

    if (!name) {
      return NextResponse.json({ error: 'Recipe name is required' }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ error: 'Model parameter is required' }, { status: 400 });
    }

    const recipe = await generateRecipeByName(name, model);

    return NextResponse.json(recipe);
  } catch (error) {
    console.error('Recipe generation failed:', error);
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}

const generateRecipeByName = async (name: string, model: LLMRequest['model']) => {
  const generateImages = async (title: string, description: string) => {
    const [prompt, imgVersion] = image(title, description);
    const imageFiles = await getRecipeImages(prompt, IMAGE_COUNT);
    return Promise.all(
      imageFiles.map((image) =>
        storageService.upload(`${normalizeRecipeName(title)}_v${imgVersion}`, image, 'image/png'),
      ),
    );
  };

  try {
    const existingRecipe = await firebaseDb.getRecipeByName(name);
    if (existingRecipe) {
      console.log('Recipe found in database:', name);

      // Check and regenerate missing images
      if (existingRecipe.images.length === 0) {
        console.log('Generating missing images for:', name);
        const images = await generateImages(existingRecipe.en.title, existingRecipe.en.description);

        // Update Firebase with new images
        const updatedRecipe = await firebaseDb.updateRecipe(existingRecipe.id, { images });
        return updatedRecipe;
      }

      return existingRecipe;
    }

    const llmClient = new LLMClient();

    const version: DbRecipe['version'] = { recipe: 'unknown', translator: 'unknown' };
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

    const generateTranslatedRecipe = async (r: Partial<Recipe>, lang: Lang) => {
      console.log(`Translating en recipe to ${lang}:`, name);
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

    const generateMultiTranslatedRecipes = async (r: Omit<Recipe, 'id'>) => {
      const langs: Lang[] = ['zh', 'ja'];
      const translatedRecipes = await Promise.all(
        langs.map(async (lang) => {
          const { title, description, time, tags, servingSize, allergens, cuisine, ingredients, instructions, tools } =
            r;
          const re = await generateTranslatedRecipe(
            { title, description, time, tags, servingSize, allergens, cuisine, ingredients, instructions, tools },
            lang,
          );
          return { [lang]: { ...r, ...re, id: `rid:${uuidv4()}` } };
        }),
      );
      return translatedRecipes.reduce((prev, curr) => ({ ...prev, ...curr }), {});
    };

    const enRecipe = await generateEnRecipe();

    console.log('Generating images from stability ai:', name);
    const images = await generateImages(enRecipe.title, enRecipe.description);

    // Store the new recipe in Firebase
    const stored = await firebaseDb.saveRecipeByName({
      id: uuidv4(),
      en: { ...enRecipe, id: `rid:${uuidv4()}` },
      ...(await generateMultiTranslatedRecipes(enRecipe)),
      version,
      images,
    });
    console.log('New recipe saved to database:', name);
    return stored;
  } catch (error) {
    console.error('Error in generateRecipeByName:', error);
    throw error;
  }
};
