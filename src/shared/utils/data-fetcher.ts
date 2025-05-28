import { container } from '../../infrastructure/config/dependency-injection';
import { RecipeService } from '../services/recipe.service';
import type { DbRecipe } from '../../domain/entities/recipe.entity';

let isInitialized = false;

export async function ensureInitialized() {
  if (!isInitialized) {
    await container.initialize();
    isInitialized = true;
  }
}

export class DataFetcher {
  static async fetchRecipesSSR(): Promise<DbRecipe[]> {
    await ensureInitialized();
    return RecipeService.getAllRecipes();
  }

  static async fetchRecipeSSR(id: string): Promise<DbRecipe | null> {
    await ensureInitialized();
    return RecipeService.getRecipeById(id);
  }
} 