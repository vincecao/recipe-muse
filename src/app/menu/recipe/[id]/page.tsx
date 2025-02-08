import { CACHE_EXPIRATION } from '~/core/cache';
import { MenuLayout } from '../../_components/menu';
import { RecipeDetail } from './_components/detail';
import { DishHero, DishHeroDetail } from './_components/dish-hero';
import { DbRecipe } from '~/core/type';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchRecipe(id: string): Promise<DbRecipe | undefined> {
  let recipe: DbRecipe | undefined;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe/${id}`, {
      next: { tags: [`menu-recipe`, `id:${id}`], revalidate: CACHE_EXPIRATION },
    });

    if (!response.ok) {
      if (response.status === 404) throw new Error('Recipe not found');
      throw new Error('Failed to fetch recipe');
    }

    const data = await response.json();

    // Add runtime validation
    if (!data?.id || !data.en?.title) {
      throw new Error('Invalid recipe data structure');
    }

    recipe = data;
  } catch (error) {
    console.error(error);
  }
  return recipe;
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await fetchRecipe(id);

  if (!recipe) return null;

  const { images = [] } = recipe;

  return (
    <MenuLayout>
      <DishHero heroImgSrc={images[0]}>
        <DishHeroDetail recipeRaw={recipe} />
      </DishHero>

      <RecipeDetail recipeRaw={recipe} images={images} />
    </MenuLayout>
  );
}
