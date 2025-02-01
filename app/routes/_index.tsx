import type { MetaFunction } from "@remix-run/node";
import { Dish } from "~/core/dish";
import { recommendedDishes } from "~/data/dish";
import { memo, PropsWithChildren } from "react";
import { useIsDark } from "~/core/useIsDark";
import { Link } from "@remix-run/react";
import { FaGripfire, FaUsers } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { TiStarFullOutline } from "react-icons/ti";
import cn from "classnames";

export const meta: MetaFunction = () => {
  return [{ title: "MealMuse - Daily Menu" }, { name: "description", content: "Today's curated selection of dishes, crafted with care and precision." }];
};

export default function Index() {
  const dishesByCategory = recommendedDishes.reduce((acc: Record<Dish["category"], Dish[]>, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {} as Record<Dish["category"], Dish[]>);

  return (
    <MenuLayout>
      <MenuHeader />
      <MenuContent>
        {Object.entries(dishesByCategory).map(([category, dishes]) => (
          <MenuSection key={category} category={category as Dish["category"]}>
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </MenuSection>
        ))}
        <MenuFooter />
      </MenuContent>
    </MenuLayout>
  );
}

export const MenuLayout = memo(function Layout({ children }: PropsWithChildren<unknown>) {
  const isDark = useIsDark();
  return (
    <div
      className={cn("min-h-screen p-12", {
        "bg-slate-900": isDark,
        "bg-slate-50": !isDark,
      })}
    >
      <div
        className={cn("max-w-6xl mx-auto shadow-lg relative", {
          "bg-slate-800": isDark,
          "bg-white": !isDark,
        })}
      >
        {children}
      </div>
    </div>
  );
});

const MenuHeader = memo(function MenuHeader() {
  const isDark = useIsDark();
  return (
    <div
      className={cn("text-center pt-16", {
        "border-slate-700": isDark,
        "border-slate-200": !isDark,
      })}
    >
      <div className="flex flex-col items-center">
        {/* Main Title */}
        <h1 className="relative font-serif text-6xl font-medium tracking-wider mb-2">
          <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-sm tracking-[0.3em] font-light leading-none">ESTABLISHED 2024</span>
          <span className="relative font-serif">
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
        <div
          className={cn("text-sm tracking-[0.25em] font-light", {
            "text-slate-400": isDark,
            "text-slate-600": !isDark,
          })}
        >
          ARTISANAL CUISINE
        </div>
      </div>
    </div>
  );
});

const MenuContent = memo(function MenuContent({ children }: PropsWithChildren<unknown>) {
  return <div className="p-8 md:p-16 space-y-12">{children}</div>;
});

const MenuSection = memo(function MenuSection({ category, children }: PropsWithChildren<{ category: Dish["category"] }>) {
  const isDark = useIsDark();
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div
          className={cn("h-px flex-1", {
            "bg-slate-700": isDark,
            "bg-slate-200": !isDark,
          })}
        />
        <h2
          className={cn("font-serif text-2xl tracking-[0.15em] text-center font-medium", {
            "text-slate-200": isDark,
            "text-slate-800": !isDark,
          })}
        >
          {category.toUpperCase()}
        </h2>
        <div
          className={cn("h-px flex-1", {
            "bg-slate-700": isDark,
            "bg-slate-200": !isDark,
          })}
        />
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
});

const DishCard = memo(function DishCard({ dish }: { dish: Dish }) {
  const isDark = useIsDark();
  return (
    <article key={dish.title} className="group relative overflow-hidden">
      {/* Background Container */}
      <div className="absolute inset-0 z-0 flex">
        {/* Content Area (Left 60%) */}
        <div className={`w-[60%] ${isDark ? "bg-slate-800" : "bg-white"}`} />

        {/* Image Area (Right 40%) */}
        <div className="relative w-[40%] overflow-hidden">
          {/* Image Container - groups image and gradient together */}
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${dish.images[0]})` }} />
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-r from-slate-800 to-transparent" : "bg-gradient-to-r from-white via-white/65 to-transparent"}`} />
          </div>
        </div>
      </div>

      {/* Content */}
      <Link to={`/dishes/${dish.id}`}>
        <div className="relative z-10 p-6">
          <div className="flex justify-between items-start gap-4">
            <div className={`flex-1 ${isDark ? "border-slate-600" : "border-slate-300"}`}>
              {/* Title and Price Row */}
              <div className="flex justify-between mb-2">
                <h3 className={`font-serif text-xl font-medium ${isDark ? "text-slate-300 group-hover:text-white" : "text-slate-700 group-hover:text-slate-900"}`}>{dish.title}</h3>
                {/* <div className={`font-serif text-xl font-medium ${isDark ? "text-amber-400" : "text-amber-600"}`}>{dish.price}</div> */}
              </div>

              {/* Description */}
              <p className={`text-sm mb-3 font-light leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>{dish.description}</p>

              {/* Tags and Allergens */}
              <div className="flex flex-wrap gap-2 mb-3">
                {dish.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-2 py-0.5 rounded-full backdrop-blur-sm ${isDark ? "bg-slate-700/80 text-slate-300" : "bg-slate-100/80 text-slate-600"}`}>
                    {tag}
                  </span>
                ))}
                {dish.allergens?.map((allergen) => (
                  <span key={allergen} className={`text-xs px-2 py-0.5 rounded-full backdrop-blur-sm ${isDark ? "bg-rose-900/30 text-rose-300" : "bg-rose-50/80 text-rose-600"}`}>
                    {allergen}
                  </span>
                ))}
              </div>

              {/* Metrics Row */}
              <div className="flex flex-wrap gap-4 mb-2 text-sm font-light">
                {/* Difficulty */}
                <span
                  className={`
            px-2 py-0.5 rounded text-xs backdrop-blur-sm
            ${dish.difficulty === "Beginner" ? (isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100/80 text-emerald-700") : dish.difficulty === "Intermediate" ? (isDark ? "bg-amber-900/50 text-amber-400" : "bg-amber-100/80 text-amber-700") : isDark ? "bg-rose-900/50 text-rose-400" : "bg-rose-100/80 text-rose-700"}
          `}
                >
                  {dish.difficulty}
                </span>

                {/* Other Metrics */}
                <div className="flex gap-4">
                  {[
                    { icon: <GoClock className="w-4 h-4" />, value: dish.time },
                    { icon: <FaGripfire className="w-4 h-4" />, value: `${dish.calories} kcal` },
                    { icon: <TiStarFullOutline className="w-4 h-4" />, value: `${dish.ingredientsCount} items` },
                    { icon: <FaUsers className="w-4 h-4" />, value: dish.servingSize },
                  ].map(({ icon, value }, index) => (
                    <span key={index} className={`flex items-center gap-1 backdrop-blur-sm px-2 py-0.5 rounded ${isDark ? "bg-slate-800/50 text-slate-400" : "bg-white/50 text-slate-500"}`}>
                      {icon}
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
});

const MenuFooter = memo(function MenuFooter() {
  const isDark = useIsDark();
  return (
    <div
      className={cn("mt-16z pt-8 border-t", {
        "border-slate-700": isDark,
        "border-slate-200": !isDark,
      })}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h3
          className={cn("font-serif text-2xl mb-4 font-medium", {
            "text-slate-200": isDark,
            "text-slate-800": !isDark,
          })}
        >
          CHEF&apos;S NOTE
        </h3>
        <p
          className={cn("text-sm leading-relaxed font-light", {
            "text-slate-400": isDark,
            "text-slate-600": !isDark,
          })}
        >
          Our menu changes daily based on seasonal ingredients and chef's inspiration. Each dish is crafted with care, considering dietary preferences and cooking expertise. Enjoy your culinary journey!
        </p>
      </div>
    </div>
  );
});
