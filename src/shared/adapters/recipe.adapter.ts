import { RecipeEntity, DbRecipe } from '../../domain/entities/recipe.entity';

export class RecipeAdapter {
  // For backward compatibility with existing code
  static toDbRecipe(entity: RecipeEntity): DbRecipe {
    return entity.toDbRecipe();
  }

  static fromDbRecipe(dbRecipe: DbRecipe): RecipeEntity {
    return RecipeEntity.fromDbRecipe(dbRecipe);
  }

  static toDbRecipeList(entities: RecipeEntity[]): DbRecipe[] {
    return entities.map(entity => this.toDbRecipe(entity));
  }
} 