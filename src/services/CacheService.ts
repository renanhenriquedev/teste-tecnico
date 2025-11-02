import Redis from 'ioredis';
import { env } from '../config/env';

export interface ICacheService {
  get<T = unknown>(key: string): Promise<T | null>;
  set<T = unknown>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
}

export class CacheService implements ICacheService {
  private static instance: CacheService;
  private readonly client: Redis;

  private constructor() {
    this.client = new Redis(env.redisUri, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    });
    this.client.on('error', (e) => console.error('[Redis] error', e));
    this.client.on('connect', () => console.log('[Redis] connected'));
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) CacheService.instance = new CacheService();
    return CacheService.instance;
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const raw = await this.client.get(key);
    if (!raw) return null;
    try { return JSON.parse(raw) as T; } catch { return null; }
  }

  async set<T = unknown>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    const payload = JSON.stringify(value);
    await this.client.set(key, payload, 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
