export default function generateRecipeByName(name: string): [string, string, string | undefined, string] {
  return [
    `You are a professional chef and recipe developer. Generate detailed, restaurant-quality recipes in strict JSON format. Follow all specifications precisely and maintain consistent formatting.`,
    `Generate a detailed recipe for: "${name}"

JSON Requirements:
1. Strictly follow the interface structure
2. Instructions must include:
  - Ingredients used in each step
  - Specific tools required
  - Detailed preparation tips
  - Cooking temperature and duration where applicable
3. Ingredients must specify preparation state (chopped, diced, etc.) when relevant
4. Include alternative ingredients where possible
5. Cooking times must be in minutes
6. Validate all measurements use allowed units
7. Ensure title < 40 chars and description 30-80 chars

Output ONLY the single line of stringified JSON without any formatting, commentary or markdown elements. 
The JSON object must can be parsed by JSON.parse() and must strictly follow this TypeScript interface:

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
    temperature?: {
      value: number;
      unit: "C" | "F"
    };
    duration?: number;
  }[];
  prepTime: number;
  cookTime: number;
  tools?: string[];
}

Example output:
{
  "category": "Appetizers",
  "title": "Truffle Burrata",
  ...
}
`,
    undefined,
    '02-08-2025',
  ];
}
