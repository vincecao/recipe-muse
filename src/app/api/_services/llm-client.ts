import OpenAI from 'openai';
import type {
  ChatCompletion,
  ChatCompletionMessage,
  ChatCompletionMessageParam,
  ChatCompletionTool,
  Model,
  ResponseFormatJSONObject,
  ResponseFormatJSONSchema,
  ResponseFormatText,
} from 'openai/resources/index';
import { fetchRecipes } from '~/app/menu/_utils/data';
import { ModelFamily } from '~/types/llm';

/** tools */
async function count(input: { text: string }): Promise<{ length: number }> {
  return { length: input.text.length };
}

async function getMenuReference({ originalAnswer, queries }: { originalAnswer: string; queries: string[] }) {
  const menuData = await fetchRecipes();
  const lowerCaseQueries = queries.map((q) => q.toLowerCase());

  const results = menuData.filter((item) => {
    const lowerTitle = item.en.title.toLowerCase();
    const lowerDescription = item.en.description.toLowerCase();

    return lowerCaseQueries.some(
      (query) =>
        lowerTitle.includes(query) ||
        lowerDescription.includes(query) ||
        item.en.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(query)),
    );
  });

  return {
    message: originalAnswer,
    recipes: results,
  };
}

export const TOOL_COMPLETION_REQUEST: { [key in string]: ChatCompletionTool } = {
  count: {
    type: 'function',
    function: {
      name: 'count',
      description: 'Count the number of characters in a given text string',
      parameters: {
        type: 'object',
        properties: {
          text: {
            type: 'string',
            description: 'The text string to count characters for',
          },
        },
        required: ['text'],
      },
    },
  },
  getMenuReference: {
    type: 'function',
    function: {
      name: 'getMenuReference',
      description:
        'Search for menu items and return evidence from the menu data. Use this for any recipe or menu related queries.',
      parameters: {
        type: 'object',
        properties: {
          originalAnswer: {
            type: 'string',
            description: 'The original answer from llm.',
          },
          queries: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'The search queries for menu items. Should be a list of recipe ingredients to search for.',
          },
        },
        required: ['originalAnswer', 'queries'],
      },
    },
  },
};

const TOOL_COMPLETION_RESPONSE = {
  count,
  getMenuReference,
};

/** type and interface */

export type LLMRequest = {
  messages: ChatCompletionMessageParam[];
  family: ModelFamily;
  model: Model;
  temperature?: number;
  max_tokens?: number;
  stream?: false | null | undefined;
  response_format?: ResponseFormatText | ResponseFormatJSONObject | ResponseFormatJSONSchema;
  tools?: ChatCompletionTool[];
};

export type LLMResponse<T> = {
  content: T;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
};

const DEFAULT_USAGE = {
  prompt_tokens: 0,
  completion_tokens: 0,
  total_tokens: 0,
};

export class LLMClient {
  private readonly openRouterClient: OpenAI;

  constructor(
    private readonly CONFIG = {
      baseURL: 'https://openrouter.ai/api/v1' as const,
      apiKey: process.env.OPEN_ROUTER_API_KEY,
    },
  ) {
    this.openRouterClient = new OpenAI(this.CONFIG);
  }

  async processLlm<T = string>(
    payload: LLMRequest,
  ): Promise<LLMResponse<T> | /*AsyncIterable<LLMResponse<T>>*/ { content: T }> {
    const { family, model, tools, response_format } = payload;

    if (!family || !model) {
      throw new Error('Family and model are required');
    }

    const createOption = this.createLlmOptions(payload);
    const completion = await this.openRouterClient.chat.completions.create(createOption);

    return this.handleNonStreamingResponse<T>(completion, !!tools, !!response_format);

    /** @todo Handle streaming response
     *
     * if (stream) return this.handleStreamingResponse<T>(completion);
     */
  }

  private createLlmOptions(payload: LLMRequest) {
    const { messages, family, model, temperature = 0.0, max_tokens = 4096, stream, response_format, tools } = payload;
    return {
      messages,
      model: `${family}/${model}`,
      temperature,
      max_tokens,
      stream,
      response_format,
      tools,
    };
  }

  private handleNonStreamingResponse<T>(
    completion: ChatCompletion,
    hasTools: boolean,
    hasStructOutput: boolean,
  ): LLMResponse<T> | Promise<LLMResponse<T>> {
    const responseHandler = hasTools ? this.handleLlmResponseWithTool : this.handleLlmResponseWithoutTool;
    return responseHandler<T>(completion, hasStructOutput);
  }

  /*
  private async *handleStreamingResponse<T>(completion: AsyncIterable<any>): AsyncIterable<LLMResponse<T>> {
    for await (const chunk of completion) {
      const [choice] = chunk.choices;
      if (choice?.delta?.content) {
        yield {
          content: choice.delta.content as T,
          model: chunk.model,
          usage: chunk.usage || DEFAULT_USAGE,
        };
      }
    }
  }
  */

  private handleLlmResponseWithoutTool<T>(completion: ChatCompletion, hasStructOutput: boolean): LLMResponse<T> {
    console.log({ completion: JSON.stringify(completion, null, 2) });

    if (!completion.choices || !Array.isArray(completion.choices) || completion.choices.length === 0) {
      throw new Error('Invalid response: No choices available');
    }
    const [choice] = completion.choices;
    if (!choice?.message?.content) {
      throw new Error('No content in response');
    }

    console.log('Model content', choice.message.content);
    return {
      content: (!hasStructOutput ? choice.message.content : JSON.parse(choice.message.content)) as T,
      model: completion.model,
      usage: completion.usage || DEFAULT_USAGE,
    };
  }

  private async handleLlmResponseWithTool<T>(completion: ChatCompletion): Promise<LLMResponse<T>> {
    console.log({ completion: JSON.stringify(completion, null, 2) });

    if (!completion.choices || !Array.isArray(completion.choices) || completion.choices.length === 0) {
      throw new Error('Invalid response: No choices available');
    }

    const [choice] = completion.choices;

    const rawResponse = {
      content: { message: 'No tool is called. Please try again' } as T, // Cannot specify `response format` and `function` call at the same time
      model: completion.model,
      usage: completion.usage || DEFAULT_USAGE,
    };

    // Validate completion.choices
    if (!choice.message.tool_calls?.[0]) {
      console.log('No tool called');
      return rawResponse;
    }

    // Process the tool call
    const toolResponse = await getToolResponse<Partial<T>>(choice.message);
    return {
      ...rawResponse,
      content: {
        ...rawResponse.content,
        ...toolResponse.content,
      },
    };
  }
}

async function getToolResponse<Response>(
  response: ChatCompletionMessage,
): Promise<{ role: 'tool'; toolCallId: string; name: string; content: Response }> {
  const [toolCall] = response.tool_calls || [];
  const toolName = toolCall.function.name;
  const toolArgs = JSON.parse(toolCall.function.arguments);

  const toolFunction = TOOL_COMPLETION_RESPONSE[toolName as keyof typeof TOOL_COMPLETION_RESPONSE];
  if (!toolFunction) {
    throw new Error(`Tool function ${toolName} not found`);
  }
  const toolResult = await toolFunction(toolArgs);

  return {
    role: 'tool',
    toolCallId: toolCall.id,
    name: toolName,
    content: toolResult as Response,
  };
}

/**
 * Examples
 * 
 * 1. Non-Streaming with Tools
  const llmClient = new LlmClient(openRouterClient);
  const payload: LLMRequest = {
    messages: [{ role: 'user', content: 'Search for books about TypeScript' }],
    family: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    tools: [{ type: 'function', function: { name: 'searchGutenbergBooks', description: 'Search for books' } }],
  };

  const response = await llmClient.processLlm(payload);
  console.log(response.content); // Output: Array of books about TypeScript

  * 2. Streaming without Tools
  const llmClient = new LlmClient(openRouterClient);
  const payload: LLMRequest = {
    messages: [{ role: 'user', content: 'Hello, world!' }],
    family: 'openai',
    model: 'gpt-4o-mini',
    temperature: 0.7,
    stream: true,
  };

  const streamResponse = await llmClient.processLlm(payload);
  for await (const chunk of streamResponse) {
    console.log(chunk.content); // Outputs incremental content as it arrives
  }
 */
