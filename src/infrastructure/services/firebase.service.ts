import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, get, set, remove, Database, update } from 'firebase/database';
import { DbRecipe } from '~/domain/entities/recipe.entity';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

export function normalizeRecipeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

class FirebaseService {
  private db: Database;
  private static instance: FirebaseService;

  private constructor() {
    // Check if Firebase app is already initialized
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    this.db = getDatabase(app);
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async getAllRecipes(): Promise<DbRecipe[]> {
    const recipesRef = ref(this.db, 'recipes');
    const snapshot = await get(recipesRef);
    const recipes = snapshot.exists() ? (Object.values(snapshot.val()) as DbRecipe[]) : [];
    // recipes = await Promise.all(
    //   recipes.map(async (recipe) => {
    //     const expiresIn = SUPABASE_CACHE_EXPIRATION;
    //     const images = await Promise.all(
    //       (recipe.images ?? []).map((i) => this.supaClient.getSignedUrl(i, expiresIn)),
    //     );
    //     console.log('Supabase images url created', recipe.en.title, images, expiresIn);
    //     return {
    //       ...recipe,
    //       images,
    //     };
    //   }),
    // );
    return recipes;
  }

  async getRecipe(id: string): Promise<DbRecipe | null> {
    const recipeRef = ref(this.db, `recipes/${id}`);
    const snapshot = await get(recipeRef);
    const recipe = snapshot.exists() ? (snapshot.val() as DbRecipe) : null;
    // if (recipe) {
    //   const expiresIn = SUPABASE_CACHE_EXPIRATION;
    //   const images = await Promise.all((recipe.images ?? []).map((i) => this.supaClient.getSignedUrl(i, expiresIn)));
    //   console.log('Supabase images url created', recipe.en.title, images, expiresIn);
    //   recipe = {
    //     ...recipe,
    //     images,
    //   };
    // }

    return recipe;
  }

  async getRecipeByName(name: string): Promise<DbRecipe | null> {
    // First get the ID from the name mapping
    const nameRef = ref(this.db, `recipeNames/${normalizeRecipeName(name)}`);
    const idSnapshot = await get(nameRef);

    if (!idSnapshot.exists()) return null;

    // Then get the recipe using the ID
    const recipeId = idSnapshot.val();
    return this.getRecipe(recipeId);
  }

  async saveRecipe(recipe: DbRecipe): Promise<void> {
    const storedRecipe: DbRecipe = {
      ...recipe,
      createdAt: new Date(),
    };
    const recipeRef = ref(this.db, `recipes/${recipe.id}`);
    await set(recipeRef, storedRecipe);
  }

  async saveRecipeByName(recipe: DbRecipe): Promise<DbRecipe> {
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
  }

  async updateRecipe(id: string, updates: Partial<DbRecipe>): Promise<DbRecipe | null> {
    const recipeRef = ref(this.db, `recipes/${id}`);
    await update(recipeRef, updates);
    return this.getRecipe(id); // Return updated document
  }

  async deleteRecipeById(id: string): Promise<void> {
    const recipeRef = ref(this.db, `recipes/${id}`);
    await remove(recipeRef);
  }
}

export const firebaseDb = FirebaseService.getInstance();
