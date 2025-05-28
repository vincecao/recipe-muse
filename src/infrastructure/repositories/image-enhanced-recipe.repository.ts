import { RecipeRepository } from '~/domain/repositories/recipe.repository';
import { RecipeEntity } from '~/domain/entities/recipe.entity';
import { ImageUrlInterface } from '~/domain/interfaces/image-url.interface';

/**
 * Repository decorator that enhances recipes with signed image URLs
 * This follows the Decorator pattern to add image URL generation
 * without modifying the original repository implementation
 */
export class ImageEnhancedRecipeRepository implements RecipeRepository {
  constructor(
    private baseRepository: RecipeRepository,
    private imageUrlService: ImageUrlInterface
  ) {}

  async findAll(): Promise<RecipeEntity[]> {
    const recipes = await this.baseRepository.findAll();
    return await this.enhanceRecipesWithImageUrls(recipes);
  }

  async findById(id: string): Promise<RecipeEntity | null> {
    const recipe = await this.baseRepository.findById(id);
    if (!recipe) return null;
    
    return await this.enhanceRecipeWithImageUrls(recipe);
  }

  async save(recipe: RecipeEntity): Promise<RecipeEntity> {
    return await this.baseRepository.save(recipe);
  }

  async delete(id: string): Promise<void> {
    return await this.baseRepository.delete(id);
  }

  /**
   * Enhance a single recipe with signed image URLs
   */
  private async enhanceRecipeWithImageUrls(recipe: RecipeEntity): Promise<RecipeEntity> {
    const dbRecipe = recipe.toDbRecipe();
    
    if (!dbRecipe.images || dbRecipe.images.length === 0) {
      return recipe;
    }

    try {
      const signedUrls = await this.imageUrlService.generateSignedUrls(dbRecipe.images);
      
      // Create new recipe with enhanced images
      const enhancedDbRecipe = {
        ...dbRecipe,
        images: signedUrls
      };

      return RecipeEntity.fromDbRecipe(enhancedDbRecipe);
    } catch (error) {
      console.error('Failed to enhance recipe with image URLs:', error);
      return recipe; // Return original recipe if enhancement fails
    }
  }

  /**
   * Enhance multiple recipes with signed image URLs
   */
  private async enhanceRecipesWithImageUrls(recipes: RecipeEntity[]): Promise<RecipeEntity[]> {
    return await Promise.all(
      recipes.map(recipe => this.enhanceRecipeWithImageUrls(recipe))
    );
  }
} 