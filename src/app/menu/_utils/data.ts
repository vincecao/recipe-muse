import { NEXTJS_CACHE_EXPIRATION, cachedRedisFetch } from '~/core/cache';
import { withLocalCache } from '~/core/localCache.server';
import { DbRecipe } from '~/types/recipe';

export async function fetchRecipes() {
  return withLocalCache<DbRecipe[]>('menu-data', async () => {
    const fn = async () =>
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe`, {
        next: { tags: ['menu'], revalidate: NEXTJS_CACHE_EXPIRATION },
      }).then((r) => r.json());
    const res = await cachedRedisFetch<DbRecipe[]>('menu-data', fn);

    // Add runtime validation
    if (!Array.isArray(res)) throw new Error('Invalid recipe data format');

    return res;
  });
}

export async function fetchRecipe(id: string): Promise<DbRecipe | undefined> {
  return withLocalCache<DbRecipe | undefined>(`recipe-${id}`, async () => {
    const fn = async () =>
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/recipe/${id}`, {
        next: { tags: [`menu-recipe`, `id:${id}`], revalidate: NEXTJS_CACHE_EXPIRATION },
      }).then((r) => r.json());
    const res = await cachedRedisFetch<DbRecipe>(`recipe-${id}`, fn);

    // Add runtime validation
    if (!res?.id || !res.en?.title) {
      throw new Error('Invalid recipe data structure');
    }

    return res;
  });
}
