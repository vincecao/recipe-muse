import { container } from '../../infrastructure/config/dependency-injection';
import { RecipeAdapter, RecipeDTO, RecipeDetailDTO } from '../adapters/recipe.adapter';
import { Category, Lang, DbRecipe } from '../../domain/entities/recipe.entity';

export class RecipeService {
  static async getAllRecipes(lang: Lang = 'en'): Promise<RecipeDTO[]> {
    const useCase = container.getGetAllRecipesUseCase();
    const entities = await useCase.execute();
    return RecipeAdapter.toDTOList(entities, lang);
  }

  static async getRecipeById(id: string, lang: Lang = 'en'): Promise<RecipeDetailDTO | null> {
    const useCase = container.getGetRecipeByIdUseCase();
    const entity = await useCase.execute(id);
    
    if (!entity) {
      return null;
    }
    
    return RecipeAdapter.toDetailDTO(entity, lang);
  }

  static async getRecipesByCategory(lang: Lang = 'en'): Promise<Record<Category, RecipeDTO[]>> {
    const useCase = container.getGetRecipesByCategoryUseCase();
    const entitiesByCategory = await useCase.execute();
    
    const result: Record<Category, RecipeDTO[]> = {} as Record<Category, RecipeDTO[]>;
    
    for (const [category, entities] of Object.entries(entitiesByCategory)) {
      result[category as Category] = RecipeAdapter.toDTOList(entities, lang);
    }
    
    return result;
  }

  // For backward compatibility - returns DbRecipe format
  static async getAllRecipesLegacy(): Promise<DbRecipe[]> {
    const useCase = container.getGetAllRecipesUseCase();
    const entities = await useCase.execute();
    return entities.map(entity => RecipeAdapter.toDbRecipe(entity));
  }

  static async getRecipeByIdLegacy(id: string): Promise<DbRecipe | null> {
    const useCase = container.getGetRecipeByIdUseCase();
    const entity = await useCase.execute(id);
    
    if (!entity) {
      return null;
    }
    
    return RecipeAdapter.toDbRecipe(entity);
  }
} 