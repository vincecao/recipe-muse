import { RecipeDetailPage } from '~/components/pages/recipe-detail.page';
import { notFound } from 'next/navigation';
import { CachedDataFetcher } from '~/shared/utils/cached-data-fetcher';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipeRoute({ params }: PageProps) {
  const { id } = await params;
  
  const recipe = await CachedDataFetcher.fetchRecipeSSR(id);
  
  if (!recipe) {
    return notFound();
  }
  
  return <RecipeDetailPage recipe={recipe} />;
}
