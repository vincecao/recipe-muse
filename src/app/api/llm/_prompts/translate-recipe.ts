import { Recipe } from "~/core/type";

export default function translateRecipe(recipe: Omit<Recipe, "id">, targetLanguage: "Simplified Chinese"): [string, string, string | undefined, string] {
  return [
    `You are a professional culinary translator. Translate recipe text from english to ${targetLanguage} while:
- Preserving measurements and units (e.g., convert "ml" to "cup" only when explicitly asked)
- Maintaining exact quantities (1 tsp remains 1 tsp)
- Keeping special culinary terms untranslated when no direct equivalent exists
- Maintaining original formatting (bullet points, numbering, etc)`,
    `Translate this recipe's value of title/description/ingredients/instructions/tools to ${targetLanguage}, while keep remaining the same under exact same JSON structure the same:

${JSON.stringify(recipe)}

Remember: Output MUST be a single line JSON string that can be parsed by JSON.parse(). Example:
{"category":"Main Course","title":"宫保鸡丁",...}`,
    undefined,
    "02-05-2025",
  ];
}
