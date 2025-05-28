import { MenuPage } from '~/components/pages/menu.page';
import { CachedDataFetcher } from '~/shared/utils/cached-data-fetcher';

export default async function MenuRoute() {
  const recipes = await CachedDataFetcher.fetchRecipesSSR();
  return <MenuPage recipes={recipes} />;
}
