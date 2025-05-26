import { RecipeEntity, Category } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { RecipeDomainService } from '../../domain/services/recipe.domain-service';

export class GetRecipesByCategoryUseCase {
  constructor(
    private readonly recipeRepository: RecipeRepository
  ) {}

  async execute(): Promise<Record<Category, RecipeEntity[]>> {
    const recipes = await this.recipeRepository.findAll();
    return RecipeDomainService.groupRecipesByCategory(recipes);
  }
} 