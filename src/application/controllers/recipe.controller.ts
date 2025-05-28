import { NextRequest, NextResponse } from 'next/server';
import { container } from '~/infrastructure/config/dependency-injection';

export class RecipeController {
  static async getAllRecipes(): Promise<NextResponse> {
    try {
      await container.initialize();
      const useCase = container.getGetAllRecipesUseCase();
      const recipes = await useCase.execute();
      
      // Convert to DbRecipe format for API response
      const dbRecipes = recipes.map(recipe => recipe.toDbRecipe());
      
      return NextResponse.json(dbRecipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recipes' },
        { status: 500 }
      );
    }
  }

  static async getRecipeById(request: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    try {
      const { id } = await params;
      
      await container.initialize();
      const useCase = container.getGetRecipeByIdUseCase();
      const recipe = await useCase.execute(id);
      
      if (!recipe) {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        );
      }
      
      // Convert to DbRecipe format for API response
      const dbRecipe = recipe.toDbRecipe();
      
      return NextResponse.json(dbRecipe);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recipe' },
        { status: 500 }
      );
    }
  }
} 