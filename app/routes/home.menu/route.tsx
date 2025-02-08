import { Link, useLoaderData } from '@remix-run/react';
import { DbRecipe, Recipe } from '~/core/type';
import { MenuLayout, MenuHeader, MenuContent, MenuSection, MenuFooter, DishItem, DishLayout } from './menu';
import { useMemo } from 'react';
import { LoaderFunction } from '@remix-run/node';
import { firebaseDb } from '~/services/firebase';

const recipesByCategory = (recipes: DbRecipe[]) =>
  recipes.reduce((acc: Record<Recipe['category'], DbRecipe[]>, recipe: DbRecipe) => {
    const category = recipe.en.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {} as Record<Recipe['category'], DbRecipe[]>);

export const loader: LoaderFunction = async () => {
  const recipes = await firebaseDb.getAllRecipes();
  return Response.json({ recipes });
};

export default function HomeMenuRoute() {
  const { recipes } = useLoaderData<{ recipes: DbRecipe[] }>();

  const mapping = useMemo(() => {
    return Object.entries(recipesByCategory(recipes));
  }, [recipes]);

  return (
    <MenuLayout>
      <MenuHeader />
      <MenuContent>
        {mapping.map(([category, recipes]) => (
          <MenuSection key={category} category={category as Recipe['category']}>
            {recipes.map((recipe) => {
              const { images } = recipe;
              return (
                <DishLayout key={recipe.id} bgImgSrc={images[0]}>
                  <Link
                    to="/home/recipe"
                    state={{
                      recipe: recipe,
                      images: images,
                    }}
                    preventScrollReset
                  >
                    <DishItem recipe={recipe} />
                  </Link>
                </DishLayout>
              );
            })}
          </MenuSection>
        ))}
        <MenuFooter />
      </MenuContent>
    </MenuLayout>
  );
}
