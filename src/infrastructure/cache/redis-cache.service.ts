import { CacheInterface, CacheConfig } from '~/domain/interfaces/cache.interface';
import { redisService } from '../services/redis.service';

export class RedisCacheService implements CacheInterface {
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
  }

  private getKey(key: string): string {
    return this.config.keyPrefix ? `${this.config.keyPrefix}:${key}` : key;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.config.enabled) {
      return null;
    }

    try {
      const cached = await redisService.get(this.getKey(key));
      
      if (cached) {
        console.log('Redis Cache hit for', key);
        return JSON.parse(cached);
      }

      console.log('Redis Cache miss for', key);
      return null;
    } catch (error) {
      console.error(`Error reading Redis cache for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    try {
      const expirationTime = ttl || this.config.defaultTtl;
      const redisKey = this.getKey(key);
      
      if (expirationTime > 0) {
        await redisService.setEx(redisKey, expirationTime, JSON.stringify(value));
      } else {
        await redisService.set(redisKey, JSON.stringify(value));
      }
      
      console.log('Redis Cache set for', key, 'TTL:', expirationTime);
    } catch (error) {
      console.error(`Error writing to Redis cache for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    try {
      await redisService.del(this.getKey(key));
      console.log('Redis Cache deleted for', key);
    } catch (error) {
      console.error(`Error deleting Redis cache for key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    try {
      if (this.config.keyPrefix) {
        // Delete all keys with the prefix
        const keys = await redisService.keys(`${this.config.keyPrefix}:*`);
        if (keys.length > 0) {
          await redisService.del(keys);
        }
      } else {
        // Clear all Redis cache (use with caution)
        await redisService.flushDb();
      }
      
      console.log('Redis Cache cleared');
    } catch (error) {
      console.error('Error clearing Redis cache:', error);
      throw error;
    }
  }

  async has(key: string): Promise<boolean> {
    if (!this.config.enabled) {
      return false;
    }

    try {
      const exists = await redisService.exists(this.getKey(key));
      return exists === 1;
    } catch (error) {
      console.error(`Error checking Redis cache for key ${key}:`, error);
      return false;
    }
  }
} 