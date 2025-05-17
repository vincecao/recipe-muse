import fs from 'fs';
import path from 'path';

/**
 * Fetches data from a local cache or falls back to a provided fetch function.
 * @param cacheKey - Unique key for the cache file.
 * @param fetchFn - Function to fetch data if the cache is not available.
 * @returns The cached or fetched data.
 */
export async function withLocalCache<T>(cacheKey: string, fetchFn: () => Promise<T>): Promise<T> {
  // Only use local cache in development environment
  if (process.env.NODE_ENV !== 'development') {
    return await fetchFn();
  }

  const cacheDir = path.join(process.cwd(), 'temp');
  const cacheFilePath = path.join(cacheDir, `${cacheKey}.json`);

  // Ensure the temp directory exists
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  // Check if local cache exists
  if (fs.existsSync(cacheFilePath)) {
    try {
      const cachedData = fs.readFileSync(cacheFilePath, 'utf-8');
      return JSON.parse(cachedData);
    } catch (error) {
      console.error(`Error reading local cache for key ${cacheKey}:`, error);
    }
  }

  // If no local cache, fetch data using the provided function
  const data = await fetchFn();

  // Save to local cache
  try {
    fs.writeFileSync(cacheFilePath, JSON.stringify(data), 'utf-8');
  } catch (error) {
    console.error(`Error writing to local cache for key ${cacheKey}:`, error);
  }

  return data;
}

/**
 * Deletes the entire local cache directory and all its contents.
 * @returns Promise that resolves when the cache is cleared
 */
export async function clearLocalCache(): Promise<void> {
  // Only clear local cache in development environment
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  const cacheDir = path.join(process.cwd(), 'temp');
  
  if (fs.existsSync(cacheDir)) {
    try {
      fs.rmSync(cacheDir, { recursive: true, force: true });
    } catch (error) {
      console.error('Error clearing local cache:', error);
      throw error;
    }
  }
}