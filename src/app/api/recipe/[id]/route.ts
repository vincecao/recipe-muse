import { NextRequest } from 'next/server';
import { RecipeController } from '~/application/controllers/recipe.controller';

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteProps) {
  return RecipeController.getRecipeById(request, { params });
}
