import { cache } from 'react';
import { MenuLayout } from '../../components/menu';
import { RecipeDetail } from './components/detail';
import { DishHero, DishHeroDetail } from './components/dish-hero';
import { firebaseDb } from '~/services/firebase';

interface PageProps {
  params: Promise<{ id: string }>;
}

const fetchRecipeById = cache((id: string) => firebaseDb.getRecipe(id));

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params;
  const recipe = await fetchRecipeById(id);
  const { images = [] } = recipe || {};
  return recipe ? (
    <MenuLayout>
      <DishHero heroImgSrc={images[0]}>
        <DishHeroDetail recipeRaw={recipe} />
      </DishHero>

      <RecipeDetail recipeRaw={recipe} images={images} />
    </MenuLayout>
  ) : null;
}
