import { RecipeEntity, Category } from '../entities/recipe.entity';

export class RecipeDomainService {
  static groupRecipesByCategory(recipes: RecipeEntity[]): Record<Category, RecipeEntity[]> {
    return recipes.reduce((acc: Record<Category, RecipeEntity[]>, recipe: RecipeEntity) => {
      const category = recipe.getCategory();
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(recipe);
      return acc;
    }, {} as Record<Category, RecipeEntity[]>);
  }

  static filterRecipesByDifficulty(recipes: RecipeEntity[], difficulty: string): RecipeEntity[] {
    return recipes.filter(recipe => recipe.getDifficultyLevel() === difficulty);
  }

  static filterVegetarianRecipes(recipes: RecipeEntity[]): RecipeEntity[] {
    return recipes.filter(recipe => recipe.isVegetarian());
  }

  static filterVeganRecipes(recipes: RecipeEntity[]): RecipeEntity[] {
    return recipes.filter(recipe => recipe.isVegan());
  }

  static sortRecipesByTotalTime(recipes: RecipeEntity[]): RecipeEntity[] {
    return [...recipes].sort((a, b) => a.getTotalTime() - b.getTotalTime());
  }

  static sortRecipesByDifficulty(recipes: RecipeEntity[]): RecipeEntity[] {
    const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
    return [...recipes].sort((a, b) => 
      difficultyOrder[a.getDifficultyLevel()] - difficultyOrder[b.getDifficultyLevel()]
    );
  }
} 