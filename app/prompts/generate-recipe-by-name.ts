export default function generateRecipeByName(name: string) {
  return [
    `
Create a detailed recipe adhering strictly to the following TypeScript interface structure. Output ONLY a stringified JSON object with:

\`\`\`ts
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type Category = "Appetizers" | "Main Course" | "Desserts" | "Beverages" | "Cocktails";

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
type RecipeInstruction = {
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
  unit: "g" | "kg" | "L" | "ml" | "tsp" | "tbsp" | "cup" | "pc" | "slice" | "oz" | "lb" | "bunch" | "dash" | "pinch" | "clove" | "scoop";
  name: string;
  preparation?: string;
  alternatives?: RecipeIngredient[];
  state?: string; // state of the ingredient such as "raw", "processed", "dry", "cooked", "chopped", etc;
}
\`\`\`

Make sure
- Images are all realistic copyfree photos, ideally grab between 2-5
- id generated as uuid
- title (max 40 chars)
- all descriptions (30-80 chars)
- prepTime + cookTime (sum to match time field)
- all unit must be singular
- make sure all information is accurate and easy to understand

Format response as a single line JSON string without markdown, and make sure string is JSON.parse valid. Example input/output:

Input: "Truffle Burrata"
Output: "{\\"id\\":\\"app-1-full\\",\\"category\\":\\"Appetizers\\",...}"

Now create for: "${name}"
`,
    "02-04-2025",
  ];
}
