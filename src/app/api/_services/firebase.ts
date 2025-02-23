import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove, Database, update } from 'firebase/database';
import type { DbRecipe } from '~/core/type';
import { SupabaseStorageService } from './supabase-storage';
import { SUPABASE_CACHE_EXPIRATION } from '~/core/cache';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

class FirebaseService {
  private db: Database;
  private static instance: FirebaseService;
  private supaClient: SupabaseStorageService;

  private constructor() {
    // Check if Firebase app is already initialized
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    this.db = getDatabase(app);
    this.supaClient = new SupabaseStorageService();
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async getRecipe(id: string): Promise<DbRecipe | null> {
    try {
      const recipeRef = ref(this.db, `recipes/${id}`);
      const snapshot = await get(recipeRef);
      let recipe = snapshot.exists() ? (snapshot.val() as DbRecipe) : null;
      if (recipe) {
        const expiresIn = SUPABASE_CACHE_EXPIRATION;
        const images = await Promise.all((recipe.images ?? []).map((i) => this.supaClient.getSignedUrl(i, expiresIn)));
        console.log('Supabase images url created', recipe.en.title, images, expiresIn);
        recipe = {
          ...recipe,
          images,
        };
      }

      return recipe;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      throw error;
    }
  }

  async getAllRecipes(): Promise<DbRecipe[]> {
    try {
      const recipesRef = ref(this.db, 'recipes');
      const snapshot = await get(recipesRef);
      let recipes = snapshot.exists() ? (Object.values(snapshot.val()) as DbRecipe[]) : [];
      recipes = await Promise.all(
        recipes.map(async (recipe) => {
          const expiresIn = SUPABASE_CACHE_EXPIRATION;
          const images = await Promise.all(
            (recipe.images ?? []).map((i) => this.supaClient.getSignedUrl(i, expiresIn)),
          );
          console.log('Supabase images url created', recipe.en.title, images, expiresIn);
          return {
            ...recipe,
            images,
          };
        }),
      );
      return recipes;
    } catch (error) {
      console.error('Error fetching all recipes:', error);
      throw error;
    }
  }

  async saveRecipe(recipe: DbRecipe): Promise<void> {
    try {
      const storedRecipe: DbRecipe = {
        ...recipe,
        createdAt: new Date(),
      };
      const recipeRef = ref(this.db, `recipes/${recipe.id}`);
      await set(recipeRef, storedRecipe);
    } catch (error) {
      console.error('Error saving recipe:', error);
      throw error;
    }
  }

  async deleteRecipeById(recipeId: string): Promise<void> {
    try {
      const recipeRef = ref(this.db, `recipes/${recipeId}`);
      await remove(recipeRef);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }

  async seedDatabase(recipes: DbRecipe[]): Promise<void> {
    try {
      const recipesRef = ref(this.db, 'recipes');
      const recipesObject = recipes.reduce((acc, recipe) => {
        const storedRecipe: DbRecipe = {
          ...recipe,
          createdAt: new Date(),
        };
        acc[recipe.id] = storedRecipe;
        return acc;
      }, {} as Record<string, DbRecipe>);

      await set(recipesRef, recipesObject);
    } catch (error) {
      console.error('Error seeding database:', error);
      throw error;
    }
  }

  async saveRecipeByName(recipe: DbRecipe): Promise<DbRecipe> {
    try {
      // Save the recipe by ID
      const storedRecipe: DbRecipe = {
        ...recipe,
        createdAt: new Date(),
      };
      const recipeRef = ref(this.db, `recipes/${recipe.id}`);
      await set(recipeRef, storedRecipe);

      // Create name to ID mapping
      const nameRef = ref(this.db, `recipeNames/${normalizeRecipeName(recipe.en.title)}`);
      await set(nameRef, recipe.id);

      return storedRecipe;
    } catch (error) {
      console.error('Error saving recipe by name:', error);
      throw error;
    }
  }

  async getRecipeByName(name: string): Promise<DbRecipe | null> {
    try {
      // First get the ID from the name mapping
      const nameRef = ref(this.db, `recipeNames/${normalizeRecipeName(name)}`);
      const idSnapshot = await get(nameRef);

      if (!idSnapshot.exists()) return null;

      // Then get the recipe using the ID
      const recipeId = idSnapshot.val();
      return this.getRecipe(recipeId);
    } catch (error) {
      console.error('Error fetching recipe by name:', error);
      throw error;
    }
  }
  async updateRecipe(recipeId: string, updateData: Partial<DbRecipe>) {
    const recipeRef = ref(this.db, `recipes/${recipeId}`);
    await update(recipeRef, updateData);
    return this.getRecipe(recipeId); // Return updated document
  }
}

export const firebaseDb = FirebaseService.getInstance();

export function normalizeRecipeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}
