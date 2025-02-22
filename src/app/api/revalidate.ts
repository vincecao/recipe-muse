'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { getRedisClient } from '~/core/redis';

export async function clearCache(pathname: string) {
  try {
    // Next.js cache invalidation
    if (pathname.startsWith('/menu')) {
      revalidateTag('menu');
      revalidatePath('/menu');
    } else if (pathname.startsWith('/recipe')) {
      const recipeId = pathname.split('/').pop();
      revalidateTag(`recipe-${recipeId}`);
      revalidatePath(`/recipe/${recipeId}`);
    }

    // Redis cache invalidation
    const redis = await getRedisClient();
    const keys = ['menu-data', ...(pathname.startsWith('/recipe') ? [`recipe-${pathname.split('/').pop()}`] : [])];
    if (keys.length > 0) {
      await redis.del(keys);
    }
  } catch (error) {
    console.error('Cache invalidation failed:', error);
    throw error;
  }
}