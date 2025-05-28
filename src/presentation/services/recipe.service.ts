import { container } from '../../infrastructure/config/dependency-injection';
import { RecipeAdapter } from '../adapters/recipe.adapter';
import { Category, DbRecipe } from '../../domain/entities/recipe.entity';

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

  static async getRecipesByCategory(): Promise<Record<Category, DbRecipe[]>> {
    const useCase = container.getGetRecipesByCategoryUseCase();
    const entitiesByCategory = await useCase.execute();
    
    const result: Record<Category, DbRecipe[]> = {} as Record<Category, DbRecipe[]>;
    
    for (const [category, entities] of Object.entries(entitiesByCategory)) {
      result[category as Category] = RecipeAdapter.toDbRecipeList(entities);
    }
    
    return result;
  }
} 