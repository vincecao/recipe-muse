import { DbRecipe, Recipe } from '~/core/type';
import { MenuLayout, MenuHeader, MenuContent, MenuFooter, DishItem, DishLayout, MenuSection } from './components/menu';
import { firebaseDb } from '~/services/firebase';
import Link from 'next/link';
import { cache } from 'react';

const recipesByCategory = (recipes: DbRecipe[]) =>
  recipes.reduce((acc: Record<Recipe['category'], DbRecipe[]>, recipe: DbRecipe) => {
    const category = recipe.en.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {} as Record<Recipe['category'], DbRecipe[]>);

const fetchAllRecipes = cache(() => firebaseDb.getAllRecipes());

export default async function MenuPage() {
  const recipes = await fetchAllRecipes();
  const mapping = Object.entries(recipesByCategory(recipes));

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
                  <Link href={`/menu/recipe/${recipe.id}`}>
                    <DishItem recipeRaw={recipe} />
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
