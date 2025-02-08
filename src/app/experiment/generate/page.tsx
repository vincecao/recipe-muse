import { Cuisine, DbRecipe } from '~/core/type';
import { cache } from 'react';
import axios, { isAxiosError } from 'axios';
import { LLMRequest, DeepseekModel } from '~/services/llm-client';
import View from './components';

const generateRecipes = cache(async () => {
  let generated: DbRecipe[] = [];

  /*
  try {
    const MODEL: LLMRequest['model'] = DeepseekModel.CHAT;
    const origin = process.env.NEXTAUTH_URL || 'http://localhost:3000';

    let url = `${origin}/api/recipe-names`;
    const { data: names } = await axios.get<string[]>(url, {
      params: { length: 1, cuisines: JSON.stringify(['Chinese'] as Cuisine[]), model: MODEL },
    });

    // const names = ["Panna Cotta", "Classic New York Cheesecake", "Piña Colada", "Classic Mojito", "Cosmopolitan"]

    url = `${origin}/api/recipe`;
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
  */
  return generated;
});

export default async function ExperimentGeneratePage() {
  const generated = await generateRecipes();
  return <View recipes={generated} />;
}
