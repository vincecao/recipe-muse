import { NextRequest, NextResponse } from 'next/server';
import { container } from '~/infrastructure/config/dependency-injection';
import { ensureInitialized } from '~/shared/utils/data-fetcher';

export class CacheController {
  static async clearCache(request: NextRequest): Promise<NextResponse> {
    try {
      const { pathname } = await request.json();
      console.log('Clear Cache for', pathname);

      await ensureInitialized();
      await container.getCacheService().clear();
      console.log('All cache layers cleared (NextJS, Local, Redis)');

      return NextResponse.json({ message: 'Cache cleared successfully' });
    } catch (error) {
      console.error('Cache invalidation failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return NextResponse.json(
        {
          error: 'Failed to clear cache',
          details: errorMessage,
        },
        { status: 500 },
      );
    }
  }
}
