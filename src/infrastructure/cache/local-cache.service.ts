import fs from 'fs';
import path from 'path';
import { CacheInterface, CacheConfig } from '~/domain/interfaces/cache.interface';

export class LocalCacheService implements CacheInterface {
  private cacheDir: string;
  private config: CacheConfig;

  constructor(config: CacheConfig) {
    this.config = config;
    this.cacheDir = path.join(process.cwd(), 'temp');
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  private getCacheFilePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9-_]/g, '_');
    return path.join(this.cacheDir, `${safeKey}.json`);
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.config.enabled) {
      return null;
    }

    const filePath = this.getCacheFilePath(key);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const cacheData = JSON.parse(fileContent);
      
      // Check if cache has expired
      if (cacheData.expiresAt && Date.now() > cacheData.expiresAt) {
        await this.delete(key);
        return null;
      }

      console.log('Local Cache hit for', key);
      return cacheData.value;
    } catch (error) {
      console.error(`Error reading local cache for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const filePath = this.getCacheFilePath(key);
    const expirationTime = ttl || this.config.defaultTtl;
    const expiresAt = expirationTime > 0 ? Date.now() + (expirationTime * 1000) : null;

    const cacheData = {
      value,
      createdAt: Date.now(),
      expiresAt,
    };

    try {
      fs.writeFileSync(filePath, JSON.stringify(cacheData), 'utf-8');
      console.log('Local Cache set for', key);
    } catch (error) {
      console.error(`Error writing to local cache for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    const filePath = this.getCacheFilePath(key);
    
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('Local Cache deleted for', key);
      } catch (error) {
        console.error(`Error deleting local cache for key ${key}:`, error);
      }
    }
  }

  async clear(): Promise<void> {
    if (!this.config.enabled) {
      return;
    }

    if (fs.existsSync(this.cacheDir)) {
      try {
        fs.rmSync(this.cacheDir, { recursive: true, force: true });
        this.ensureCacheDir();
        console.log('Local Cache cleared');
      } catch (error) {
        console.error('Error clearing local cache:', error);
        throw error;
      }
    }
  }

  async has(key: string): Promise<boolean> {
    if (!this.config.enabled) {
      return false;
    }

    const filePath = this.getCacheFilePath(key);
    return fs.existsSync(filePath);
  }
} 