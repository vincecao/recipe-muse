import Anthropic from "@anthropic-ai/sdk";

export type LLMResponse = {
  content: string;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
  };
};

export type LLMRequest = {
  prompt: string;
  model: "deepseek-v3" | "claude-3-5-sonnet-20241022" | "claude-3-opus-20240229";
  temperature?: number;
  max_tokens?: number;
};

export class LLMClient {
  private readonly deepseekApiKey: string;
  private readonly anthropic: Anthropic;

  constructor() {
    this.deepseekApiKey = process.env.DEEPSEEK_API_KEY ?? ""; // Store in .env
    this.anthropic = new Anthropic();
  }

  async generate(payload: LLMRequest): Promise<LLMResponse> {
    const { prompt, model, temperature = 0.0, max_tokens = 4096 } = payload;

    // Automatically choose provider based on model
    const provider = this.getProviderForModel(model);
    if (provider === "deepseek") {
      return this.callDeepSeekAPI(prompt, model, temperature, max_tokens);
    } else if (provider === "anthropic") {
      return this.callAnthropicAPI(prompt, model, temperature, max_tokens);
    } else {
      throw new Error("Invalid model specified");
    }
  }

  private getProviderForModel(model: string): "deepseek" | "anthropic" {
    if (model === "deepseek-v3") {
      return "deepseek";
    } else if (model.startsWith("claude-")) {
      return "anthropic";
    } else {
      throw new Error("Unsupported model");
    }
  }

  private async callDeepSeekAPI(prompt: string, model: string, temperature: number, max_tokens: number): Promise<LLMResponse> {
    const response = await fetch("https://api.deepseek.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.deepseekApiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model,
        temperature,
        max_tokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
    };
  }

  private async callAnthropicAPI(prompt: string, model: string, temperature: number, max_tokens: number): Promise<LLMResponse> {
    const msg = await this.anthropic.messages.create({
      model,
      max_tokens,
      temperature,
      messages: [{ role: "user", content: prompt }],
    });
    if (!("text" in msg.content[0])) throw new Error(`Anthropic API Error: No text response`);
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
