import { NextRequest, NextResponse } from 'next/server';
import { container } from '../../../../infrastructure/config/dependency-injection';
import { RecipeService } from '../../../../presentation/services/recipe.service';

// Initialize the DI container
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await container.initialize();
    isInitialized = true;
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureInitialized();
    
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') as 'en' | 'zh' | 'ja') || 'en';
    const format = searchParams.get('format') || 'dto';
    
    // Use the new clean architecture service
    if (format === 'legacy') {
      const recipes = await RecipeService.getAllRecipesLegacy();
      return NextResponse.json(recipes);
    } else {
      const recipes = await RecipeService.getAllRecipes(lang);
      return NextResponse.json(recipes);
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Add caching headers for better performance
export const revalidate = 3600; // 1 hour
export const dynamic = 'force-static'; 