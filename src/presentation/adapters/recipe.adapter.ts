import { RecipeEntity, DbRecipe, Recipe, Category, Lang } from '../../domain/entities/recipe.entity';

// DTOs for the presentation layer
export interface RecipeDTO {
  id: string;
  category: Category;
  title: string;
  description: string;
  difficulty: string;
  ingredientsCount: number;
  time: string;
  calories: number;
  tags: string[];
  servingSize: string;
  allergens?: string[];
  cuisine: string[];
  images: string[];
  prepTime: number;
  cookTime: number;
  totalTime: number;
  isVegetarian: boolean;
  isVegan: boolean;
}

export interface RecipeDetailDTO extends RecipeDTO {
  ingredients: Recipe['ingredients'];
  instructions: Recipe['instructions'];
  tools?: string[];
  videoUrl?: string;
}

export class RecipeAdapter {
  static toDTO(entity: RecipeEntity, lang: Lang = 'en'): RecipeDTO {
    const recipe = entity.getRecipeByLanguage(lang);
    
    return {
      id: entity.id,
      category: recipe.category,
      title: recipe.title,
      description: recipe.description,
      difficulty: recipe.difficulty,
      ingredientsCount: recipe.ingredientsCount,
      time: recipe.time,
      calories: recipe.calories,
      tags: recipe.tags,
      servingSize: recipe.servingSize,
      allergens: recipe.allergens,
      cuisine: recipe.cuisine,
      images: entity.images,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      totalTime: entity.getTotalTime(),
      isVegetarian: entity.isVegetarian(),
      isVegan: entity.isVegan(),
    };
  }

  static toDetailDTO(entity: RecipeEntity, lang: Lang = 'en'): RecipeDetailDTO {
    const recipe = entity.getRecipeByLanguage(lang);
    const baseDTO = this.toDTO(entity, lang);
    
    return {
      ...baseDTO,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      tools: recipe.tools,
      videoUrl: recipe.videoUrl,
    };
  }

  static toDTOList(entities: RecipeEntity[], lang: Lang = 'en'): RecipeDTO[] {
    return entities.map(entity => this.toDTO(entity, lang));
  }

  // For backward compatibility with existing code
  static toDbRecipe(entity: RecipeEntity): DbRecipe {
    return entity.toDbRecipe();
  }

  static fromDbRecipe(dbRecipe: DbRecipe): RecipeEntity {
    return RecipeEntity.fromDbRecipe(dbRecipe);
  }
} 