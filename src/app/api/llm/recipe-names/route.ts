import { NextResponse } from 'next/server';
import { Cuisine } from '~/core/type';
import { LLMClient, type LLMRequest } from '~/app/api/_services/llm-client';
import generate from '../_prompts/generate-recipe-names';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cuisinesParam = searchParams.get('cuisines');
    const lengthParam = searchParams.get('length') || '1';
    const modelParam = searchParams.get('model');

    if (!modelParam) {
      return NextResponse.json({ error: 'Model parameter is required' }, { status: 400 });
    }

    const cuisines: Cuisine[] = JSON.parse(cuisinesParam || '[]');
    const length = parseInt(lengthParam);
    const model = modelParam as LLMRequest['model'];

    // Generate names with validated parameters
    const names = await generateRecipeNames(cuisines, length, model);
    return NextResponse.json(names);
  } catch (error) {
    console.error('Error generating recipe names:', error);
    return NextResponse.json({ error: 'Failed to generate recipe names' }, { status: 500 });
  }
}

const generateRecipeNames = async (cuisines: Cuisine[], length: number, model: LLMRequest['model']) => {
  const llmClient = new LLMClient();
  console.log('home recipe names started', cuisines, length, model);
  const [system, user] = generate(cuisines, length);
  const response = await llmClient.generate({
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ],
    model,
  });
  console.log('Recipe names generated', response.content);
  return JSON.parse(response.content);
};
