// Compatibility layer for smooth migration
// Re-export domain types for backward compatibility

// Recipe domain types
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

// Translation types and constants
export {
  difficultyTranslations,
  categoryTranslations,
  TranslationService
} from '../domain/value-objects/translations.vo';

// LLM domain types
export type {
  Model
} from '../domain/entities/llm.entity';

export {
  ModelFamily,
  DeepseekModel,
  AnthropicModel,
  OpenAIModel,
  LlamaModel,
  LLMConfiguration
} from '../domain/entities/llm.entity';

// Presentation layer types
export type {
  RecipeDTO,
  RecipeDetailDTO
} from '../presentation/adapters/recipe.adapter';

export { RecipeAdapter } from '../presentation/adapters/recipe.adapter'; 