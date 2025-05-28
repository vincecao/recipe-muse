import { NextRequest } from 'next/server';
import { LLMController } from '~/application/controllers/llm.controller';

export async function GET(request: NextRequest) {
  return LLMController.generateRecipe(request);
}
