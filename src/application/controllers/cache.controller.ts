import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { container } from '~/infrastructure/config/dependency-injection';

export class CacheController {
  static async clearCache(request: NextRequest): Promise<NextResponse> {
    try {
      const { pathname } = await request.json();
      console.log('Clear Cache for', pathname);

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

      // Clear all caches using clean architecture (handles both Redis and local cache)
      await container.initialize();
      const cacheService = container.getCacheService();
      
      // Clear specific cache keys if needed
      const keys = ['menu-data', ...(pathname.startsWith('/menu/recipe') ? [`recipe-${pathname.split('/').pop()}`] : [])];
      if (keys.length > 0) {
        for (const key of keys) {
          await cacheService.delete(key);
        }
        console.log('Cache removed for keys:', keys);
      } else {
        // Clear all cache if no specific keys
        await cacheService.clear();
        console.log('All cache cleared');
      }
      
      return NextResponse.json({ message: 'Cache cleared successfully' });
    } catch (error) {
      console.error('Cache invalidation failed:', error);
      return NextResponse.json({ error: 'Failed to clear cache' }, { status: 500 });
    }
  }
} 