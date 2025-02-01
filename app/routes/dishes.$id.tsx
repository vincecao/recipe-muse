import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDishById } from "~/data/dish";
import { FaGripfire, FaUsers } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { TiStarFullOutline } from "react-icons/ti";
import { useIsDark } from "~/core/useIsDark";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const dish = await getDishById(params.id!);
  if (!dish) throw new Response("Not Found", { status: 404 });
  return Response.json({ dish });
};

export default function DishDetailPage() {
  const isDark = useIsDark();
  const { dish } = useLoaderData<typeof loader>();

  return (
    <div className={`min-h-screen p-8 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}>
      <div className="max-w-4xl mx-auto relative">
        {/* Back Button */}

        {/* Header Section */}
        <div className="mb-8 pt-10">
          <h1 className={`text-4xl font-serif mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>{dish.title}</h1>
          <div className={`text-2xl font-serif ${isDark ? "text-amber-400" : "text-amber-600"}`}>{dish.price}</div>
        </div>

        {/* Image and Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <img src={dish.images[0]} alt={dish.title} className={`rounded-xl w-full h-96 object-cover ${isDark ? "border-2 border-slate-700" : "border border-slate-200"}`} />

          {/* Details Column */}
          <div className="space-y-6">
            {/* Description */}
            <p className={`text-lg ${isDark ? "text-slate-300" : "text-slate-600"}`}>{dish.description}</p>

            {/* Tags & Allergens */}
            <div className="flex flex-wrap gap-2">
              {dish.tags.map((tag) => (
                <span key={tag} className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                  {tag}
                </span>
              ))}
              {dish.allergens?.map((allergen) => (
                <span key={allergen} className={`px-3 py-1 rounded-full text-sm ${isDark ? "bg-rose-900/30 text-rose-300" : "bg-rose-50 text-rose-600"}`}>
                  {allergen}
                </span>
              ))}
            </div>

            {/* Difficulty Badge */}
            <div className="mt-4">
              <span
                className={`
                px-4 py-2 rounded-lg text-sm font-medium
                ${dish.difficulty === "Beginner" ? (isDark ? "bg-emerald-900/50 text-emerald-400" : "bg-emerald-100 text-emerald-700") : dish.difficulty === "Intermediate" ? (isDark ? "bg-amber-900/50 text-amber-400" : "bg-amber-100 text-amber-700") : isDark ? "bg-rose-900/50 text-rose-400" : "bg-rose-100 text-rose-700"}
              `}
              >
                {dish.difficulty} Level
              </span>
            </div>

            {/* Metrics Grid */}
            <div className={`grid grid-cols-2 gap-4 py-4 ${isDark ? "border-t border-slate-700" : "border-t border-slate-200"}`}>
              <div className={`flex items-center gap-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                <GoClock className="w-6 h-6" />
                <div>
                  <div className="text-sm">Prep Time</div>
                  <div className="font-medium">{dish.time}</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                <FaGripfire className="w-6 h-6" />
                <div>
                  <div className="text-sm">Calories</div>
                  <div className="font-medium">{dish.calories} kcal</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                <TiStarFullOutline className="w-6 h-6" />
                <div>
                  <div className="text-sm">Ingredients</div>
                  <div className="font-medium">{dish.ingredientsCount} items</div>
                </div>
              </div>
              <div className={`flex items-center gap-3 ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                <FaUsers className="w-6 h-6" />
                <div>
                  <div className="text-sm">Serves</div>
                  <div className="font-medium">{dish.servingSize}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
