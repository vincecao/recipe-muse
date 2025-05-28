import {
  MenuLayout,
  MenuHeader,
  MenuContent,
  MenuSection,
  DishLayout,
  DishItem,
  MenuFooter,
} from '../features/menu';
import type { DbRecipe } from '~/domain/entities/recipe.entity';
import Link from 'next/link';

function groupRecipesByCategory(recipes: DbRecipe[]): Record<string, DbRecipe[]> {
  return recipes.reduce((acc, recipe) => {
    const category = recipe.en.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {} as Record<string, DbRecipe[]>);
}

interface MenuPageProps {
  recipes: DbRecipe[];
}

export function MenuPage({ recipes }: MenuPageProps) {
  // Group recipes by category
  const recipesByCategory = groupRecipesByCategory(recipes);

  return (
    <MenuLayout>
      <MenuHeader />
      <MenuContent>
        {Object.entries(recipesByCategory).map(([category, categoryRecipes]) => (
          <MenuSection key={category} category={category as DbRecipe['en']['category']}>
            {categoryRecipes.map((recipe) => (
              <DishLayout key={recipe.id} bgImgSrc={recipe.images[0] || '/placeholder-dish.jpg'}>
                <Link href={`/menu/recipe/${recipe.id}`}>
                  <DishItem recipeRaw={recipe} />
                </Link>
              </DishLayout>
            ))}
          </MenuSection>
        ))}
      </MenuContent>
      <MenuFooter />
    </MenuLayout>
  );
}
