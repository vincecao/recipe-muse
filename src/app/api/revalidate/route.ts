'use server';

import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient } from '~/core/redis';

export async function POST(request: NextRequest) {
  const { pathname } = await request.json();
  console.log('Clear Cache for', pathname);
  try {
    // Next.js cache invalidation
    if (pathname.startsWith('/menu/recipe')) {
      const recipeId = pathname.split('/').pop();
      revalidateTag(`id:${recipeId}`);
      revalidatePath(`/menu/recipe/${recipeId}`);
      console.log('Nextjs Cache revalidated for:', `id:${recipeId}`, `/menu/recipe/${recipeId}`);
    } else if (pathname.startsWith('/menu')) {
      revalidateTag('menu');
      revalidatePath('/menu');
      console.log('Nextjs Cache revalidated for:', `menu`, `/menu`);
    }

    // Redis cache invalidation
    const redis = await getRedisClient();
    const keys = ['menu-data', ...(pathname.startsWith('/menu/recipe') ? [`recipe-${pathname.split('/').pop()}`] : [])];
    if (keys.length > 0) {
      await redis.del(keys);
      console.log('Redis Cache removed for', keys);
    } else {
      console.log('No Redis Cache has been removed');
    }
    return NextResponse.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    console.error('Redis and Nextjs Cache invalidation failed:', error);
    return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
  }
}
