import { Navigate, useLocation } from "@remix-run/react";
import { DishHero, DishHeroDetail } from "./hero-related";
import { RecipeDetail } from "./recipe-related";
import { MenuLayout } from "../_index/menu";

export default function DishDetailPage() {
  const location = useLocation();
  if (!location.state?.recipe) return <Navigate to="/" replace />;
  const {
    state: { recipe },
  } = location;

  return (
    <MenuLayout>
      {/* Hero Section */}
      <DishHero heroImgSrc={recipe.images[0]}>
        <DishHeroDetail recipe={recipe} />
      </DishHero>

      {/* Additional content can go here */}
      <RecipeDetail recipe={recipe} />
    </MenuLayout>
  );
}
