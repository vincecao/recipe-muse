import { Link } from "@remix-run/react";
import { memo } from "react";
import { FaGripfire, FaUsers } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { TiStarFullOutline } from "react-icons/ti";
import type { Dish } from "~/core/dish";

interface DishCardProps {
  dish: Dish;
  isDark: boolean;
}

const DishCard = ({ dish, isDark }: DishCardProps) => {
  return (
    <article key={dish.title} className="group">
      <Link to={`/dishes/${dish.id}`} className="block hover:opacity-90 transition-opacity">
        <div className="flex justify-between items-start gap-4">
          <div className={`flex-1 border-dotted ${isDark ? "border-slate-600" : "border-slate-300"}`}>
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
      </Link>
    </article>
  );
};

export default memo(DishCard);
