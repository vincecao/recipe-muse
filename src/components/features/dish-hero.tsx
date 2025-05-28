'use client';

import { GoClock } from 'react-icons/go';
import { TiStarFullOutline } from 'react-icons/ti';
import { DbRecipe, Lang } from '~/domain/entities/recipe.entity';
import { difficultyTranslations } from '~/domain/value-objects/translations.vo';
import cn from 'classnames';
import { memo, PropsWithChildren } from 'react';
import { FaGripfire, FaUsers } from 'react-icons/fa';
import useLanguage from '~/shared/hooks/use-language';
import Image from 'next/image';

// Text mapping for multiple languages
const textMap: {[key in Lang]: {
  prepTime: string;
  calories: string;
  ingredients: string;
  serving: string;
  featuresCategories: string;
  allergyInfo: string;
  level: string;
}} = {
  en: {
    prepTime: 'Prep Time',
    calories: 'Calories',
    ingredients: 'Ingredients',
    serving: 'Serving',
    featuresCategories: 'Features & Categories',
    allergyInfo: 'Allergy Info',
    level: 'Level'
  },
  zh: {
    prepTime: '准备时间',
    calories: '卡路里',
    ingredients: '食材',
    serving: '份量',
    featuresCategories: '特色与分类',
    allergyInfo: '过敏信息',
    level: '等级'
  },
  ja: {
    prepTime: '準備時間',
    calories: 'カロリー',
    ingredients: '材料',
    serving: '人数',
    featuresCategories: '特徴とカテゴリー',
    allergyInfo: 'アレルギー情報',
    level: 'レベル'
  }
};

export const DishHero = memo(function DishHero({ heroImgSrc, children }: PropsWithChildren<{ heroImgSrc: string }>) {
  return (
    <div className="relative h-[65vh] sm:h-[90vh] w-full">
      <div className="relative h-full w-full">
        <Image
          src={heroImgSrc}
          alt="Dish hero image"
          fill
          priority
          className="absolute inset-0 object-cover object-center"
        />
      </div>

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/20 via-slate-50/50 to-slate-50 dark:from-slate-900/20 dark:via-slate-900/40 dark:to-slate-900" />

      {children}
    </div>
  );
});

export const DishHeroDetail = memo(function DishHeroDetail({ recipeRaw }: { recipeRaw: DbRecipe }) {
  const { language } = useLanguage();
  const recipe = recipeRaw[language] ?? recipeRaw.en;
  const t = textMap[language] || textMap.en;

  return (
    <div className="absolute inset-x-0 bottom-10 p-3 sm:p-8">
      <div className="max-w-4xl mx-auto backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6 bg-white/20 border border-black/5 dark:bg-slate-800/70 dark:border-white/10">
        {/* Title and Difficulty */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-4xl font-serif font-medium leading-tight text-slate-900 dark:text-white">
              {recipe.title}
            </h1>
            <p className="text-sm sm:text-lg font-light max-w-2xl leading-snug text-slate-700 dark:text-slate-300">
              {recipe.description}
            </p>
          </div>
          {/* Difficulty Badge */}
          <div className="flex items-center">
            <span
              className={cn(
                'px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap',
                {
                  // Beginner
                  'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300':
                    recipe.difficulty === 'Beginner',
                  // Intermediate
                  'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300':
                    recipe.difficulty === 'Intermediate',
                  // Advanced
                  'bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300':
                    recipe.difficulty === 'Advanced',
                },
              )}
            >
              {difficultyTranslations[recipe.difficulty]?.[language]} {t.level}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3 mb-3 sm:mb-4">
          {[
            { icon: <GoClock />, label: t.prepTime, value: recipe.time },
            { icon: <FaGripfire />, label: t.calories, value: `${recipe.calories} kcal` },
            { icon: <TiStarFullOutline />, label: t.ingredients, value: `${recipe.ingredientsCount} items` },
            { icon: <FaUsers />, label: t.serving, value: recipe.servingSize },
          ].map((metric, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/80 border border-black/5 dark:bg-slate-800/80 dark:border-white/5"
            >
              <div className="text-lg sm:text-xl text-amber-600 dark:text-amber-400">{metric.icon}</div>
              <div>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{metric.label}</div>
                <div className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">{metric.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tags and Allergens */}
        <div className="space-y-2 sm:space-y-4">
          {/* Tags Section */}
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">{t.featuresCategories}</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-base flex items-center gap-1 
                           bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 
                           dark:bg-slate-700/50 dark:text-slate-300 dark:hover:bg-slate-700/70"
                >
                  <span className="text-amber-400 text-[8px] sm:text-sm">•</span>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>
          </div>

          {/* Allergens Section */}
          {recipe.allergens && recipe.allergens.length > 0 && (
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-xs sm:text-sm font-medium flex items-center gap-1 text-rose-600 dark:text-rose-300">
                <span className="text-[10px] sm:text-sm">⚠️</span>
                <span>{t.allergyInfo}</span>
              </h3>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {recipe.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-base
                             bg-rose-100/80 text-rose-700 hover:bg-rose-200/80 
                             dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/40"
                  >
                    {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
