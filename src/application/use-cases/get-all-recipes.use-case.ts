import { RecipeEntity } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';

export class GetAllRecipesUseCase {
  constructor(
    private readonly recipeRepository: RecipeRepository
  ) {}

  async execute(): Promise<RecipeEntity[]> {
    const recipes = await this.recipeRepository.findAll();
    return recipes;
  }
} 