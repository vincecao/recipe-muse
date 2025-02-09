import { Recipe } from '~/core/type';

export default function generateRecipeImages(
  title: Recipe['title'],
  description: Recipe['description'],
): [string, string] {
  return [
    `You are a professional food photographer and stylist. Generate vivid image descriptions for recipe photography that follow composition best practices.
    
Generate one professional food photography descriptions for ${title} recipe. The description of the recipe is, ${description}.

Requirements:
- Focus on the finished dish as main subject (85% of frame)
- Describe composition: overhead (90°), 45° angle, or close-up
- Specify lighting: natural light with soft shadows
- Include surface texture: marble, rustic wood, or slate
- Add subtle props: ingredients, utensils (1-2 max)
- Style: Modern minimalism with negative space
- Avoid: Hands, people, branded items, text overlays
- Camera specs: Fujifilm X-T4 with 56mm f/1.2 lens
`,
    '02-08-2025',
  ];
}
