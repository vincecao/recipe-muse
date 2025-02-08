import { Link } from '@remix-run/react';
import { memo, PropsWithChildren } from 'react';
import { FaGripfire, FaUsers } from 'react-icons/fa';
import { GoClock } from 'react-icons/go';
import { TiStarFullOutline } from 'react-icons/ti';
import { DbRecipe, Dish, Recipe } from '~/core/type';
import { useLanguage } from '~/core/useLanguage';

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
          <div className="h-px flex-1 bg-current opacity-30" />
          <div className="text-xl">✦</div>
          <div className="h-px flex-1 bg-current opacity-30" />
        </div>
        <div className="text-sm tracking-[0.25em] font-light text-slate-600 dark:text-slate-400">
          {language === 'en' ? 'ARTISANAL CUISINE' : '手工美食'}
        </div>
      </div>
    </div>
  );
});

export const MenuContent = memo(function MenuContent({ children }: PropsWithChildren<unknown>) {
  return <div className="p-8 md:p-16 space-y-12">{children}</div>;
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
      <div className="space-y-6">{children}</div>
    </section>
  );
});

export const MenuDish = memo(function DishCard({ recipe, images }: { recipe: Recipe; images: DbRecipe['images'] }) {
  return (
    <DishLayout bgImgSrc={images[0]}>
      <Link to={`/recipe`} state={{ recipe, images }} preventScrollReset>
        <DishItem recipe={recipe}></DishItem>
      </Link>
    </DishLayout>
  );
});

export const DishLayout = memo(function DishCard({ children, bgImgSrc }: PropsWithChildren<{ bgImgSrc: string }>) {
  return (
    <article className="group relative overflow-hidden">
      <div className="absolute inset-0 z-0 flex">
        <div className="w-[60%] bg-white dark:bg-slate-800" />
        <div className="relative w-[40%] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImgSrc})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/65 to-transparent dark:from-slate-800 dark:to-transparent" />
          </div>
        </div>
      </div>
      {children}
    </article>
  );
});

export const DishItem = memo(function DishCard({ recipe }: { recipe: Recipe }) {
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
  return (
    <div className="mt-16z pt-8 border-t border-slate-200 dark:border-slate-700">
      <div className="max-w-2xl mx-auto text-center">
        <h3 className="font-serif text-2xl mb-4 font-medium text-slate-800 dark:text-slate-200">
          {language === 'en' ? "CHEF'S NOTE" : '主厨笔记'}
        </h3>
        <p className="text-sm leading-relaxed font-light text-slate-600 dark:text-slate-400">
          {language === 'en'
            ? "Our menu changes daily based on seasonal ingredients and chef's inspiration. Each dish is crafted with care, considering dietary preferences and cooking expertise. Enjoy your culinary journey!"
            : '我们的菜单根据时令食材和主厨的灵感每日更新。每道菜都精心制作,考虑饮食偏好和烹饪技巧。享受您的烹饪之旅!'}
        </p>
      </div>
    </div>
  );
});
