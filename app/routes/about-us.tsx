import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { MenuLayout } from "./_index";
import { useIsDark } from "~/core/useIsDark";
import { GiCookingPot, GiMeal, GiSpoon } from "react-icons/gi";
import { MdOutlineTimer, MdRestaurantMenu } from "react-icons/md";
import cn from "classnames";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return Response.json({});
};

export default function AboutUsPage() {
  const isDark = useIsDark();
  
  return (
    <MenuLayout>
      <div className="relative max-w-4xl mx-auto p-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className={cn(
            "font-serif text-4xl md:text-5xl font-medium",
            isDark ? "text-slate-200" : "text-slate-800"
          )}>
            Revolutionizing Meal Planning
          </h1>
          <p className={cn(
            "text-lg max-w-2xl mx-auto",
            isDark ? "text-slate-400" : "text-slate-600"
          )}>
            Never wonder "what's for dinner" again. Our AI-powered platform creates personalized recipes based on your preferences, pantry items, and cooking skill level.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: <GiCookingPot className="w-8 h-8" />,
              title: "Smart Recipe Generation",
              description: "Tell us your dietary needs, available ingredients, and desired cuisine type - we'll handle the rest"
            },
            {
              icon: <MdOutlineTimer className="w-8 h-8" />,
              title: "Interactive Cooking",
              description: "Step-by-step instructions with built-in timers and progress tracking"
            },
            {
              icon: <GiMeal className="w-8 h-8" />,
              title: "Meal Recommendations",
              description: "Daily suggestions based on time of day, seasonality, and your cooking history"
            },
            {
              icon: <MdRestaurantMenu className="w-8 h-8" />,
              title: "Visual Inspiration",
              description: "Automatically sourced food photography to help you visualize each dish"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className={cn(
                "p-6 rounded-xl backdrop-blur-sm border",
                isDark 
                  ? "bg-slate-800/50 border-slate-700" 
                  : "bg-white/50 border-slate-200"
              )}
            >
              <div className="flex items-center gap-4 mb-4">
                <span className={isDark ? "text-amber-400" : "text-amber-600"}>
                  {feature.icon}
                </span>
                <h3 className={cn(
                  "text-xl font-medium",
                  isDark ? "text-slate-200" : "text-slate-800"
                )}>
                  {feature.title}
                </h3>
              </div>
              <p className={cn(
                "text-sm leading-relaxed",
                isDark ? "text-slate-400" : "text-slate-600"
              )}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <GiSpoon className="mx-auto w-12 h-12 text-amber-500" />
          <Link
            to="/"
            className={cn(
              "inline-block px-8 py-3 rounded-full font-medium transition-all",
              isDark 
                ? "bg-amber-500 text-slate-900 hover:bg-amber-400" 
                : "bg-amber-600 text-white hover:bg-amber-500"
            )}
          >
            Start Your Culinary Journey
          </Link>
        </div>
      </div>
    </MenuLayout>
  );
}
