import { MenuLayout, MenuHeader, MenuContent, MenuFooter, DishItem, DishLayout, MenuSection } from './_components/menu';
import Link from 'next/link';
import { DataFetcher } from '../../presentation/utils/data-fetcher';
import { Category } from '../../domain/entities/recipe.entity';

export default async function MenuPage() {
  // Use the legacy SSR data fetcher to get proper DbRecipe format with multilingual support
  const allRecipes = await DataFetcher.fetchRecipesLegacySSR();
  
  // Group recipes by category
  const recipesByCategory: Record<Category, typeof allRecipes> = {} as Record<Category, typeof allRecipes>;
  
  allRecipes.forEach((recipe) => {
    const category = recipe.en.category as Category;
    if (!recipesByCategory[category]) {
      recipesByCategory[category] = [];
    }
    recipesByCategory[category].push(recipe);
  });

  const mapping = Object.entries(recipesByCategory);

  return (
    <MenuLayout>
      <MenuHeader />
      <MenuContent>
        {mapping.map(([category, recipes]) => (
          <MenuSection key={category} category={category as Category}>
            {recipes.map((recipe) => {
              return (
                <DishLayout key={recipe.id} bgImgSrc={recipe.images[0]}>
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
