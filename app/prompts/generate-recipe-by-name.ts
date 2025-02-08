export default function generateRecipeByName(name: string): [string | undefined, string, string | undefined, string] {
  return [
    undefined,
    `You are a recipe generator. Your task is to generate a recipe in JSON format based on the given name.

The output MUST be a single line stringified JSON object that can be parsed by JSON.parse(). Do not include any markdown, code blocks, or explanations.

The JSON object must strictly follow this TypeScript interface:

type Difficulty = "Beginner" | "Intermediate" | "Advanced";
type Category = "Appetizers" | "Main Course" | "Desserts" | "Beverages" | "Cocktails";
type Cuisine =
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
  | "Nordic"
  | "Southern"
  | "Pacific Islander"
  | "Fusion"
  | "Vegetarian"
  | "Vegan"
  | "Kosher"
  | "BBQ";

interface Recipe {
  category: Category;
  title: string; // Max 40 chars
  description: string; // 30-80 chars
  difficulty: Difficulty;
  ingredientsCount: number;
  time: string; // Total of prepTime + cookTime
  calories: number;
  tags: string[];
  servingSize: string;
  allergens?: string[];
  cuisine: Cuisine[];
  ingredients: {
    quantity: number;
    unit: "g" | "kg" | "L" | "ml" | "tsp" | "tbsp" | "cup" | "pc" | "slice" | "oz" | "lb" | "bunch" | "dash" | "pinch" | "clove" | "scoop"; // Must be singular
    name: string;
    preparation?: string;
    alternatives?: Array<{quantity: number, unit: string, name: string}>;
    state?: string;
  }[];
  instructions: {
    description: string;
    order: number;
    ingredientsUsed?: string[];
    toolsNeeded?: string[];
    tips?: string;
    images?: string[];
    temperature?: {
      value: number;
      unit: "C" | "F"
    };
    duration?: number;
  }[];
  prepTime: number;
  cookTime: number;
  tools?: string[];
  videoUrl?: string;
}

Generate a recipe for: "${name}"

Important modifications:
1. DO NOT generate any image URLs - we'll add them separately
2. Include detailed visual descriptions for potential images using "imageDescriptions" array instead of "images"
3. Add 3-5 image description strings that could be used to find relevant photos

Example response:
{
  "category": "Appetizers",
  "title": "Truffle Burrata",
  "imageDescriptions": [
    "Creamy burrata cheese drizzled with truffle oil on a wooden board",
    "Close-up of burrata cheese being cut open with oozing center",
    "Burrata served with heirloom tomatoes and fresh basil"
  ],
  // ... rest of fields ...
}`,
    undefined,
    "02-05-2025",
  ];
}
