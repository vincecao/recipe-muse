import { container } from '~/infrastructure/config/dependency-injection';
import { RecipeService } from '../services/recipe.service';
import { ensureInitialized } from './data-fetcher';
import type { DbRecipe } from '~/domain/entities/recipe.entity';

export class CachedDataFetcher {
  static async fetchRecipesSSR(): Promise<DbRecipe[]> {
    await ensureInitialized();
    const nextjsCache = container.getNextJSCacheService();
    const cacheKey = 'recipe:all';
    const tags = nextjsCache.getTagsForKey(cacheKey);
    
    const cachedFn = nextjsCache.createCachedFunction(
      async () => RecipeService.getAllRecipes(),
      [cacheKey],
      { tags }
    );
    
    return cachedFn();
  }

  static async fetchRecipeSSR(id: string): Promise<DbRecipe | null> {
    await ensureInitialized();
    const nextjsCache = container.getNextJSCacheService();
    const cacheKey = `recipe:id:${id}`;
    const tags = nextjsCache.getTagsForKey(cacheKey);
    
    const cachedFn = nextjsCache.createCachedFunction(
      async () => RecipeService.getRecipeById(id),
      [cacheKey],
      { tags }
    );
    
    return cachedFn();
  }
} 