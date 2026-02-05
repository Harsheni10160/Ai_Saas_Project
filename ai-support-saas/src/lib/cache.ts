// import { Redis } from '@upstash/redis';

// Initialize Redis client
// Note: This requires UPSTASH_REDIS_URL and UPSTASH_REDIS_TOKEN env variables
const redis: any = null;
/*
const redis = process.env.UPSTASH_REDIS_URL
    ? new Redis({
        url: process.env.UPSTASH_REDIS_URL,
        token: process.env.UPSTASH_REDIS_TOKEN!,
    })
    : null;
*/

/**
 * Cache data with a specific key and expiration time
 */
export async function cacheData(key: string, data: any, expirationSeconds: number = 300) {
    if (!redis) return;
    try {
        await redis.set(key, data, { ex: expirationSeconds });
    } catch (error) {
        console.warn('Redis cache set error:', error);
    }
}

/**
 * Get cached data by key
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
    if (!redis) return null;
    try {
        return await redis.get(key) as T;
    } catch (error) {
        console.warn('Redis cache get error:', error);
        return null;
    }
}

/**
 * Helper to get data from cache or fetch it if missing
 */
export async function getOrSetCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    expirationSeconds: number = 300
): Promise<T> {
    // Try to get from cache first
    const cached = await getCachedData<T>(key);
    if (cached) return cached;

    // If missing, fetch fresh data
    const data = await fetchFn();

    // Cache the fresh data
    if (data) {
        await cacheData(key, data, expirationSeconds);
    }

    return data;
}

/**
 * In-memory fallback cache (for development or when Redis is not available)
 */
const memoryCache = new Map<string, { data: any, expiry: number }>();

export const localCache = {
    get: (key: string) => {
        const item = memoryCache.get(key);
        if (!item) return null;
        if (Date.now() > item.expiry) {
            memoryCache.delete(key);
            return null;
        }
        return item.data;
    },
    set: (key: string, data: any, ttlSeconds: number = 60) => {
        memoryCache.set(key, {
            data,
            expiry: Date.now() + (ttlSeconds * 1000)
        });
    }
};
