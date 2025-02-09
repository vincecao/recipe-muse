import { Recipe } from '~/core/type';

export default function translateRecipe(
  recipe: Partial<Recipe>,
  targetLanguage: string,
): [string, string, string | undefined, string] {
  return [
    `You are a professional culinary translator that help user from the world understand recipes from other places.`,
    `Translate the provided recipe json object to ${targetLanguage} following these rules:
1. Keep all JSON keys in original English. Make sure the string values inside JSON structure gets translated, the type will remain the same 
2. Avoid translate numerical values (quantities, times, calories)
3. Maintaining information accurately
4. Keeping special culinary terms untranslated when no direct equivalent exists
5 Maintaining original formatting (bullet points, numbering, etc)
6. Output must be valid single-line JSON without formatting

Input Recipe:
${JSON.stringify(recipe, null, 2)}

Remember: Output MUST be a single line JSON stringify version, output must can be parsed by JSON.parse() directly. Output can not contain any markdown elements.

Example Output:
{"category":"Main Course","title":"宫保鸡丁",...}`,
    undefined,
    '02-08-2025',
  ];
}
