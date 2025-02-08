'use client'

import { DishItem, DishLayout, MenuContent } from '~/app/menu/_components/menu';
import { RecipeDetail } from '~/app/menu/recipe/[id]/_components/detail';
import { DbRecipe } from '~/core/type';
import { useLanguage } from '~/core/use-language';
import { useState } from 'react';

export default function View({ recipes }: { recipes: DbRecipe[] }) {
  const { language } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="flex">
      <MenuContent>
        {recipes.map((recipe, index) => {
          const r = recipe[language];
          return (
            <DishLayout key={r.id} bgImgSrc={recipe.images[0]}>
              <button onClick={() => setSelectedIndex(index)}>
                <DishItem recipeRaw={recipe}></DishItem>
              </button>
            </DishLayout>
          );
        })}
      </MenuContent>
      <MenuContent>
        <RecipeDetail recipeRaw={recipes[selectedIndex]} images={recipes[selectedIndex].images} />
      </MenuContent>
    </div>
  );
}
