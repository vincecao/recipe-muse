import { Cuisine } from '~/domain/entities/recipe.entity';
import { LLMService, type LLMRequest } from '~/infrastructure/services/llm.service';
import generate from '~/infrastructure/prompts/generate-recipe-names';

export class GenerateRecipeNamesUseCase {
  constructor(private llmService: LLMService) {}

  async execute(
    cuisines: Cuisine[],
    length: number,
    family: LLMRequest['family'],
    model: LLMRequest['model'],
  ): Promise<string[]> {
    console.log('Generating recipe names started', cuisines, length, model);
    
    const [system, user, , responseFormat] = generate(cuisines, length);
    
    const response = await this.llmService.processLlm<string[]>({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      model,
      family,
      response_format: responseFormat,
    });
    
    console.log('Recipe names generated', response.content);
    return response.content;
  }
} 