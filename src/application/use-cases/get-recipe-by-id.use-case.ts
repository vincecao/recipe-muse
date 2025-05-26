import { RecipeEntity } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

export class GetRecipeByIdUseCase {
  constructor(
    private readonly recipeRepository: RecipeRepository
  ) {}

  async execute(id: string): Promise<RecipeEntity | null> {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid recipe ID provided');
    }

    const recipe = await this.recipeRepository.findById(id);
    
    if (!recipe) {
      return null;
    }

    return recipe;
  }
} 