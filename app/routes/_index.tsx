import type { MetaFunction } from "@remix-run/node";
import { Dish } from "~/core/dish";
import { recommendedDishes } from "~/data/dish";
import { useMantineColorScheme } from "@mantine/core";
import { FaGripfire, FaUsers } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";
import { GoClock } from "react-icons/go";
import { TiStarFullOutline } from "react-icons/ti";

export const meta: MetaFunction = () => {
  return [{ title: "MealMuse - Daily Menu" }, { name: "description", content: "Today's curated selection of dishes, crafted with care and precision." }];
};

export default function Index() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const dishesByCategory = recommendedDishes.reduce((acc: Record<Dish["category"], Dish[]>, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<Dish["category"], Dish[]>);

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className={`max-w-6xl mx-auto ${isDark ? "bg-slate-800" : "bg-white"} shadow-lg relative`}>
        {/* Theme Toggle Button */}
        <button
          onClick={() => toggleColorScheme()}
          className={`
            absolute top-6 right-6
            flex items-center gap-2 px-3 py-2
            font-serif text-sm tracking-wider
            border rounded-md
            transition-all duration-300
            ${isDark ? "text-amber-300 border-amber-300/30 hover:border-amber-300/60" : "text-slate-600 border-slate-200 hover:border-slate-400"}
          `}
        >
          <span className="sr-only">Toggle theme</span>
          {isDark ? (
            <>
              <FiSun className="w-4 h-4" />
              <span className="hidden sm:inline">LIGHT MODE</span>
            </>
          ) : (
            <>
              <FiMoon className="w-4 h-4" />
              <span className="hidden sm:inline">DARK MODE</span>
            </>
          )}
        </button>
        {/* Menu Header */}
        <div className={`text-center py-12 border-b ${isDark ? "border-slate-700" : "border-slate-200"}`}>
          <div className="flex flex-col items-center">
            {/* Main Title */}
            <h1 className="relative font-serif text-6xl font-medium tracking-wider mb-2">
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-sm tracking-[0.3em] font-light leading-none">ESTABLISHED 2024</span>
              <span className="relative">
                MEAL
                <span className="font-light italic px-1">~</span>
                MUSE
              </span>
            </h1>

            {/* Decorative Line */}
            <div className="flex items-center gap-3 my-3 w-48">
              <div className="h-px flex-1 bg-current opacity-30" />
              <div className="text-xl">✦</div>
              <div className="h-px flex-1 bg-current opacity-30" />
            </div>

            {/* Subtitle */}
            <div className={`text-sm tracking-[0.25em] font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>ARTISANAL CUISINE</div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="p-8 md:p-16 space-y-12">
          {Object.entries(dishesByCategory).map(([category, dishes]) => (
            <section key={category} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`h-px flex-1 ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
                <h2 className={`font-serif text-2xl tracking-[0.15em] text-center font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>{category.toUpperCase()}</h2>
                <div className={`h-px flex-1 ${isDark ? "bg-slate-700" : "bg-slate-200"}`} />
              </div>

              <div className="space-y-6">
                {dishes.map((dish) => (
                  <article key={dish.title} className="group">
                    <div className="flex justify-between items-start gap-4">
                      <div className={`flex-1 border-b border-dotted ${isDark ? "border-slate-600" : "border-slate-300"}`}>
                        {/* Title and Price Row */}
                        <div className="flex justify-between mb-2">
                          <h3 className={`font-serif text-xl font-medium ${isDark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"}`}>{dish.title}</h3>
                          <div className={`font-serif text-xl font-medium ${isDark ? "text-amber-400" : "text-amber-600"}`}>{dish.price}</div>
                        </div>

                        {/* Description */}
                        <p className={`text-sm mb-3 font-light leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{dish.description}</p>

                        {/* Tags and Allergens */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {dish.tags.map((tag) => (
                            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                              {tag}
                            </span>
                          ))}
                          {dish.allergens?.map((allergen) => (
                            <span key={allergen} className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-rose-900/30 text-rose-300" : "bg-rose-50 text-rose-600"}`}>
                              {allergen}
                            </span>
                          ))}
                        </div>

                        {/* Metrics Row */}
                        <div className="flex flex-wrap gap-4 mb-2 text-sm font-light">
                          {/* Difficulty */}
                          <span
                            className={`
                          px-2 py-0.5 rounded text-xs
                          ${dish.difficulty === "Beginner" ? (isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100 text-emerald-700") : dish.difficulty === "Intermediate" ? (isDark ? "bg-amber-900/50 text-amber-400" : "bg-amber-100 text-amber-700") : isDark ? "bg-rose-900/50 text-rose-400" : "bg-rose-100 text-rose-700"}
                        `}
                          >
                            {dish.difficulty}
                          </span>

                          {/* Time */}
                          <span className={`flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            <GoClock className="w-4 h-4" />
                            {dish.time}
                          </span>

                          {/* Calories */}
                          <span className={`flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            <FaGripfire className="w-4 h-4" />
                            {dish.calories} kcal
                          </span>

                          {/* Ingredients Count */}
                          <span className={`flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            <TiStarFullOutline className="w-4 h-4" />
                            {dish.ingredientsCount} items
                          </span>

                          {/* Serving Size */}
                          <span className={`flex items-center gap-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                            <FaUsers className="w-4 h-4" />
                            {dish.servingSize}
                          </span>
                        </div>
                      </div>

                      {/* Dish Image */}
                      <div className="hidden sm:block w-24 h-24 flex-shrink-0">
                        <img src={dish.images[0]} alt={dish.title} className={`w-full h-full object-cover rounded-lg ${isDark ? "border-2 border-slate-700" : "border border-slate-200"}`} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {/* Footer Note */}
          <div className={`mt-16 pt-8 border-t ${isDark ? "border-slate-700" : "border-slate-200"}`}>
            <div className="max-w-2xl mx-auto text-center">
              <h3 className={`font-serif text-2xl mb-4 font-medium ${isDark ? "text-slate-200" : "text-slate-800"}`}>CHEF'S NOTE</h3>
              <p className={`text-sm leading-relaxed font-light ${isDark ? "text-slate-400" : "text-slate-600"}`}>Our menu changes daily based on seasonal ingredients and chef's inspiration. Each dish is crafted with care, considering dietary preferences and cooking expertise. Enjoy your culinary journey!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
