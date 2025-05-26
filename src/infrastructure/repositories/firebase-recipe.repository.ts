import { RecipeEntity, DbRecipe, Cuisine } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

interface FirebaseService {
  getAllRecipes(): Promise<DbRecipe[]>;
  getRecipe(id: string): Promise<DbRecipe | null>;
  saveRecipe(recipe: DbRecipe): Promise<void>;
  deleteRecipeById(id: string): Promise<void>;
  getRecipesByCategory?(category: string): Promise<DbRecipe[]>;
  getRecipesByCuisine?(cuisine: string): Promise<DbRecipe[]>;
  getRecipesByDifficulty?(difficulty: string): Promise<DbRecipe[]>;
}

export class FirebaseRecipeRepository implements RecipeRepository {
  constructor(private readonly firebaseDb: FirebaseService) {}

  async findAll(): Promise<RecipeEntity[]> {
    try {
      const recipes = await this.firebaseDb.getAllRecipes();
      return recipes.map((recipe: DbRecipe) => RecipeEntity.fromDbRecipe(recipe));
    } catch (error) {
      console.error('Error fetching all recipes:', error);
      throw new Error('Failed to fetch recipes');
    }
  }

  async findById(id: string): Promise<RecipeEntity | null> {
    try {
      const recipe = await this.firebaseDb.getRecipe(id);
      return recipe ? RecipeEntity.fromDbRecipe(recipe) : null;
    } catch (error) {
      console.error('Error fetching recipe by ID:', error);
      throw new Error('Failed to fetch recipe');
    }
  }

  async save(recipe: RecipeEntity): Promise<RecipeEntity> {
    try {
      await this.firebaseDb.saveRecipe(recipe.toDbRecipe());
      return recipe; // Return the original recipe since Firebase doesn't return the saved recipe
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw new Error('Failed to save recipe');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.firebaseDb.deleteRecipeById(id);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw new Error('Failed to delete recipe');
    }
  }

  async findByCategory(category: string): Promise<RecipeEntity[]> {
    try {
      if (this.firebaseDb.getRecipesByCategory) {
        const recipes = await this.firebaseDb.getRecipesByCategory(category);
        return recipes.map((recipe: DbRecipe) => RecipeEntity.fromDbRecipe(recipe));
      }
      // Fallback: get all recipes and filter
      const allRecipes = await this.findAll();
      return allRecipes.filter(recipe => recipe.getCategory() === category);
    } catch (error) {
      console.error('Error fetching recipes by category:', error);
      throw new Error('Failed to fetch recipes by category');
    }
  }

  async findByCuisine(cuisine: string): Promise<RecipeEntity[]> {
    try {
      if (this.firebaseDb.getRecipesByCuisine) {
        const recipes = await this.firebaseDb.getRecipesByCuisine(cuisine);
        return recipes.map((recipe: DbRecipe) => RecipeEntity.fromDbRecipe(recipe));
      }
      // Fallback: get all recipes and filter
      const allRecipes = await this.findAll();
      return allRecipes.filter(recipe => 
        recipe.getRecipeByLanguage('en').cuisine.includes(cuisine as Cuisine)
      );
    } catch (error) {
      console.error('Error fetching recipes by cuisine:', error);
      throw new Error('Failed to fetch recipes by cuisine');
    }
  }

  async findByDifficulty(difficulty: string): Promise<RecipeEntity[]> {
    try {
      if (this.firebaseDb.getRecipesByDifficulty) {
        const recipes = await this.firebaseDb.getRecipesByDifficulty(difficulty);
        return recipes.map((recipe: DbRecipe) => RecipeEntity.fromDbRecipe(recipe));
      }
      // Fallback: get all recipes and filter
      const allRecipes = await this.findAll();
      return allRecipes.filter(recipe => recipe.getDifficultyLevel() === difficulty);
    } catch (error) {
      console.error('Error fetching recipes by difficulty:', error);
      throw new Error('Failed to fetch recipes by difficulty');
    }
  }
} 