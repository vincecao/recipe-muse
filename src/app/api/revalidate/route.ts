import { NextRequest } from 'next/server';
import { CacheController } from '~/application/controllers/cache.controller';

export async function POST(request: NextRequest) {
  return CacheController.clearCache(request);
}
