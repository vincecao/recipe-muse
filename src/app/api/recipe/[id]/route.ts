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

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  const { id } = await params;
  try {
    await ensureInitialized();
    
    // Use the new clean architecture service for better performance and caching
    const recipe = await RecipeService.getRecipeByIdLegacy(id);
    
    if (!recipe) {
      return NextResponse.json({ error: `Recipe with id <${id}> not found` }, { status: 404 });
    }
    
    console.log("Recipe fetched via clean architecture", id);
    return NextResponse.json(recipe);
  } catch (error) {
    console.error(`Retrieval recipes id <${id}> failed:`, error);
    return NextResponse.json({ error: `Failed to retrieve recipes id <${id}>` }, { status: 500 });
  }
}
