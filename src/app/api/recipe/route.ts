import { RecipeController } from '~/application/controllers/recipe.controller';

export async function GET() {
  return RecipeController.getAllRecipes();
}
