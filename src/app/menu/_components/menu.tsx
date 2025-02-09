'use client';

import { memo, PropsWithChildren } from 'react';
import { FaGripfire, FaUsers } from 'react-icons/fa';
import { GoClock } from 'react-icons/go';
import { TiStarFullOutline } from 'react-icons/ti';
import { DbRecipe, Dish } from '~/core/type';
import { useLanguage } from '~/core/use-language';
import Image from 'next/image';

const TEXT_MAPPING = {
  en: {
    header: 'COMPUTATIONAL CUISINE',
    chefNote: "INNOVATION KITCHEN",
    chefDescription: "Our menu blends culinary artistry with modern food technology. Each algorithmically-inspired dish is perfected through iterative refinement, balancing flavor science and seasonal ingredients. Bon appétit!"
  },
  zh: {
    header: '数位美食',
    chefNote: '创新厨房',
    chefDescription: '我们的菜单融合烹饪艺术与现代食品科技，每道智能演算启发的菜肴都经过反复优化，平衡风味科学与时令食材。请慢用!'
  },
  ja: {
    header: 'デジタル料理',
    chefNote: '革新キッチン',
    chefDescription: '当メニューは調理技術と現代の食品科学を融合。アルゴリズムに着想を得た料理は、味の科学と季節の食材のバランスを追求しています。どうぞお召し上がりください!'
  }
};

export const MenuLayout = memo(function Layout({ children }: PropsWithChildren<unknown>) {
  return (
    <div className="w-full max-w-6xl mx-auto shadow-none sm:shadow-lg relative sm:rounded-xl bg-white dark:bg-slate-800">
      {children}
    </div>
  );
});

export const MenuHeader = memo(function MenuHeader() {
  const { language } = useLanguage();
  return (
    <div className="text-center pt-16 border-slate-200 dark:border-slate-700">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-3 my-3 w-48">
          <div className="h-px flex-1 bg-current opacity-30 dark:opacity-20 text-slate-900 dark:text-slate-200" />
          <div className="text-xl text-slate-900 dark:text-slate-200">✦</div>
          <div className="h-px flex-1 bg-current opacity-30 dark:opacity-20 text-slate-900 dark:text-slate-200" />
        </div>
        <div className="text-sm tracking-[0.25em] font-light text-slate-600 dark:text-slate-200">
          {TEXT_MAPPING[language]?.header || TEXT_MAPPING.en.header}
        </div>
      </div>
    </div>
  );
});

export const MenuContent = memo(function MenuContent({ children }: PropsWithChildren<unknown>) {
  return <div className="p-0 md:p-16 space-y-12">{children}</div>;
});

export const MenuSection = memo(function MenuSection({
  category,
  children,
}: PropsWithChildren<{ category: Dish['category'] }>) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        <h2 className="font-serif text-2xl tracking-[0.15em] text-center font-medium text-slate-800 dark:text-slate-200">
          {category.toUpperCase()}
        </h2>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>
      <div className="space-y-1 md:space-y-6">{children}</div>
    </section>
  );
});

export const DishLayout = memo(function DishCard({ children, bgImgSrc }: PropsWithChildren<{ bgImgSrc: string }>) {
  return (
    <article className="group relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex">
        <div className="w-[60%] bg-white dark:bg-slate-800" />
        <div className="relative w-[40%] overflow-hidden">
          <div className="relative h-full w-full">
            <Image
              src={bgImgSrc}
              alt="Menu background"
              fill
              priority
              className="absolute inset-0 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/65 to-transparent dark:from-slate-800 dark:to-transparent" />
          </div>
        </div>
      </div>
      {children}
    </article>
  );
});

export const DishItem = memo(function DishCard({ recipeRaw }: { recipeRaw: DbRecipe }) {
  const { language } = useLanguage();
  const recipe = recipeRaw[language] ?? recipeRaw.en;
  return (
    <div className="relative z-10 p-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 border-slate-300 dark:border-slate-600">
          <div className="flex justify-between mb-2">
            <h3 className="font-serif text-xl font-medium text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white">
              {recipe.title}
            </h3>
          </div>
          <p className="text-sm mb-3 font-light leading-relaxed text-slate-600 dark:text-slate-400">
            {recipe.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full backdrop-blur-sm bg-slate-100/80 text-slate-600 dark:bg-slate-700/80 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
            {recipe.allergens?.map((allergen) => (
              <span
                key={allergen}
                className="text-xs px-2 py-0.5 rounded-full backdrop-blur-sm bg-rose-50/80 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300"
              >
                {allergen}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mb-2 text-sm font-light">
            <span
              className={`
                  px-2 py-0.5 rounded text-xs backdrop-blur-sm
                  ${
                    recipe.difficulty === 'Beginner'
                      ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                      : recipe.difficulty === 'Intermediate'
                      ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                      : 'bg-rose-100/80 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400'
                  }
                `}
            >
              {recipe.difficulty}
            </span>
            <div className="flex gap-4">
              {[
                { icon: <GoClock className="w-4 h-4" />, value: recipe.time },
                { icon: <FaGripfire className="w-4 h-4" />, value: `${recipe.calories} kcal` },
                { icon: <TiStarFullOutline className="w-4 h-4" />, value: `${recipe.ingredientsCount} items` },
                { icon: <FaUsers className="w-4 h-4" />, value: recipe.servingSize },
              ].map(({ icon, value }, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 backdrop-blur-sm px-2 py-0.5 rounded bg-white/50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400"
                >
                  {icon}
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export const MenuFooter = memo(function MenuFooter() {
  const { language } = useLanguage();
  const texts = TEXT_MAPPING[language] || TEXT_MAPPING.en;
  return (
    <div className="mt-16z pt-8 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="font-serif text-2xl mb-4 font-medium text-slate-800 dark:text-slate-200">
          {texts.chefNote}
        </h3>
        <p className="text-sm leading-relaxed font-light text-slate-600 dark:text-slate-400">
          {texts.chefDescription}
        </p>
      </div>
    </div>
  );
});
