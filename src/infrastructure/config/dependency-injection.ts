import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { FirebaseRecipeRepository } from '../repositories/firebase-recipe.repository';
import { CachedRecipeRepository } from '../repositories/cached-recipe.repository';
import { ImageEnhancedRecipeRepository } from '../repositories/image-enhanced-recipe.repository';
import { RecipeImageUrlService } from '../services/recipe-image-url.service';
import { firebaseDb } from '../services/firebase.service';
import { CacheInterface } from '../../domain/interfaces/cache.interface';
import { RedisCacheService } from '../cache/redis-cache.service';
import { LocalCacheService } from '../cache/local-cache.service';
import { NextJSCacheService } from '../cache/nextjs-cache.service';
import { MultiCacheService } from '../cache/multi-cache.service';
import { GetAllRecipesUseCase } from '../../application/use-cases/get-all-recipes.use-case';
import { GetRecipeByIdUseCase } from '../../application/use-cases/get-recipe-by-id.use-case';

class DIContainer {
  private static instance: DIContainer;
  private services = new Map<string, unknown>();

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  async initialize(): Promise<void> {
    // Initialize cache services with configuration
    const REDIS_CACHE_EXPIRATION = Number(process.env.REDIS_CACHE_EXPIRATION) || 3600;
    const NEXTJS_CACHE_EXPIRATION = Number(process.env.NEXTJS_CACHE_EXPIRATION) || 3600;

    const redisConfig = {
      defaultTtl: REDIS_CACHE_EXPIRATION,
      enabled: true,
    };

    const localConfig = {
      defaultTtl: REDIS_CACHE_EXPIRATION,
      enabled: process.env.NODE_ENV === 'development',
    };

    const nextjsConfig = {
      defaultTtl: NEXTJS_CACHE_EXPIRATION,
      enabled: true,
    };

    const nextjsCache = new NextJSCacheService(nextjsConfig);
    // Create multi cache (local first, redis second, nextjs third)
    const cacheService = new MultiCacheService([
      nextjsCache,
      new LocalCacheService(localConfig),
      new RedisCacheService(redisConfig),
    ]);
    this.services.set('cacheService', cacheService);

    // Store individual cache services for direct access
    this.services.set('nextjsCacheService', nextjsCache);

    // Initialize repositories with optional image URL enhancement
    const recipesRepo = new ImageEnhancedRecipeRepository(
      new FirebaseRecipeRepository(firebaseDb),
      new RecipeImageUrlService(),
    );

    const withCachedRepo = new CachedRecipeRepository(recipesRepo, cacheService);

    this.services.set('recipeRepository', withCachedRepo);

    // Initialize use cases
    const getAllRecipesUseCase = new GetAllRecipesUseCase(withCachedRepo);
    const getRecipeByIdUseCase = new GetRecipeByIdUseCase(withCachedRepo);

    this.services.set('getAllRecipesUseCase', getAllRecipesUseCase);
    this.services.set('getRecipeByIdUseCase', getRecipeByIdUseCase);
  }

  private get<T>(serviceName: string): T {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    return service as T;
  }

  // Convenience getters
  getRecipeRepository(): RecipeRepository {
    return this.get<RecipeRepository>('recipeRepository');
  }

  getCacheService(): CacheInterface {
    return this.get<CacheInterface>('cacheService');
  }

  getNextJSCacheService(): NextJSCacheService {
    return this.get<NextJSCacheService>('nextjsCacheService');
  }

  getGetAllRecipesUseCase(): GetAllRecipesUseCase {
    return this.get<GetAllRecipesUseCase>('getAllRecipesUseCase');
  }

  getGetRecipeByIdUseCase(): GetRecipeByIdUseCase {
    return this.get<GetRecipeByIdUseCase>('getRecipeByIdUseCase');
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();
