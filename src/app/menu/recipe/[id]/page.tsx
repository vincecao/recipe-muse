import { CACHE_EXPIRATION } from '~/core/cache';
import { MenuLayout } from '../../_components/menu';
import { RecipeDetail } from './_components/detail';
import { DishHero, DishHeroDetail } from './_components/dish-hero';
import { DbRecipe } from '~/core/type';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe/${id}`, {
    next: { tags: [`menu-recipe`, `id:${id}`], revalidate: CACHE_EXPIRATION },
  });
  const recipe = (await response.json()) as DbRecipe;
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
