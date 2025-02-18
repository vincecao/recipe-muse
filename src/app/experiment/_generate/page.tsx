import { Cuisine, DbRecipe } from '~/core/type';
import { cache } from 'react';
import { AnthropicModel, LLMRequest } from '~/app/api/_services/llm-client';
import axios, { isAxiosError } from 'axios';

const LENGTH = 1;
const CUISINES: Cuisine[] = ['Japanese'];
const MODEL: LLMRequest['model'] = AnthropicModel.SONNET;

const PRESET_RECIPE_NAMES: string[] = [];
const PRESET_RECIPES: DbRecipe[] = [];

const generateRecipes = cache(async () => {
  let generated: DbRecipe[] = PRESET_RECIPES;
  const origin = process.env.NEXT_PUBLIC_BASE_URL;

  if (generated.length) return generated;

  try {
    let names = PRESET_RECIPE_NAMES;

    if (!names.length) {
      const url = `${origin}/api/llm/recipe-names`;
      const { data } = await axios.get<string[]>(url, {
        params: { length: LENGTH, cuisines: JSON.stringify(CUISINES), model: MODEL },
      });
      names = data;
    }

    const url = `${origin}/api/llm/recipe`;
    generated = await Promise.all(
      names.map((name: string) =>
        axios
          .get<DbRecipe>(url, {
            params: {
              name,
              model: MODEL,
            },
          })
          .then(({ data }) => data),
      ),
    );
  } catch (error) {
    console.error('Loader error:', error);
    if (isAxiosError(error)) {
      throw new Response(error.response?.data?.error || 'Failed to load recipes', {
        status: error.response?.status || 500,
      });
    }
    throw new Response('Failed to load recipes', { status: 500 });
  }

  return generated;
});

export default async function ExperimentGeneratePage() {
  const generated = await generateRecipes();
  return <pre>{JSON.stringify(generated, null, 2)}</pre>;
  // return <View recipes={generated} />;
}
