import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { FirebaseRecipeRepository } from '../repositories/firebase-recipe.repository';
import { CachedRecipeRepository } from '../repositories/cached-recipe.repository';
import { CacheService, RedisCacheService, LocalCacheService } from '../cache/cache.service';
import { GetAllRecipesUseCase } from '../../application/use-cases/get-all-recipes.use-case';
import { GetRecipeByIdUseCase } from '../../application/use-cases/get-recipe-by-id.use-case';
import { GetRecipesByCategoryUseCase } from '../../application/use-cases/get-recipes-by-category.use-case';

// Import existing services
import { firebaseDb } from '../../app/api/_services/firebase';
import { getRedisClient } from '../../core/redis.server';

export class DIContainer {
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
    // Initialize cache service
    let cacheService: CacheService;
    try {
      const redisClient = await getRedisClient();
      cacheService = new RedisCacheService(redisClient);
    } catch (error) {
      console.warn('Redis not available, falling back to local cache:', error);
      cacheService = new LocalCacheService();
    }
    this.services.set('cacheService', cacheService);

    // Initialize repositories
    const firebaseRepository = new FirebaseRecipeRepository(firebaseDb);
    const cachedRepository = new CachedRecipeRepository(firebaseRepository, cacheService);
    this.services.set('recipeRepository', cachedRepository);

    // Initialize use cases
    const getAllRecipesUseCase = new GetAllRecipesUseCase(cachedRepository);
    const getRecipeByIdUseCase = new GetRecipeByIdUseCase(cachedRepository);
    const getRecipesByCategoryUseCase = new GetRecipesByCategoryUseCase(cachedRepository);

    this.services.set('getAllRecipesUseCase', getAllRecipesUseCase);
    this.services.set('getRecipeByIdUseCase', getRecipeByIdUseCase);
    this.services.set('getRecipesByCategoryUseCase', getRecipesByCategoryUseCase);
  }

  get<T>(serviceName: string): T {
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

  getCacheService(): CacheService {
    return this.get<CacheService>('cacheService');
  }

  getGetAllRecipesUseCase(): GetAllRecipesUseCase {
    return this.get<GetAllRecipesUseCase>('getAllRecipesUseCase');
  }

  getGetRecipeByIdUseCase(): GetRecipeByIdUseCase {
    return this.get<GetRecipeByIdUseCase>('getRecipeByIdUseCase');
  }

  getGetRecipesByCategoryUseCase(): GetRecipesByCategoryUseCase {
    return this.get<GetRecipesByCategoryUseCase>('getRecipesByCategoryUseCase');
  }
}

// Export singleton instance
export const container = DIContainer.getInstance(); 