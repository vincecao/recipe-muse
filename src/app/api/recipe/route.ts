import { NextResponse } from 'next/server';
import { cachedRecipes } from '~/core/cache';

export async function GET() {
  try {
    const recipes = await cachedRecipes();
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Retrieval all recipes failed:', error);
    return NextResponse.json({ error: 'Failed to retrieve all recipes' }, { status: 500 });
  }
}
