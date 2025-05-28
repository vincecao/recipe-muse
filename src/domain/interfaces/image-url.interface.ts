export interface ImageUrlInterface {
  /**
   * Generate signed URLs for recipe images
   * @param imagePaths Array of image paths
   * @param expiresIn Expiration time in seconds
   * @returns Promise<string[]> Array of signed URLs
   */
  generateSignedUrls(imagePaths: string[], expiresIn?: number): Promise<string[]>;

  /**
   * Generate a single signed URL for an image
   * @param imagePath Image path
   * @param expiresIn Expiration time in seconds
   * @returns Promise<string> Signed URL
   */
  generateSignedUrl(imagePath: string, expiresIn?: number): Promise<string>;
} 