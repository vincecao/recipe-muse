import { NextRequest } from 'next/server';
import { LLMController } from '~/application/controllers/llm.controller';

export async function POST(request: NextRequest) {
  return LLMController.processChat(request);
}
