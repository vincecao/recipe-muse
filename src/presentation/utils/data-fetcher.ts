import { container } from '../../infrastructure/config/dependency-injection';
import { RecipeService } from '../services/recipe.service';
import { RecipeDTO, RecipeDetailDTO } from '../adapters/recipe.adapter';
import { Category, Lang, DbRecipe } from '../../domain/entities/recipe.entity';

// Initialize the DI container once
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    await container.initialize();
    isInitialized = true;
  }
}

/**
 * Optimized data fetcher for Next.js SSR
 * Uses the clean architecture directly without HTTP calls
 */
export class DataFetcher {
  /**
   * Fetch all recipes for SSR - bypasses HTTP layer for better performance
   */
  static async fetchRecipesSSR(lang: Lang = 'en'): Promise<RecipeDTO[]> {
    await ensureInitialized();
    return RecipeService.getAllRecipes(lang);
  }

  /**
   * Fetch recipe by ID for SSR - bypasses HTTP layer for better performance
   */
  static async fetchRecipeSSR(id: string, lang: Lang = 'en'): Promise<RecipeDetailDTO | null> {
    await ensureInitialized();
    return RecipeService.getRecipeById(id, lang);
  }

  /**
   * Fetch recipes grouped by category for SSR
   */
  static async fetchRecipesByCategorySSR(lang: Lang = 'en'): Promise<Record<Category, RecipeDTO[]>> {
    await ensureInitialized();
    return RecipeService.getRecipesByCategory(lang);
  }

  /**
   * Legacy data fetcher for backward compatibility
   */
  static async fetchRecipesLegacySSR(): Promise<DbRecipe[]> {
    await ensureInitialized();
    return RecipeService.getAllRecipesLegacy();
  }

  /**
   * Legacy recipe by ID fetcher for backward compatibility
   */
  static async fetchRecipeLegacySSR(id: string): Promise<DbRecipe | null> {
    await ensureInitialized();
    return RecipeService.getRecipeByIdLegacy(id);
  }
}

/**
 * Client-side data fetcher that uses the API routes
 */
export class ClientDataFetcher {
  private static baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';

  static async fetchRecipes(lang: Lang = 'en'): Promise<RecipeDTO[]> {
    const response = await fetch(`${this.baseUrl}/api/v2/recipes?lang=${lang}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return response.json();
  }

  static async fetchRecipe(id: string, lang: Lang = 'en'): Promise<RecipeDetailDTO> {
    const response = await fetch(`${this.baseUrl}/api/v2/recipes/${id}?lang=${lang}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe');
    }
    return response.json();
  }

  // Legacy client-side fetchers
  static async fetchRecipesLegacy(): Promise<DbRecipe[]> {
    const response = await fetch(`${this.baseUrl}/api/recipe`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return response.json();
  }

  static async fetchRecipeLegacy(id: string): Promise<DbRecipe> {
    const response = await fetch(`${this.baseUrl}/api/recipe/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipe');
    }
    return response.json();
  }
} 