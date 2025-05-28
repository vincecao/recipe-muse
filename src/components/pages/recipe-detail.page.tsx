import { DishHero, DishHeroDetail } from '../features/dish-hero';
import { RecipeDetail } from '../features/detail';
import type { DbRecipe } from '~/domain/entities/recipe.entity';

interface RecipeDetailPageProps {
  recipe: DbRecipe;
}

export function RecipeDetailPage({ recipe }: RecipeDetailPageProps) {
  return (
    <>
      <DishHero heroImgSrc={recipe.images[0] || '/placeholder-dish.jpg'}>
        <DishHeroDetail recipeRaw={recipe} />
      </DishHero>
      <RecipeDetail recipeRaw={recipe} images={recipe.images} />
    </>
  );
}
