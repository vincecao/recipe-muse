// DEPRECATED: This file is kept for backward compatibility
// Please import from the new domain structure instead:
// - Domain types: src/domain/entities/recipe.entity.ts
// - Translations: src/domain/value-objects/translations.vo.ts
// - Or use the compatibility layer: src/types/index.ts

// Re-export all types from the new domain structure
export type {
  Difficulty,
  Category,
  Lang,
  Cuisine,
  Dish,
  Recipe,
  RecipeIngredient,
  RecipeInstruction,
  BaseDbRecipe,
  DbRecipe
} from '../domain/entities/recipe.entity';

export { RecipeEntity } from '../domain/entities/recipe.entity';

export {
  difficultyTranslations,
  categoryTranslations,
  TranslationService
} from '../domain/value-objects/translations.vo';
