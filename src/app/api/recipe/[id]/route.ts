import { NextRequest, NextResponse } from 'next/server';
import { cachedRecipeById } from '~/core/cache';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const { id } = await params;
  try {
    const recipe = await cachedRecipeById(id);
    return NextResponse.json(recipe);
  } catch (error) {
    console.error(`Retrieval recipes id <${id}> failed:`, error);
    return NextResponse.json({ error: `Failed to retrieve recipes id <${id}>` }, { status: 500 });
  }
}
