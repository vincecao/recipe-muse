import { cache } from "react";
import { firebaseDb } from "~/app/api/_services/firebase";
import { getRedisClient } from './redis';

/** @todo: Figure out cache from React */
export const cachedRecipes = cache(() => firebaseDb.getAllRecipes());
export const cachedRecipeById = cache((id: string) => firebaseDb.getRecipe(id));

export const REDIS_CACHE_EXPIRATION = 3600 // in seconds
export const NEXTJS_CACHE_EXPIRATION = 1800 // in seconds
export const SUPABASE_CACHE_EXPIRATION = 7200 // in seconds

export const cachedRedisFetch = async <T = unknown>(key: string, fetchFn: () => Promise<T>, ttl = REDIS_CACHE_EXPIRATION) => {
  const redis = await getRedisClient();
  const cached = await redis.get(key);
  
  if (cached) {
    console.log('Redis Cache hit for', key);
    return JSON.parse(cached);
  }

  console.log('Redis Cache miss for', key);
  const freshData = await fetchFn();
  await redis.setEx(key, ttl, JSON.stringify(freshData));
  console.log('Redis Cache set For', key, ttl, JSON.stringify(freshData));
  return freshData;
};