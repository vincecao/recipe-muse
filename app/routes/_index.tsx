import type { MetaFunction } from "@remix-run/node";
import { Dish } from "~/core/dish";
import { recommendedDishes } from "~/data/dish";
import { useMantineColorScheme } from "@mantine/core";
import DishCard from "~/component/DishCard";

export const meta: MetaFunction = () => {
  return [{ title: "MealMuse - Daily Menu" }, { name: "description", content: "Today's curated selection of dishes, crafted with care and precision." }];
};

export default function Index() {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const dishesByCategory = recommendedDishes.reduce((acc: Record<Dish["category"], Dish[]>, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<Dish["category"], Dish[]>);

  return (
    <div className={`min-h-screen p-12 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className={`max-w-6xl mx-auto ${isDark ? "bg-slate-800" : "bg-white"} shadow-lg relative`}>
        {/* Menu Header */}
        <div className={`text-center py-12 ${isDark ? "border-slate-700" : "border-slate-200"}`}>
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
                  <DishCard key={dish.id} dish={dish} isDark={isDark} />
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
