export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type Category = 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages' | 'Cocktails';
export type Lang = 'zh' | 'en' | 'ja';

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
  state?: string;
}

export interface RecipeInstruction {
  description: string;
  order: number;
  ingredientsUsed?: string[];
  toolsNeeded?: string[];
  tips?: string;
  images?: string[];
  temperature?: {
    value: number;
    unit: 'C' | 'F';
  };
  duration?: number;
}

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
  prepTime: number;
  cookTime: number;
  tools?: string[];
  videoUrl?: string;
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

// Domain entity class with business logic
export class RecipeEntity {
  constructor(private readonly data: DbRecipe) {}

  get id(): string {
    return this.data.id;
  }

  get images(): string[] {
    return this.data.images;
  }

  get version(): { recipe: string; translator: string } {
    return this.data.version;
  }

  get createdAt(): Date | undefined {
    return this.data.createdAt;
  }

  getRecipeByLanguage(lang: Lang): Recipe {
    if (lang === 'en') {
      return this.data.en;
    }
    return this.data[lang] || this.data.en;
  }

  hasTranslation(lang: Lang): boolean {
    return lang === 'en' || !!this.data[lang];
  }

  getCategory(): Category {
    return this.data.en.category;
  }

  getTotalTime(): number {
    return this.data.en.prepTime + this.data.en.cookTime;
  }

  isVegetarian(): boolean {
    return this.data.en.cuisine.includes('Vegetarian');
  }

  isVegan(): boolean {
    return this.data.en.cuisine.includes('Vegan');
  }

  getDifficultyLevel(): Difficulty {
    return this.data.en.difficulty;
  }

  static fromDbRecipe(data: DbRecipe): RecipeEntity {
    return new RecipeEntity(data);
  }

  toDbRecipe(): DbRecipe {
    return this.data;
  }
} 