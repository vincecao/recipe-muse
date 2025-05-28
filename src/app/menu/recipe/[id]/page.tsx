import { RecipeDetailPage } from '~/presentation/pages/recipe-detail.page';
import { notFound } from 'next/navigation';
import { DataFetcher } from '~/presentation/utils/data-fetcher';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeRoute({ params }: PageProps) {
  const { id } = await params;
  
  const recipe = await DataFetcher.fetchRecipeSSR(id);
  
  if (!recipe) {
    return notFound();
  }
  
  return <RecipeDetailPage recipe={recipe} />;
}
