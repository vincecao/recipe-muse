import { MenuPage } from '~/presentation/pages/menu.page';
import { DataFetcher } from '~/presentation/utils/data-fetcher';

export default async function MenuRoute() {
  const recipes = await DataFetcher.fetchRecipesSSR();
  return <MenuPage recipes={recipes} />;
}
