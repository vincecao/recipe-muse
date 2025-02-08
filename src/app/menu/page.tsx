import { DbRecipe, Recipe } from '~/core/type';
import { MenuLayout, MenuHeader, MenuContent, MenuFooter, DishItem, DishLayout, MenuSection } from './_components/menu';
import Link from 'next/link';
import { CACHE_EXPIRATION } from '~/core/cache';

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
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe`, {
    next: { tags: ['menu'], revalidate: CACHE_EXPIRATION },
  });
  const recipes = (await response.json()) as DbRecipe[];
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
