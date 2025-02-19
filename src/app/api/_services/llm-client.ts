import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import type { ChatCompletionMessageParam } from 'openai/resources/index';

export type LLMResponse = {
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
};

export enum DeepseekModel {
  CHAT = 'deepseek/deepseek-chat',
  REASONER = 'deepseek/deepseek-reasoner',
}

export enum AnthropicModel {
  SONNET = 'claude-3-5-sonnet-20241022',
  OPUS = 'claude-3-opus-20240229',
}

export enum OpenAIModel {
  GPT_4O_MINI = 'openai/gpt-4o-mini',
  O3_MINI = 'openai/o3-mini',
}

export type LLMRequest = {
  messages: ChatCompletionMessageParam[];
  model: DeepseekModel | AnthropicModel;
  temperature?: number;
  max_tokens?: number;
};

export class LLMClient {
  private readonly openaiClient: OpenAI;
  private readonly anthropicClient: Anthropic;

  constructor() {
    this.openaiClient = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPEN_ROUTER_API_KEY,
    });

    this.anthropicClient = new Anthropic();
  }

  async generate(payload: LLMRequest): Promise<LLMResponse> {
    const { messages, model, temperature = 0.0, max_tokens = 4096 } = payload;

    const provider = this.getProviderForModel(model);
    if (provider === 'open-router') {
      return this.callOpenRouter(messages, model, temperature, max_tokens);
    } else if (provider === 'anthropic') {
      return this.callAnthropic(messages, model, temperature, max_tokens);
    } else {
      throw new Error('Invalid model specified');
    }
  }

  private getProviderForModel(model: string): 'anthropic' | 'open-router' {
    if (model.includes('/')) {
      return 'open-router';
    } else if (model.startsWith('claude-')) {
      return 'anthropic';
    } else {
      throw new Error('Unsupported model');
    }
  }

  private async callOpenRouter(
    messages: ChatCompletionMessageParam[],
    model: LLMRequest['model'],
    temperature: number,
    max_tokens: number,
  ): Promise<LLMResponse> {
    const completion = await this.openaiClient.chat.completions.create({
      messages,
      model,
      temperature,
      max_tokens,
      // response_format: {
      //   type: 'text', // "json_object"
      // },
    });

    const [choice] = completion.choices;
    if (!choice?.message?.content) {
      throw new Error('No content in response');
    }

    console.log('Model content', choice.message.content);
    return {
      content: choice.message.content,
      model: completion.model,
      usage: completion.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
      },
    };
  }

  private async callAnthropic(
    messages: ChatCompletionMessageParam[],
    model: LLMRequest['model'],
    temperature: number,
    max_tokens: number,
  ): Promise<LLMResponse> {
    const system = messages.find(({ role }) => role === 'system')?.content as string | undefined;
    const msg = await this.anthropicClient.messages.create({
      system,
      model,
      max_tokens,
      temperature,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages.filter(({ role }) => role !== 'system') as any,
    });
    if (!('text' in msg.content[0])) throw new Error(`Anthropic API Error: No text response`);
    return {
      content: msg.content[0].text,
      model: msg.model,
      usage: {
        prompt_tokens: msg.usage.input_tokens,
        completion_tokens: msg.usage.output_tokens,
      },
    };
  }
}
