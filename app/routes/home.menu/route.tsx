import { useOutletContext } from '@remix-run/react';
import { DbRecipe, Lang, Recipe } from '~/core/type';
import { MenuLayout, MenuHeader, MenuContent, MenuSection, MenuDish, MenuFooter } from './menu';
import { HomeContext } from '../home/route';
import { useMemo } from 'react';
import { useLanguage } from '~/core/useLanguage';

const recipesByCategory = (recipes: DbRecipe[], lang: Lang) =>
  recipes.reduce((acc: Record<Recipe['category'], Recipe[]>, recipe: DbRecipe) => {
    const category = recipe[lang].category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe[lang]);
    return acc;
  }, {} as Record<Recipe['category'], Recipe[]>);

export default function HomeMenuRoute() {
  const { language } = useLanguage();
  const { recipes } = useOutletContext<HomeContext>();

  const imageMap = useMemo(
    () => new Map<string, string[]>(recipes.map((r) => [r[language].id, r.images])),
    [language, recipes],
  );

  const mapping = useMemo(() => {
    return Object.entries(recipesByCategory(recipes, language));
  }, [recipes, language]);

  return (
    <MenuLayout>
      <MenuHeader />
      <MenuContent>
        {mapping.map(([category, recipes]) => (
          <MenuSection key={category} category={category as Recipe['category']}>
            {recipes.map((recipe) => (
              <MenuDish key={recipe.id} recipe={recipe} images={imageMap.get(recipe.id)!} />
            ))}
          </MenuSection>
        ))}
        <MenuFooter />
      </MenuContent>
    </MenuLayout>
  );
}
