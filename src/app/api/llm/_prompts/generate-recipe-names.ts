import { Cuisine } from '~/core/type';

export default function generateRecipeNames(
  cuisines: Cuisine[],
  length: number = 1,
  category: string = 'unspecified',
  randomnessFactor: number = Math.random(),
): [string, string, string | undefined, string] {
  return [
    `You are a culinary exploration engine. Generate diverse, authentic recipe names from global cuisines with unpredictable selection. Prioritize lesser-known regional dishes and avoid common suggestions. Maintain 30% unpredictability in selections.`,
    `Generate ${length} recipe names from these cuisines: ${cuisines.join(', ')}. Category of recipe is ${category}.

Requirements:
- If multiple cuisines are provided, combine randomly for fusion dishes
- If category is unspecified, randomize category distribution: 
  Appetizers (25%), Main Course (45%), Desserts (20%), Beverages/Cocktails (10%)
- Each name must be max 40 characters
- Names must be accurate and easily recognizable
- Generate total ${length} recipe name(s)

Randomness factor: ${randomnessFactor}. Which means you will create 10000 recipe names in your mind and then you will pick several ones based on given randomness factor, and trim down to only ${length} again as output

The output MUST be a single line stringified JSON array that can be parsed by JSON.parse(). Do not include any markdown, code blocks, or explanations.
For example: 
["Adana Kebap with Sumac Onions", "Bánh Khọt Coconut Mini Pancakes", "Sakura Mochi Bentō", "Picanha na Churrasqueira"]`,
    undefined,
    '02-08-2025',
  ];
}
