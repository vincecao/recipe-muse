import { promises as fs } from 'fs';
import path from 'path';
import { Recipe } from './type';

const DATA_DIR = path.join(process.cwd(), 'data/recipes');

// Initialize data directory
(async function init() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to initialize database directory:', err);
  }
})();

export const db = {
  async getRecipe(id: string): Promise<Recipe | null> {
    try {
      const data = await fs.readFile(path.join(DATA_DIR, `${id}.json`), 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return null;
      }
      throw new Error('Failed to read recipe');
    }
  },

  async saveRecipe(recipe: Recipe): Promise<void> {
    const filePath = path.join(DATA_DIR, `${recipe.id}.json`);
    await fs.writeFile(filePath, JSON.stringify(recipe, null, 2), 'utf-8');
  },

  async deleteRecipe(id: string): Promise<void> {
    const filePath = path.join(DATA_DIR, `${id}.json`);
    try {
      await fs.unlink(filePath);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
        return;
      }
      throw new Error('Failed to delete recipe');
    }
  },

  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const files = await fs.readdir(DATA_DIR);
      const recipes = await Promise.all(
        files
          .filter(file => file.endsWith('.json'))
          .map(async file => {
            const data = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
            return JSON.parse(data);
          })
      );
      return recipes;
    } catch (err) {
      throw new Error('Failed to read recipes');
    }
  },

  async seedDatabase(recipes: Recipe[]): Promise<void> {
    await Promise.all(recipes.map(recipe => this.saveRecipe(recipe)));
  }
};

// Example usage:
// await db.saveRecipe(recipe);
// const recipe = await db.getRecipe('app-1-full');
// const allRecipes = await db.getAllRecipes();
