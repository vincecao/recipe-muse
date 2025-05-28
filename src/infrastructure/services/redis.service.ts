import { createClient, RedisClientType } from 'redis';

class RedisService {
  private static instance: RedisService;
  private client: RedisClientType;
  private isConnected = false;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL,
      // ...(process.env.NODE_ENV === 'production' ? {
      //   socket: {
      //     tls: true,
      //     rejectUnauthorized: false
      //   }
      // } : {})
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.on('connect', () => console.log('Redis Client Connected'));
    this.client.on('disconnect', () => {
      console.log('Redis Client Disconnected');
      this.isConnected = false;
    });
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async getClient(): Promise<RedisClientType> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  // Convenience methods for common operations
  async get(key: string): Promise<string | null> {
    const client = await this.getClient();
    return client.get(key);
  }

  async set(key: string, value: string): Promise<string | null> {
    const client = await this.getClient();
    return client.set(key, value);
  }

  async setEx(key: string, seconds: number, value: string): Promise<string | null> {
    const client = await this.getClient();
    return client.setEx(key, seconds, value);
  }

  async del(keys: string | string[]): Promise<number> {
    const client = await this.getClient();
    return client.del(keys);
  }

  async exists(key: string): Promise<number> {
    const client = await this.getClient();
    return client.exists(key);
  }

  async keys(pattern: string): Promise<string[]> {
    const client = await this.getClient();
    return client.keys(pattern);
  }

  async flushDb(): Promise<string> {
    const client = await this.getClient();
    return client.flushDb();
  }

  // Pub/Sub methods
  async publish(channel: string, message: string): Promise<number> {
    const client = await this.getClient();
    return client.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<RedisClientType> {
    const client = await this.getClient();
    const subscriber = client.duplicate();
    await subscriber.connect();
    await subscriber.subscribe(channel, callback);
    return subscriber;
  }
}

export const redisService = RedisService.getInstance();