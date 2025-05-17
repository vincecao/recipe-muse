import { NextResponse } from 'next/server';
import { Cuisine } from '~/types/recipe';
import { LLMClient, type LLMRequest } from '~/app/api/_services/llm-client';
import generate from '../_prompts/generate-recipe-names';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cuisinesParam = searchParams.get('cuisines');
    const lengthParam = searchParams.get('length') || '1';
    const familyParam = searchParams.get('family');
    const modelParam = searchParams.get('model');

    if (!modelParam || !familyParam) {
      return NextResponse.json({ error: 'Model parameter is required' }, { status: 400 });
    }

    const cuisines: Cuisine[] = JSON.parse(cuisinesParam || '[]');
    const length = parseInt(lengthParam);
    const family = familyParam as LLMRequest['family'];
    const model = modelParam as unknown as LLMRequest['model'];

    // Generate names with validated parameters
    const names = await generateRecipeNames(cuisines, length, family, model);
    return NextResponse.json(names);
  } catch (error) {
    console.error('Error generating recipe names:', error);
    return NextResponse.json({ error: 'Failed to generate recipe names' }, { status: 500 });
  }
}

const generateRecipeNames = async (
  cuisines: Cuisine[],
  length: number,
  family: LLMRequest['family'],
  model: LLMRequest['model'],
) => {
  const llmClient = new LLMClient();
  console.log('home recipe names started', cuisines, length, model);
  const [system, user, , responseFormat] = generate(cuisines, length);
  const response = await llmClient.processLlm<string[]>({
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
};
