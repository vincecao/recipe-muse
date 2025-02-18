import { Recipe } from '~/core/type';

export default function translateRecipe(
  recipe: Partial<Recipe>,
  targetLanguage: string,
): [string, string, string | undefined, string] {
  return [
    `You are a professional culinary translator that help user from the world understand recipes from other places.`,
    `Translate the provided recipe JSON object to ${targetLanguage} following these rules:
1. Making sure all the nested values inside JSON structure gets all translated, and keep the JSON structure remain the same
2. Avoiding translate numerical values
3. Maintaining information accurately
4. Keeping special culinary terms untranslated when no direct equivalent exists
5. Maintaining original formatting (bullet points, numbering, etc)
6. Output must be valid single-line JSON without formatting

Input Recipe:
${JSON.stringify(recipe, null, 2)}

Remember: Output MUST be a single line JSON stringify version, output must can be parsed by JSON.parse() directly. Output can not contain any markdown elements.

Example Output:
{"title":"宫保鸡丁",...}`,
    undefined,
    '02-17-2025',
  ];
}
