export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Category = "Appetizers" | "Main Course" | "Desserts" | "Beverages";

export interface Dish {
  id: string;
  category: Category;
  title: string;
  description: string;
  difficulty: Difficulty;
  ingredientsCount: number;
  time: string;
  calories: number;
  images: string[];
  tags: string[];
  servingSize: string;
  allergens?: string[];
  cuisine:
    | "Italian"
    | "French"
    | "Spanish"
    | "Greek"
    | "Mediterranean"
    | "Mexican"
    | "Brazilian"
    | "Peruvian"
    | "American"
    | "Japanese"
    | "Chinese"
    | "Thai"
    | "Indian"
    | "Middle Eastern"
    | "Lebanese"
    | "Turkish"
    | "Moroccan"
    | "Ethiopian"
    | "Korean"
    | "Vietnamese"
    | "Caribbean"
    | "Cajun/Creole"
    | "German"
    | "British"
    | "Irish"
    | "Scandinavian"
    | "Russian"
    | "Hawaiian"
    | "Filipino"
    | "Malaysian"
    | "Indonesian"
    | "South African"
    | "Soul Food"
    | "Tex-Mex"
    | "Israeli"
    | "Polish"
    | "Portuguese"
    | "Argentinian"
    | "Vietnamese"
    | "Nordic"
    | "Southern"
    | "Pacific Islander"
    | "Fusion"
    | "Vegetarian"
    | "Vegan"
    | "Kosher"
    | "BBQ";
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
    unit: "C" | "F";
  };
  duration?: number; // in minutes
};

// Ingredient specification
export interface RecipeIngredient {
  quantity: number;
  unit: Unit;
  name: string;
  preparation?: string;
  alternatives?: RecipeIngredient[];
  state?: string; // state of the ingredient such as "raw", "processed", "dry", "cooked", "chopped", etc;
}

export type Unit = "g" | "kg" | "L" | "ml" | "tsp" | "tbsp" | "cup" | "pc" | "slice" | "oz" | "lb" | "bunch" | "dash" | "pinch" | "clove";

export const sampleRecipe: Recipe = {
  id: "3a8e6f12-94d4-47a5-b41d-3c6f789542b1",
  category: "Main Course",
  title: "Lobster Risotto with Saffron",
  description: "Creamy Arborio rice cooked in lobster broth with fresh tarragon and parmesan",
  difficulty: "Intermediate",
  ingredientsCount: 12,
  time: "45 mins",
  calories: 650,
  images: ["https://images.unsplash.com/photo-1625943553958-3ab25a0f1d3a", "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg"],
  tags: ["Italian", "Seafood", "Gourmet"],
  servingSize: "For 2",
  allergens: ["Shellfish", "Dairy"],
  cuisine: "Italian",
  ingredients: [
    {
      quantity: 320,
      unit: "g",
      name: "Arborio rice",
      state: "dry",
    },
    {
      quantity: 2,
      unit: "pc",
      name: "Lobster tail",
      state: "raw",
    },
    {
      quantity: 1000,
      unit: "ml",
      name: "Fish stock",
      state: "hot",
    },
    {
      quantity: 1,
      unit: "pc",
      name: "Shallot",
      preparation: "finely chopped",
    },
    {
      quantity: 2,
      unit: "clove",
      name: "Garlic",
      state: "minced",
    },
    {
      quantity: 120,
      unit: "ml",
      name: "Dry white wine",
    },
    {
      quantity: 60,
      unit: "g",
      name: "Butter",
    },
    {
      quantity: 80,
      unit: "g",
      name: "Parmesan",
      state: "grated",
    },
    {
      quantity: 30,
      unit: "ml",
      name: "Olive oil",
    },
    {
      quantity: 1,
      unit: "pinch",
      name: "Saffron",
    },
    {
      quantity: 10,
      unit: "g",
      name: "Tarragon",
      state: "chopped",
    },
    {
      quantity: 1,
      unit: "pc",
      name: "Lemon",
      preparation: "zested",
    },
  ],
  instructions: [
    {
      order: 1,
      description: "Heat stock to 85°C",
      temperature: {
        value: 85,
        unit: "C",
      },
      duration: 5,
    },
    {
      order: 2,
      description: "Sauté shallot and garlic in olive oil",
      toolsNeeded: ["Sauté pan"],
      duration: 3,
    },
    {
      order: 3,
      description: "Toast rice until translucent edges form",
      duration: 5,
    },
    {
      order: 4,
      description: "Deglaze pan with white wine",
      duration: 2,
    },
    {
      order: 5,
      description: "Add stock gradually while stirring constantly",
      toolsNeeded: ["Wooden spoon"],
      duration: 18,
    },
    {
      order: 6,
      description: "Pan-sear lobster in butter until opaque",
      duration: 4,
    },
    {
      order: 7,
      description: "Fold in parmesan and saffron threads",
    },
    {
      order: 8,
      description: "Garnish with lemon zest and fresh tarragon",
    },
  ],
  prepTime: 15,
  cookTime: 30,
  tools: ["Sauté pan", "Wooden spoon", "Zester", "Ladle", "Chef's knife"],
  videoUrl: "https://www.youtube.com/embed/lobsterrisotto123",
};

// export const sampleRecipe2: Recipe = {
//   id: "main-7-lobr",
//   category: "Main Course",
//   title: "Lobster Risotto",
//   description: "Creamy Italian rice dish with fresh lobster, Parmesan, and lemon zest",
//   difficulty: "Intermediate",
//   ingredientsCount: 11,
//   time: "40 mins",
//   calories: 650,
//   price: "$28",
//   images: ["https://images.unsplash.com/photo-1625943553958-3ab25a0f1d3a", "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg"],
//   tags: ["Italian", "Seafood", "Gourmet", "Creamy"],
//   servingSize: "For 2",
//   allergens: ["Shellfish", "Dairy"],
//   ingredients: [
//     {
//       name: "Arborio rice",
//       quantity: 320,
//       unit: "g",
//       state: "dry",
//     },
//     {
//       name: "Lobster",
//       quantity: 400,
//       unit: "g",
//       state: "cooked",
//     },
//     {
//       name: "Chicken stock",
//       quantity: 1000,
//       unit: "ml",
//       state: "hot",
//     },
//     {
//       name: "Shallot",
//       quantity: 1,
//       unit: "pc",
//       state: "chopped",
//     },
//     {
//       name: "Garlic",
//       quantity: 2,
//       unit: "cloves",
//       state: "minced",
//     },
//     {
//       name: "Dry white wine",
//       quantity: 120,
//       unit: "ml",
//       state: "room temp",
//     },
//     {
//       name: "Butter",
//       quantity: 50,
//       unit: "g",
//       state: "cubed",
//     },
//     {
//       name: "Parmesan",
//       quantity: 80,
//       unit: "g",
//       state: "grated",
//     },
//     {
//       name: "Lemon",
//       quantity: 1,
//       unit: "pc",
//       state: "zested",
//     },
//     {
//       name: "Olive oil",
//       quantity: 30,
//       unit: "ml",
//       state: "extra virgin",
//     },
//     {
//       name: "Parsley",
//       quantity: 10,
//       unit: "g",
//       state: "chopped",
//     },
//   ],
//   instructions: [
//     {
//       type: "step",
//       description: "Heat stock to simmer (85°C/185°F)",
//     },
//     {
//       type: "step",
//       description: "Sauté shallot and garlic in olive oil until translucent",
//     },
//     {
//       type: "duration",
//       description: "Toast rice 3 mins",
//     },
//     {
//       type: "step",
//       description: "Deglaze with white wine until absorbed",
//     },
//     {
//       type: "duration",
//       description: "Add stock gradually over 18 mins",
//     },
//     {
//       type: "step",
//       description: "Fold in lobster, butter, and Parmesan",
//     },
//     {
//       type: "duration",
//       description: "Rest 2 mins",
//     },
//     {
//       type: "step",
//       description: "Garnish with lemon zest and parsley",
//     },
//   ],
//   prepTime: 15,
//   cookTime: 25,
//   tools: ["Sauté Pan", "Ladle", "Chef's Knife", "Wooden Spoon", "Zester"],
//   videoUrl: "https://www.youtube.com/embed/lobsterrisotto123",
// };
