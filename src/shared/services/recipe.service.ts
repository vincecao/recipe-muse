import { container } from '../../infrastructure/config/dependency-injection';
import { RecipeAdapter } from '../adapters/recipe.adapter';
import type { DbRecipe } from '../../domain/entities/recipe.entity';

export class RecipeService {
  // Main service methods - return DbRecipe format that components actually use
  static async getAllRecipes(): Promise<DbRecipe[]> {
    const useCase = container.getGetAllRecipesUseCase();
    const entities = await useCase.execute();
    return RecipeAdapter.toDbRecipeList(entities);
  }

  static async getRecipeById(id: string): Promise<DbRecipe | null> {
    const useCase = container.getGetRecipeByIdUseCase();
    const entity = await useCase.execute(id);
    
    if (!entity) {
      return null;
    }
    
    return RecipeAdapter.toDbRecipe(entity);
  }
} 