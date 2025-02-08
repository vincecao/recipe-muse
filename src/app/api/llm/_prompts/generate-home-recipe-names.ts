import { Cuisine } from '~/core/type';

export default function generateHomeRecipeNames(
  cuisines: Cuisine[],
  length: number = 1,
): [string | undefined, string, string | undefined, string] {
  return [
    undefined,
    `You are a recipe name generator. Your task is to generate a list of recipe names organized by category.

The output MUST be a single line stringified JSON array that can be parsed by JSON.parse(). Do not include any markdown, code blocks, or explanations.

Requirements:
- Generate total ${length} recipe name(s), from any of below categories: Appetizers, Main Course, Desserts, Beverages, Cocktails
- Make sure recipe names return is belong to cuisines: ${cuisines.join(', ')}
- Use common and popular dish/item names from various cuisines
- Each name must be max 40 characters
- Names must be accurate and easily recognizable
- Each time you generate, provide different recipe names even for the same cuisine and category
- Avoid repeating previously suggested recipes by exploring diverse dishes within each cuisine
- Mix and match ingredients, cooking methods, and regional variations to create unique combinations

The output should be exactly ${length} items total.

Example Output:
["Crispy Spring Rolls"]
or 
["Crispy Spring Rolls", "Caprese Salad"]

Remember: Output MUST be a single line JSON string that can be parsed by JSON.parse().`,
    undefined,
    '02-07-2025',
  ];
}
