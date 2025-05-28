import { RecipeEntity, DbRecipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

interface FirebaseService {
  getAllRecipes(): Promise<DbRecipe[]>;
  getRecipe(id: string): Promise<DbRecipe | null>;
  saveRecipe(recipe: DbRecipe): Promise<void>;
  deleteRecipeById(id: string): Promise<void>;
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
} 