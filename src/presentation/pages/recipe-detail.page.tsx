import { DishHero, DishHeroDetail } from '../components/features/dish-hero';
import { RecipeDetail } from '../components/features/detail';
import { DbRecipe } from '~/domain/entities/recipe.entity';

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
