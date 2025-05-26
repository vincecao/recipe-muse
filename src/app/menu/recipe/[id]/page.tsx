import { MenuLayout } from '../../_components/menu';
import { DataFetcher } from '../../../../presentation/utils/data-fetcher';
import { RecipeDetail } from './_components/detail';
import { DishHero, DishHeroDetail } from './_components/dish-hero';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  
  // Use the optimized SSR data fetcher
  const recipe = await DataFetcher.fetchRecipeLegacySSR(id);

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
