import { LoaderFunction } from '@remix-run/node';
import axios, { isAxiosError } from 'axios';
import { Cuisine, DbRecipe } from '~/core/type';
import { MenuContent, DishItem, DishLayout } from './home.menu/menu';
import { useLoaderData } from '@remix-run/react';
import { useLanguage } from '~/core/useLanguage';
import { DeepseekModel, LLMRequest } from '~/services/llm-client';
import { useState } from 'react';
import { RecipeDetail } from './home.recipe/recipe-related';

export const loader: LoaderFunction = async ({ request }) => {
  let generated: DbRecipe[] = [];
   /*
  try {
    const MODEL: LLMRequest['model'] = DeepseekModel.CHAT;
    const { origin } = new URL(request.url);
    let url = `${origin}/api/recipe-names`;
   
    const { data: names } = await axios.get<string[]>(url, {
      params: { length: 1, cuisines: JSON.stringify(['Chinese'] as Cuisine[]), model: MODEL },
    });
    

    // const names = ["Panna Cotta", "Classic New York Cheesecake", "Piña Colada", "Classic Mojito", "Cosmopolitan"]

    url = `${origin}/api/recipe`;
    generated = await Promise.all(
      names.map((name: string) =>
        axios
          .get<DbRecipe>(`${origin}/api/recipe`, {
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
  return Response.json({ generated });
};

export default function HomeGenerateRoute() {
  const { language } = useLanguage();
  const { generated } = useLoaderData<{ generated: DbRecipe[] }>();

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex">
      <MenuContent>
        {generated.map((recipe, index) => {
          const r = recipe[language];
          return (
            <DishLayout key={r.id} bgImgSrc={recipe.images[0]}>
              <button onClick={() => setSelectedIndex(index)}>
                <DishItem recipe={r}></DishItem>
              </button>
            </DishLayout>
          );
        })}
      </MenuContent>
      <MenuContent>
        <RecipeDetail recipe={generated[selectedIndex][language]} images={generated[selectedIndex].images} />
      </MenuContent>
    </div>
  );
}
