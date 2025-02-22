import { DbRecipe, Recipe } from '~/core/type';
import { MenuLayout, MenuHeader, MenuContent, MenuFooter, DishItem, DishLayout, MenuSection } from './_components/menu';
import Link from 'next/link';
import { CACHE_EXPIRATION } from '~/core/cache';
import { cachedRedisFetch } from '~/core/cache';

const recipesByCategory = (recipes: DbRecipe[]) =>
  recipes.reduce((acc: Record<Recipe['category'], DbRecipe[]>, recipe: DbRecipe) => {
    const category = recipe.en.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {} as Record<Recipe['category'], DbRecipe[]>);

async function fetchRecipes() {
  let recipes: DbRecipe[] = [];
  try {
    const res = await cachedRedisFetch('menu-data', async () => 
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe`, {
        next: { tags: ['menu'], revalidate: CACHE_EXPIRATION },
      }).then(r => r.json())
    );

    // Add runtime validation
    if (!Array.isArray(res)) throw new Error('Invalid recipe data format');

    recipes = res;
  } catch (error) {
    console.error(error);
  }
  return recipes;
}

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
