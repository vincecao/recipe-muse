import { DbRecipe, Recipe } from '~/types/recipe';
import { MenuLayout, MenuHeader, MenuContent, MenuFooter, DishItem, DishLayout, MenuSection } from './_components/menu';
import Link from 'next/link';
import { fetchRecipes } from './_utils/data';

const recipesByCategory = (recipes: DbRecipe[]) =>
  recipes.reduce((acc: Record<Recipe['category'], DbRecipe[]>, recipe: DbRecipe) => {
    const category = recipe.en.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {} as Record<Recipe['category'], DbRecipe[]>);

export default async function MenuPage() {
  const recipes = await fetchRecipes();
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
