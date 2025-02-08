import { Navigate, useLocation } from '@remix-run/react';
import { DishHero, DishHeroDetail } from './hero-related';
import { RecipeDetail } from './recipe-related';
import { MenuLayout } from '../home.menu/menu';
import { DbRecipe } from '~/core/type';

export default function DishDetailPage() {
  const location = useLocation();
  if (!location.state?.recipe) return <Navigate to="/" replace />;
  const {
    state: { recipe, images },
  }: { state: { recipe: DbRecipe; images: DbRecipe['images'] } } = location;

  return (
    <MenuLayout>
      {/* Hero Section */}
      <DishHero heroImgSrc={images[0]}>
        <DishHeroDetail recipe={recipe} />
      </DishHero>

      {/* Additional content can go here */}
      <RecipeDetail recipe={recipe} images={images} />
    </MenuLayout>
  );
}
