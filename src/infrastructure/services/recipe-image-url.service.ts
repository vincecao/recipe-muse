import { ImageUrlInterface } from '~/domain/interfaces/image-url.interface';
import { StorageService } from './storage.service';

const DEFAULT_EXPIRATION = Number(process.env.SUPABASE_CACHE_EXPIRATION) || 3600;

export class RecipeImageUrlService implements ImageUrlInterface {
  private storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
  }

  async generateSignedUrls(imagePaths: string[], expiresIn: number = DEFAULT_EXPIRATION): Promise<string[]> {
    if (!imagePaths || imagePaths.length === 0) {
      return [];
    }

    try {
      const signedUrls = await Promise.all(
        imagePaths.map(async (imagePath) => {
          if (!imagePath) return '';
          return await this.storageService.getSignedUrl(imagePath, expiresIn);
        })
      );

      return signedUrls.filter(url => url !== ''); // Filter out failed URLs
    } catch (error) {
      console.error('Failed to generate signed URLs:', error);
      return imagePaths.map(() => ''); // Return empty strings for failed URLs
    }
  }

  async generateSignedUrl(imagePath: string, expiresIn: number = DEFAULT_EXPIRATION): Promise<string> {
    if (!imagePath) return '';

    try {
      return await this.storageService.getSignedUrl(imagePath, expiresIn);
    } catch (error) {
      console.error('Failed to generate signed URL:', error);
      return '';
    }
  }
} 