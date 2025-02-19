export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export const difficultyTranslations: Record<Difficulty, Record<Lang, string>> = {
  'Beginner': { en: 'Beginner', zh: '初學者', ja: '初級' },
  'Intermediate': { en: 'Intermediate', zh: '中級', ja: '中級' },
  'Advanced': { en: 'Advanced', zh: '高級', ja: '上級' },
};

export type Category = 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages' | 'Cocktails';

export const categoryTranslations: Record<Category, Record<Lang, string>> = {
  Appetizers: { en: 'Appetizers', zh: '开胃菜', ja: '前菜' },
  'Main Course': { en: 'Main Course', zh: '主菜', ja: 'メインコース' },
  Desserts: { en: 'Desserts', zh: '甜点', ja: 'デザート' },
  Beverages: { en: 'Beverages', zh: '饮料', ja: '飲み物' },
  Cocktails: { en: 'Cocktails', zh: '鸡尾酒', ja: 'カクテル' },
};

export type Cuisine =
  | 'Italian'
  | 'French'
  | 'Spanish'
  | 'Greek'
  | 'Mediterranean'
  | 'Mexican'
  | 'Brazilian'
  | 'Peruvian'
  | 'American'
  | 'Japanese'
  | 'Chinese'
  | 'Thai'
  | 'Indian'
  | 'Middle Eastern'
  | 'Lebanese'
  | 'Turkish'
  | 'Moroccan'
  | 'Ethiopian'
  | 'Korean'
  | 'Vietnamese'
  | 'Caribbean'
  | 'Cajun/Creole'
  | 'German'
  | 'British'
  | 'Irish'
  | 'Scandinavian'
  | 'Russian'
  | 'Hawaiian'
  | 'Filipino'
  | 'Malaysian'
  | 'Indonesian'
  | 'South African'
  | 'Soul Food'
  | 'Tex-Mex'
  | 'Israeli'
  | 'Polish'
  | 'Portuguese'
  | 'Argentinian'
  | 'Nordic'
  | 'Southern'
  | 'Pacific Islander'
  | 'Fusion'
  | 'Vegetarian'
  | 'Vegan'
  | 'Kosher'
  | 'BBQ';

export interface Dish {
  id: string;
  category: Category;
  title: string;
  description: string;
  difficulty: Difficulty;
  ingredientsCount: number;
  time: string;
  calories: number;
  tags: string[];
  servingSize: string;
  allergens?: string[];
  cuisine: Cuisine[];
}

export interface Recipe extends Dish {
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  tools?: string[];
  videoUrl?: string;
}

// Instruction types
export type RecipeInstruction = {
  description: string;
  order: number; // Instruction order
  ingredientsUsed?: string[]; // references to ingredient IDs
  toolsNeeded?: string[];
  tips?: string;
  images?: string[];
  temperature?: {
    value: number;
    unit: 'C' | 'F';
  };
  duration?: number; // in minutes
};

// Ingredient specification
export interface RecipeIngredient {
  quantity: number;
  unit:
    | 'g'
    | 'kg'
    | 'L'
    | 'ml'
    | 'tsp'
    | 'tbsp'
    | 'cup'
    | 'pc'
    | 'slice'
    | 'oz'
    | 'lb'
    | 'bunch'
    | 'dash'
    | 'pinch'
    | 'clove'
    | 'scoop';
  name: string;
  preparation?: string;
  alternatives?: RecipeIngredient[];
  state?: string; // state of the ingredient such as "raw", "processed", "dry", "cooked", "chopped", etc;
}

export interface BaseDbRecipe {
  id: string;
  version: {
    recipe: string;
    translator: string;
  };
  createdAt?: Date;
  images: string[];
}

export type DbRecipe = BaseDbRecipe & {
  en: Recipe;
} & {
  [key in Exclude<Lang, 'en'>]?: Recipe;
};

export type Lang = 'zh' | 'en' | 'ja'; // 'es' | 'fr' | 'ko' | 'de' | 'it' | 'pt' | 'ru'
