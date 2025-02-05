import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, get, set, remove, Database } from "firebase/database";
import type { StoredRecipe } from "~/core/type";

// Your Firebase configuration object
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

  async getRecipe(id: string): Promise<StoredRecipe | null> {
    try {
      const recipeRef = ref(this.db, `recipes/${id}`);
      const snapshot = await get(recipeRef);
      return snapshot.exists() ? snapshot.val() : null;
    } catch (error) {
      console.error("Error fetching recipe:", error);
      throw error;
    }
  }

  async getAllRecipes(): Promise<StoredRecipe[]> {
    try {
      const recipesRef = ref(this.db, "recipes");
      const snapshot = await get(recipesRef);
      return snapshot.exists() ? Object.values(snapshot.val()) : [];
    } catch (error) {
      console.error("Error fetching all recipes:", error);
      throw error;
    }
  }

  async saveRecipe(recipe: StoredRecipe): Promise<void> {
    try {
      const storedRecipe: StoredRecipe = {
        ...recipe,
        createdAt: new Date(),
      };
      const recipeRef = ref(this.db, `recipes/${recipe.id}`);
      await set(recipeRef, storedRecipe);
    } catch (error) {
      console.error("Error saving recipe:", error);
      throw error;
    }
  }

  async deleteRecipe(id: string): Promise<void> {
    try {
      const recipeRef = ref(this.db, `recipes/${id}`);
      await remove(recipeRef);
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  }

  async seedDatabase(recipes: StoredRecipe[]): Promise<void> {
    try {
      const recipesRef = ref(this.db, "recipes");
      const recipesObject = recipes.reduce((acc, recipe) => {
        const storedRecipe: StoredRecipe = {
          ...recipe,
          createdAt: new Date(),
        };
        acc[recipe.id] = storedRecipe;
        return acc;
      }, {} as Record<string, StoredRecipe>);

      await set(recipesRef, recipesObject);
    } catch (error) {
      console.error("Error seeding database:", error);
      throw error;
    }
  }

  async saveRecipeByName(recipe: StoredRecipe): Promise<void> {
    try {
      // Save the recipe by ID
      const storedRecipe: StoredRecipe = {
        ...recipe,
        createdAt: new Date(),
      };
      const recipeRef = ref(this.db, `recipes/${recipe.id}`);
      await set(recipeRef, storedRecipe);

      // Create name to ID mapping
      const nameRef = ref(this.db, `recipeNames/${this.normalizeRecipeName(recipe.title)}`);
      await set(nameRef, recipe.id);
    } catch (error) {
      console.error("Error saving recipe by name:", error);
      throw error;
    }
  }

  async getRecipeByName(name: string): Promise<StoredRecipe | null> {
    try {
      // First get the ID from the name mapping
      const nameRef = ref(this.db, `recipeNames/${this.normalizeRecipeName(name)}`);
      const idSnapshot = await get(nameRef);

      if (!idSnapshot.exists()) return null;

      // Then get the recipe using the ID
      const recipeId = idSnapshot.val();
      return this.getRecipe(recipeId);
    } catch (error) {
      console.error("Error fetching recipe by name:", error);
      throw error;
    }
  }

  private normalizeRecipeName(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  }
}

export const firebaseDb = FirebaseService.getInstance();

// const sanitizeDomain = (domain: string) => domain.replace(/[.$#[\]/]/g, "-");

// const getDomainToken = () => {
//   const isProduction = process.env.NODE_ENV === "production";
//   const domain = isProduction ? "meal-muse.vercel.app" : "localhost";
//   return {
//     domain,
//     token: isProduction ? process.env.PROD_DB_TOKEN : process.env.LOCAL_DB_TOKEN,
//   };
// };
