// DEPRECATED: This file is kept for backward compatibility
// Please import from the new domain structure instead:
// - Domain types: src/domain/entities/llm.entity.ts
// - Or use the compatibility layer: src/types/index.ts

// Re-export all types from the new domain structure
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
