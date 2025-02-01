import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDishById } from "~/data/dish";
import { FaGripfire, FaUsers } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { TiStarFullOutline } from "react-icons/ti";
import { useIsDark } from "~/core/useIsDark";
import { MenuLayout } from "./_index";
import cn from "classnames";
import { Dish } from "~/core/dish";
import { memo, PropsWithChildren } from "react";

type LoaderData = {
  dish: Dish;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const dish = await getDishById(params.id!);
  if (!dish) throw new Response("Not Found", { status: 404 });
  return Response.json({ dish });
};

export default function DishDetailPage() {
  const { dish } = useLoaderData<LoaderData>();

  return (
    <MenuLayout>
      {/* Hero Section */}
      <DishHero heroImgSrc={dish.images[0]}>
        <DishHeroDetail dish={dish} />
      </DishHero>

      {/* Additional content can go here */}
      <DishDetail />
    </MenuLayout>
  );
}

const DishHero = memo(function DishHero({ heroImgSrc, children }: PropsWithChildren<{ heroImgSrc: string }>) {
  const isDark = useIsDark();
  return (
    <div className="relative h-[70vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroImgSrc})` }} />

      {/* Gradient Overlay */}
      <div
        className={cn("absolute inset-0 bg-gradient-to-b from-transparent", {
          "via-slate-900/40 to-slate-900": isDark,
          "via-slate-50/50 to-slate-50": !isDark,
        })}
      />

      {children}
    </div>
  );
});

const DishHeroDetail = memo(function DishHeroDetail({ dish }: { dish: Dish }) {
  const isDark = useIsDark();
  return (
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <div
        className={cn("max-w-4xl mx-auto backdrop-blur-md rounded-2xl p-8", {
          "bg-slate-800/70 border border-white/10": isDark,
          "bg-white/20 border border-black/5": !isDark,
        })}
      >
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1
              className={cn("text-4xl font-serif font-medium mb-2", {
                "text-white": isDark,
                "text-slate-900": !isDark,
              })}
            >
              {dish.title}
            </h1>
            <p
              className={cn("text-lg font-light max-w-2xl", {
                "text-slate-300": isDark,
                "text-slate-700": !isDark,
              })}
            >
              {dish.description}
            </p>
          </div>

          {/* Difficulty Badge */}
          <div>
            <span
              className={cn("px-4 py-1.5 rounded-full text-sm font-medium", {
                // Beginner
                "bg-emerald-900/30 text-emerald-300": isDark && dish.difficulty === "Beginner",
                "bg-emerald-100/80 text-emerald-700": !isDark && dish.difficulty === "Beginner",
                // Intermediate
                "bg-amber-900/30 text-amber-300": isDark && dish.difficulty === "Intermediate",
                "bg-amber-100/80 text-amber-700": !isDark && dish.difficulty === "Intermediate",
                // Advanced
                "bg-rose-900/30 text-rose-300": isDark && dish.difficulty === "Advanced",
                "bg-rose-100/80 text-rose-700": !isDark && dish.difficulty === "Advanced",
              })}
            >
              {dish.difficulty} Level
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: <GoClock />, label: "Prep Time", value: dish.time },
            { icon: <FaGripfire />, label: "Calories", value: `${dish.calories} kcal` },
            { icon: <TiStarFullOutline />, label: "Ingredients", value: `${dish.ingredientsCount} items` },
            { icon: <FaUsers />, label: "Serving", value: dish.servingSize },
          ].map((metric, index) => (
            <div
              key={index}
              className={cn("flex items-center gap-3 p-3 rounded-xl", {
                "bg-slate-800/80 border border-white/5": isDark,
                "bg-white/80 border border-black/5": !isDark,
              })}
            >
              <div
                className={cn("text-xl", {
                  "text-amber-400": isDark,
                  "text-amber-600": !isDark,
                })}
              >
                {metric.icon}
              </div>
              <div>
                <div
                  className={cn("text-xs", {
                    "text-slate-400": isDark,
                    "text-slate-500": !isDark,
                  })}
                >
                  {metric.label}
                </div>
                <div
                  className={cn("font-medium", {
                    "text-slate-200": isDark,
                    "text-slate-800": !isDark,
                  })}
                >
                  {metric.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tags and Allergens Sections */}
        <div className="space-y-4">
          {/* Tags Section */}
          <div className="space-y-2">
            <h3
              className={cn("text-sm font-medium", {
                "text-slate-300": isDark,
                "text-slate-600": !isDark,
              })}
            >
              Features & Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {dish.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn("px-3 py-1 rounded-full text-sm flex items-center gap-1", {
                    "bg-slate-700/50 text-slate-300 hover:bg-slate-700/70": isDark,
                    "bg-slate-100/80 text-slate-700 hover:bg-slate-200/80": !isDark,
                  })}
                >
                  <span className="text-amber-400">•</span>
                  {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>
          </div>

          {/* Allergens Section */}
          {dish.allergens && dish.allergens.length > 0 && (
            <div className="space-y-2">
              <h3
                className={cn("text-sm font-medium flex items-center gap-2", {
                  "text-rose-300": isDark,
                  "text-rose-600": !isDark,
                })}
              >
                <span>⚠️</span>
                <span>Allergy Information</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {dish.allergens.map((allergen) => (
                  <span
                    key={allergen}
                    className={cn("px-3 py-1 rounded-full text-sm flex items-center gap-1", {
                      "bg-rose-900/30 text-rose-300 hover:bg-rose-900/40": isDark,
                      "bg-rose-100/80 text-rose-700 hover:bg-rose-200/80": !isDark,
                    })}
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

const DishDetail = memo(function DishDetail() {
  return <></>;
});
