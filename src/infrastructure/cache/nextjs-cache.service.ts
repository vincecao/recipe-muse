import { unstable_cache, revalidateTag } from 'next/cache';
import { CacheInterface, CacheConfig } from '~/domain/interfaces/cache.interface';

export class NextJSCacheService implements CacheInterface {
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.config.enabled) {
      return null;
    }

    // Next.js cache is handled through unstable_cache wrapper
    // This method is mainly for compatibility with the interface
    console.log('NextJS Cache get called for', key);
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async set<T>(key: string, _value: T, _ttl?: number): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Next.js cache is handled through unstable_cache wrapper
    // This method is mainly for compatibility with the interface
    console.log('NextJS Cache set called for', key);
  }

  async delete(key: string): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Convert cache key to appropriate tags and revalidate
    const tags = this.keyToTags(key);
    tags.forEach(tag => {
      revalidateTag(tag);
      console.log('NextJS Cache invalidated tag:', tag);
    });
  }

  async clear(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    // Revalidate all common tags
    const commonTags = ['menu', 'recipes'];
    commonTags.forEach(tag => {
      revalidateTag(tag);
      console.log('NextJS Cache cleared tag:', tag);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async has(_key: string): Promise<boolean> {
    // Next.js cache doesn't provide a direct way to check existence
    return false;
  }

  /**
   * Create a cached function using Next.js unstable_cache
   * check latest `use cache` for more details https://nextjs.org/docs/app/building-your-application/caching/server-actions-and-mutations#using-cache
   */
  createCachedFunction<T extends unknown[], R>(
    fn: (...args: T) => Promise<R>,
    keyParts: string[],
    options: {
      tags?: string[];
      revalidate?: number;
    } = {}
  ): (...args: T) => Promise<R> {
    if (!this.config.enabled) {
      return fn;
    }

    return unstable_cache(
      fn,
      keyParts,
      {
        tags: options.tags || [],
        revalidate: options.revalidate || this.config.defaultTtl,
      }
    );
  }

  /**
   * Convert cache key to appropriate Next.js tags
   */
  private keyToTags(key: string): string[] {
    const tags: string[] = [];

    // Handle recipe cache keys from CachedRecipeRepository
    if (key.startsWith('recipe:')) {
      if (key === 'recipe:all') {
        // recipe:all -> ['menu', 'recipes']
        tags.push('menu', 'recipes');
      } else if (key.startsWith('recipe:id:')) {
        // recipe:id:123 -> ['menu', 'recipe:123']
        const id = key.replace('recipe:id:', '');
        tags.push('menu', `recipe:${id}`);
      }
    }

    // Fallback: convert any key to a safe tag format
    if (tags.length === 0) {
      const safeTag = key.replace(/[^a-zA-Z0-9:-]/g, '');
      tags.push(safeTag);
    }

    return tags;
  }

  /**
   * Get tags for a cache key (public method for external use)
   */
  getTagsForKey(key: string): string[] {
    return this.keyToTags(key);
  }
} 