import { CacheInterface } from '~/domain/interfaces/cache.interface';

export class MultiCacheService implements CacheInterface {
  constructor(
    private caches: CacheInterface[]
  ) {}

  async get<T>(key: string): Promise<T | null> {
    for (let i = 0; i < this.caches.length; i++) {
      const cache = this.caches[i];
      const value = await cache.get<T>(key);
      if (value !== null) {
        // Populate earlier caches
        for (let j = 0; j < i; j++) {
          await this.caches[j].set(key, value);
        }
        return value;
      }
    }

    return null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    // Set in all caches
    await Promise.all(this.caches.map(cache => cache.set(key, value, ttl)));
  }

  async delete(key: string): Promise<void> {
    // Delete from all caches
    await Promise.all(this.caches.map(cache => cache.delete(key)));
  }

  async clear(): Promise<void> {
    // Clear all caches
    await Promise.all(this.caches.map(cache => cache.clear()));
  }

  async has(key: string): Promise<boolean> {
    // Check caches in order
    for (const cache of this.caches) {
      if (await cache.has(key)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Utility method to fetch data with cache fallback
   */
  async withCache<T>(key: string, fetchFn: () => Promise<T>, ttl?: number): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const freshData = await fetchFn();
    
    // Store in cache
    await this.set(key, freshData, ttl);
    
    return freshData;
  }
} 