import { RecipeEntity } from '../entities/recipe.entity';

export interface RecipeRepository {
  findAll(): Promise<RecipeEntity[]>;
  findById(id: string): Promise<RecipeEntity | null>;
  save(recipe: RecipeEntity): Promise<RecipeEntity>;
  delete(id: string): Promise<void>;
  findByCategory(category: string): Promise<RecipeEntity[]>;
  findByCuisine(cuisine: string): Promise<RecipeEntity[]>;
  findByDifficulty(difficulty: string): Promise<RecipeEntity[]>;
} 