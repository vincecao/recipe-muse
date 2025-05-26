import { RecipeEntity, DbRecipe } from '../../domain/entities/recipe.entity';
import { RecipeRepository } from '../../domain/repositories/recipe.repository';
import { CacheService } from '../cache/cache.service';

export class CachedRecipeRepository implements RecipeRepository {
  private readonly CACHE_TTL = 3600; // 1 hour
  private readonly CACHE_PREFIX = 'recipe:';

  constructor(
    private readonly repository: RecipeRepository,
    private readonly cacheService: CacheService
  ) {}

  async findAll(): Promise<RecipeEntity[]> {
    const cacheKey = `${this.CACHE_PREFIX}all`;
    
    const cached = await this.cacheService.get<DbRecipe[]>(cacheKey);
    if (cached) {
      return cached.map(data => RecipeEntity.fromDbRecipe(data));
    }

    const recipes = await this.repository.findAll();
    await this.cacheService.set(cacheKey, recipes.map(r => r.toDbRecipe()), this.CACHE_TTL);
    
    return recipes;
  }

  async findById(id: string): Promise<RecipeEntity | null> {
    const cacheKey = `${this.CACHE_PREFIX}id:${id}`;
    
    const cached = await this.cacheService.get<DbRecipe>(cacheKey);
    if (cached) {
      return RecipeEntity.fromDbRecipe(cached);
    }

    const recipe = await this.repository.findById(id);
    if (recipe) {
      await this.cacheService.set(cacheKey, recipe.toDbRecipe(), this.CACHE_TTL);
    }
    
    return recipe;
  }

  async save(recipe: RecipeEntity): Promise<RecipeEntity> {
    const savedRecipe = await this.repository.save(recipe);
    
    // Invalidate related caches
    await this.cacheService.delete(`${this.CACHE_PREFIX}all`);
    await this.cacheService.delete(`${this.CACHE_PREFIX}id:${savedRecipe.id}`);
    await this.cacheService.delete(`${this.CACHE_PREFIX}category:${savedRecipe.getCategory()}`);
    
    return savedRecipe;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
    
    // Invalidate related caches
    await this.cacheService.delete(`${this.CACHE_PREFIX}all`);
    await this.cacheService.delete(`${this.CACHE_PREFIX}id:${id}`);
  }

  async findByCategory(category: string): Promise<RecipeEntity[]> {
    const cacheKey = `${this.CACHE_PREFIX}category:${category}`;
    
    const cached = await this.cacheService.get<DbRecipe[]>(cacheKey);
    if (cached) {
      return cached.map(data => RecipeEntity.fromDbRecipe(data));
    }

    const recipes = await this.repository.findByCategory(category);
    await this.cacheService.set(cacheKey, recipes.map(r => r.toDbRecipe()), this.CACHE_TTL);
    
    return recipes;
  }

  async findByCuisine(cuisine: string): Promise<RecipeEntity[]> {
    const cacheKey = `${this.CACHE_PREFIX}cuisine:${cuisine}`;
    
    const cached = await this.cacheService.get<DbRecipe[]>(cacheKey);
    if (cached) {
      return cached.map(data => RecipeEntity.fromDbRecipe(data));
    }

    const recipes = await this.repository.findByCuisine(cuisine);
    await this.cacheService.set(cacheKey, recipes.map(r => r.toDbRecipe()), this.CACHE_TTL);
    
    return recipes;
  }

  async findByDifficulty(difficulty: string): Promise<RecipeEntity[]> {
    const cacheKey = `${this.CACHE_PREFIX}difficulty:${difficulty}`;
    
    const cached = await this.cacheService.get<DbRecipe[]>(cacheKey);
    if (cached) {
      return cached.map(data => RecipeEntity.fromDbRecipe(data));
    }

    const recipes = await this.repository.findByDifficulty(difficulty);
    await this.cacheService.set(cacheKey, recipes.map(r => r.toDbRecipe()), this.CACHE_TTL);
    
    return recipes;
  }
} 