import type { LoaderFunctionArgs } from '@remix-run/node';
import { DbRecipe, Recipe } from '~/core/type';
import generate from '~/prompts/generate-recipe-by-name';
import translate from '~/prompts/translate-recipe';
import { firebaseDb, normalizeRecipeName } from '~/services/firebase';
import { LLMClient, type LLMRequest } from '~/services/llm-client';
import { v4 as uuidv4 } from 'uuid';
import { getRecipeImages } from '~/services/image-generator';
import { SupabaseStorageService } from '~/services/supabase-storage';

const storageService = new SupabaseStorageService();
const IMAGE_COUNT = 1;

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let name: string | null = null;
  try {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);

    name = params.get('name');
    const model = params.get('model') as LLMRequest['model'] | null;

    if (!name) {
      return Response.json({ error: 'Recipe name is required' }, { status: 400 });
    }
    if (!model) {
      return Response.json({ error: 'Model parameter is required' }, { status: 400 });
    }

    const recipes = await generateRecipeByName(name, model);
    return Response.json(recipes);
  } catch (error) {
    console.error('Error generating recipe:', error);
    return Response.json(null);
  }
};

const generateRecipeByName = async (name: string, model: LLMRequest['model']) => {
  const generateImages = async (title: string, description: string) => {
    const imageFiles = await getRecipeImages([title, description], IMAGE_COUNT);
    return Promise.all(
      imageFiles.map((image) => (image ? storageService.upload(normalizeRecipeName(title), image, 'image/png') : {})),
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [system, user, assistant, recipeVer] = generate(name);
      version.recipe = recipeVer;
      const response = await llmClient.generate({ messages: [{ role: 'user', content: user }], model });
      return JSON.parse(response.content) as Omit<Recipe, 'id'>;
    };

    const generateZhRecipe = async (r: Omit<Recipe, 'id'>) => {
      console.log('Translating en recipe to zh:', name);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [system, user, assistant, translatorVer] = translate(r, 'Simplified Chinese');
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

    const enRecipe = await generateEnRecipe();
    const zhRecipe = await generateZhRecipe(enRecipe);

    console.log('Generating images from ability ai:', name);
    const images = await generateImages(enRecipe.title, enRecipe.description);

    // Store the new recipe in Firebase
    const stored = await firebaseDb.saveRecipeByName({
      id: uuidv4(),
      en: { ...enRecipe, id: `rid:${uuidv4()}` },
      zh: { ...zhRecipe, id: `rid:${uuidv4()}` },
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
