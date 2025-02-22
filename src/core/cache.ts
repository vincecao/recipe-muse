import { cache } from "react";
import { firebaseDb } from "~/app/api/_services/firebase";
import { getRedisClient } from './redis';

export const cachedRecipes = cache(() => firebaseDb.getAllRecipes());
export const cachedRecipeById = cache((id: string) => firebaseDb.getRecipe(id));

export const CACHE_EXPIRATION = 3600 // in seconds (1 hour)

export const cachedRedisFetch = async (key: string, fetchFn: () => Promise<any>, ttl = CACHE_EXPIRATION + 1800) => {
  const redis = await getRedisClient();
  const cached = await redis.get(key);
  
  if (cached) {
    console.log('Cache hit for', key);
    return JSON.parse(cached);
  }

  console.log('Cache miss for', key);
  const freshData = await fetchFn();
  await redis.setEx(key, ttl, JSON.stringify(freshData));
  return freshData;
};