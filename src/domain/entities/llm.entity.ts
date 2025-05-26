export enum ModelFamily {
  DEEPSEEK = 'deepseek',
  ANTHROPIC = 'anthropic',
  OPENAI = 'openai',
  LLAMA = 'meta-llama',
}

export enum DeepseekModel {
  CHAT = 'deepseek-chat',
  REASONER = 'deepseek-r1',
}

export enum AnthropicModel {
  SONNET = 'claude-3.5-sonnet',
  OPUS = 'claude-3-opus',
  HAIKU = 'claude-3.5-haiku',
}

export enum OpenAIModel {
  GPT_4O_MINI = 'gpt-4o-mini',
  O3_MINI = 'o3-mini',
}

export enum LlamaModel {
  LLAMA4_SCOUT = 'llama-4-scout:free',
  LLAMA4_MAVERICK = 'llama-4-maverick:free',
}

export type Model = DeepseekModel | AnthropicModel | OpenAIModel | LlamaModel;

// Domain entity for LLM configuration
export class LLMConfiguration {
  constructor(
    private readonly family: ModelFamily,
    private readonly model: Model
  ) {}

  get modelFamily(): ModelFamily {
    return this.family;
  }

  get modelName(): Model {
    return this.model;
  }

  isDeepseek(): boolean {
    return this.family === ModelFamily.DEEPSEEK;
  }

  isAnthropic(): boolean {
    return this.family === ModelFamily.ANTHROPIC;
  }

  isOpenAI(): boolean {
    return this.family === ModelFamily.OPENAI;
  }

  isLlama(): boolean {
    return this.family === ModelFamily.LLAMA;
  }

  static createDeepseek(model: DeepseekModel): LLMConfiguration {
    return new LLMConfiguration(ModelFamily.DEEPSEEK, model);
  }

  static createAnthropic(model: AnthropicModel): LLMConfiguration {
    return new LLMConfiguration(ModelFamily.ANTHROPIC, model);
  }

  static createOpenAI(model: OpenAIModel): LLMConfiguration {
    return new LLMConfiguration(ModelFamily.OPENAI, model);
  }

  static createLlama(model: LlamaModel): LLMConfiguration {
    return new LLMConfiguration(ModelFamily.LLAMA, model);
  }
} 