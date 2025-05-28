import { RecipeEntity } from '../entities/recipe.entity';

export interface RecipeRepository {
  findAll(): Promise<RecipeEntity[]>;
  findById(id: string): Promise<RecipeEntity | null>;
  save(recipe: RecipeEntity): Promise<RecipeEntity>;
  delete(id: string): Promise<void>;
} 