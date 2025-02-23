import { cachedRedisFetch, NEXTJS_CACHE_EXPIRATION } from '~/core/cache';
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
    const res = await cachedRedisFetch<DbRecipe>(`recipe-${id}`, async () => 
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe/${id}`, {
        next: { tags: [`menu-recipe`, `id:${id}`], revalidate: NEXTJS_CACHE_EXPIRATION },
      }).then(r => r.json())
    );

    // Add runtime validation
    if (!res?.id || !res.en?.title) {
      throw new Error('Invalid recipe data structure');
    }

    recipe = res;
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
