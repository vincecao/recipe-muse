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
