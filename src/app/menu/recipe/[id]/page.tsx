import { MenuLayout } from '../../_components/menu';
import { fetchRecipe } from '../../_utils/data';
import { RecipeDetail } from './_components/detail';
import { DishHero, DishHeroDetail } from './_components/dish-hero';

interface PageProps {
  params: Promise<{ id: string }>;
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
