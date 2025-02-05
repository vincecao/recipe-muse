import { memo, PropsWithChildren } from "react";
import { FaGripfire, FaUsers } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { TiStarFullOutline } from "react-icons/ti";
import { Recipe } from "~/core/type";
import cn from "classnames";

export const DishHero = memo(function DishHero({ heroImgSrc, children }: PropsWithChildren<{ heroImgSrc: string }>) {
  return (
    <div className="relative h-[65vh] sm:h-[90vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImgSrc})` }} />

      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/20 via-slate-50/50 to-slate-50 dark:from-slate-900/20 dark:via-slate-900/40 dark:to-slate-900" />

      {children}
    </div>
  );
});

export const DishHeroDetail = memo(function DishHeroDetail({ recipe }: { recipe: Recipe }) {
  return (
    <div className="absolute inset-x-0 bottom-10 p-3 sm:p-8">
      <div className="max-w-4xl mx-auto backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-6 bg-white/20 border border-black/5 dark:bg-slate-800/70 dark:border-white/10">
        {/* Title and Difficulty */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-4xl font-serif font-medium leading-tight text-slate-900 dark:text-white">{recipe.title}</h1>
            <p className="text-sm sm:text-lg font-light max-w-2xl leading-snug text-slate-700 dark:text-slate-300">{recipe.description}</p>
          </div>
          {/* Difficulty Badge */}
          <div className="flex items-center">
            <span
              className={cn("px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap", {
                // Beginner
                "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300": recipe.difficulty === "Beginner",
                // Intermediate
                "bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300": recipe.difficulty === "Intermediate",
                // Advanced
                "bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300": recipe.difficulty === "Advanced",
              })}
            >
              {recipe.difficulty} Level
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3 mb-3 sm:mb-4">
          {[
            { icon: <GoClock />, label: "Prep Time", value: recipe.time },
            { icon: <FaGripfire />, label: "Calories", value: `${recipe.calories} kcal` },
            { icon: <TiStarFullOutline />, label: "Ingredients", value: `${recipe.ingredientsCount} items` },
            { icon: <FaUsers />, label: "Serving", value: recipe.servingSize },
          ].map((metric, index) => (
            <div key={index} className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/80 border border-black/5 dark:bg-slate-800/80 dark:border-white/5">
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
            <h3 className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">Features & Categories</h3>
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
                <span>Allergy Info</span>
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
