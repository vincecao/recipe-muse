import { NextRequest, NextResponse } from 'next/server';
import { container } from '../../../../../infrastructure/config/dependency-injection';
import { RecipeService } from '../../../../../presentation/services/recipe.service';

// Initialize the DI container
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await container.initialize();
    isInitialized = true;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await ensureInitialized();
    
    const { searchParams } = new URL(request.url);
    const lang = (searchParams.get('lang') as 'en' | 'zh' | 'ja') || 'en';
    const format = searchParams.get('format') || 'dto';
    
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Recipe ID is required' },
        { status: 400 }
      );
    }
    
    // Use the new clean architecture service
    if (format === 'legacy') {
      const recipe = await RecipeService.getRecipeByIdLegacy(id);
      if (!recipe) {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(recipe);
    } else {
      const recipe = await RecipeService.getRecipeById(id, lang);
      if (!recipe) {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(recipe);
    }
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipe', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Add caching headers for better performance
export const revalidate = 3600; // 1 hour
export const dynamic = 'force-static'; 