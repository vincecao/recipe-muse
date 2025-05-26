import { NextResponse } from 'next/server';
import { container } from '../../../infrastructure/config/dependency-injection';
import { RecipeService } from '../../../presentation/services/recipe.service';

// Initialize the DI container
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await container.initialize();
    isInitialized = true;
  }
}

export async function GET() {
  try {
    await ensureInitialized();
    
    // Use the new clean architecture service for better performance and caching
    const recipes = await RecipeService.getAllRecipesLegacy();
    console.log('Recipes fetched via clean architecture');
    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Retrieval all recipes failed:', error);
    return NextResponse.json({ error: 'Failed to retrieve all recipes' }, { status: 500 });
  }
}
