'use client';

import { DishItem, DishLayout, MenuContent } from './menu';
import { RecipeDetail } from './detail';
import type { DbRecipe } from '~/domain/entities/recipe.entity';
import useLanguage from '~/shared/hooks/use-language';
import { useState } from 'react';

export default function View({ recipes }: { recipes: DbRecipe[] }) {
  const { language } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="grid grid-cols-3">
      <MenuContent>
        {recipes.map((recipe, index) => {
          const r = recipe[language] ?? recipe.en;
          return (
            <DishLayout key={r.id} bgImgSrc={recipe.images[0]}>
              <button onClick={() => setSelectedIndex(index)}>
                <DishItem recipeRaw={recipe}></DishItem>
              </button>
            </DishLayout>
          );
        })}
      </MenuContent>
      <div className="col-span-2">
        {recipes[selectedIndex] && (
          <MenuContent>
            <RecipeDetail recipeRaw={recipes[selectedIndex]} images={recipes[selectedIndex].images} />
          </MenuContent>
        )}
      </div>
    </div>
  );
}
