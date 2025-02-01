import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getDishById } from "~/data/dish";
import { FaGripfire, FaUsers } from "react-icons/fa";
import { GoClock } from "react-icons/go";
import { TiStarFullOutline } from "react-icons/ti";
import { useIsDark } from "~/core/useIsDark";
import { MenuLayout } from "./_index";
import cn from "classnames";
import { Dish, sampleRecipe } from "~/core/dish";
import { memo, PropsWithChildren } from "react";
import type { RecipeInstruction, RecipeIngredient, Difficulty, Recipe } from "~/core/dish";
import { FiClock, FiThermometer, FiUsers, FiPackage, FiShoppingBag, FiList, FiTool, FiCheckCircle, FiFilm, FiInfo } from "react-icons/fi";

type LoaderData = {
  dish: Dish;
  recipe: Recipe;
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const dish = await getDishById(params.id!);
  if (!dish) throw new Response("Not Found", { status: 404 });
  return Response.json({ dish, recipe: sampleRecipe });
};

export default function DishDetailPage() {
  const { dish, recipe } = useLoaderData<LoaderData>();

  return (
    <MenuLayout>
      {/* Hero Section */}
      <DishHero heroImgSrc={dish.images[0]}>
        <DishHeroDetail dish={dish} />
      </DishHero>

      {/* Additional content can go here */}
      <RecipeDetail recipe={recipe} />
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

const DifficultyBadge = memo(function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const isDark = useIsDark();
  const difficultyStyles = {
    Beginner: cn("px-4 py-1.5 rounded-full text-sm font-medium", {
      "bg-emerald-900/30 text-emerald-300": isDark,
      "bg-emerald-100/80 text-emerald-700": !isDark,
    }),
    Intermediate: cn("px-4 py-1.5 rounded-full text-sm font-medium", {
      "bg-amber-900/30 text-amber-300": isDark,
      "bg-amber-100/80 text-amber-700": !isDark,
    }),
    Advanced: cn("px-4 py-1.5 rounded-full text-sm font-medium", {
      "bg-rose-900/30 text-rose-300": isDark,
      "bg-rose-100/80 text-rose-700": !isDark,
    }),
  };

  return <span className={difficultyStyles[difficulty]}>{difficulty} Level</span>;
});

const NutritionFacts = memo(function NutritionFacts({ calories, allergens }: { calories: number; allergens?: string[] }) {
  const isDark = useIsDark();
  return (
    <div
      className={cn("p-8 backdrop-blur-md rounded-2xl", {
        "bg-slate-800/70 border border-white/10": isDark,
        "bg-white/20 border border-black/5": !isDark,
      })}
    >
      <h3
        className={cn("text-2xl font-serif mb-6", {
          "text-white": isDark,
          "text-slate-900": !isDark,
        })}
      >
        Nutrition
      </h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span
          className={cn("text-4xl font-light", {
            "text-amber-400": isDark,
            "text-amber-600": !isDark,
          })}
        >
          {calories}
        </span>
        <span
          className={cn("text-sm", {
            "text-slate-400": isDark,
            "text-slate-500": !isDark,
          })}
        >
          calories per serving
        </span>
      </div>
      <div className="space-y-4">
        <h4
          className={cn("text-sm font-medium", {
            "text-rose-300": isDark,
            "text-rose-600": !isDark,
          })}
        >
          ⚠️ Allergy Information
        </h4>
        <div className="flex flex-wrap gap-2">
          {allergens?.length ? (
            allergens.map((allergen, index) => (
              <span
                key={index}
                className={cn("px-3 py-1 rounded-full text-sm", {
                  "bg-rose-900/30 text-rose-300 hover:bg-rose-900/40": isDark,
                  "bg-rose-100/80 text-rose-700 hover:bg-rose-200/80": !isDark,
                })}
              >
                {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
              </span>
            ))
          ) : (
            <span
              className={cn("text-sm", {
                "text-slate-400": isDark,
                "text-slate-500": !isDark,
              })}
            >
              None specified
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

const IngredientsList = memo(function IngredientsList({ ingredients }: { ingredients: RecipeIngredient[] }) {
  const isDark = useIsDark();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className={cn("flex items-center justify-between py-2.5 px-4 rounded-lg backdrop-blur-sm transition-colors", {
            "bg-slate-800/40 hover:bg-slate-800/60 border border-white/5": isDark,
            "bg-white/40 hover:bg-white/60 border border-black/5": !isDark,
          })}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={cn("w-1 h-4 rounded-full", {
                "bg-amber-400/30": isDark,
                "bg-amber-600/30": !isDark,
              })}
            />
            <div className="min-w-0 truncate">
              <span
                className={cn("font-medium", {
                  "text-slate-200": isDark,
                  "text-slate-800": !isDark,
                })}
              >
                {ingredient.name}
              </span>
              {ingredient.preparation && (
                <span
                  className={cn("text-sm ml-2", {
                    "text-slate-400": isDark,
                    "text-slate-500": !isDark,
                  })}
                >
                  · {ingredient.preparation}
                </span>
              )}
            </div>
          </div>
          <div
            className={cn("text-sm tabular-nums pl-3", {
              "text-slate-300": isDark,
              "text-slate-600": !isDark,
            })}
          >
            {ingredient.quantity}
            <span
              className={cn("text-xs ml-1", {
                "text-slate-400": isDark,
                "text-slate-500": !isDark,
              })}
            >
              {ingredient.unit}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
});

const InstructionsStepper = memo(function InstructionsStepper({ instructions }: { instructions: RecipeInstruction[] }) {
  const isDark = useIsDark();
  return (
    <div className="space-y-3">
      {instructions
        .sort((a, b) => a.order - b.order)
        .map((instruction) => (
          <div
            key={instruction.order}
            className={cn("relative pl-8", {
              "border-l border-white/5": isDark,
              "border-l border-black/5": !isDark,
            })}
          >
            {/* Step Number */}
            <div
              className={cn("absolute -left-2.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium", {
                "bg-amber-400/20 text-amber-300 border border-amber-400/30": isDark,
                "bg-amber-600/10 text-amber-700 border border-amber-600/30": !isDark,
              })}
            >
              {instruction.order}
            </div>

            <div className="space-y-2">
              {/* Description and Metadata Row */}
              <div className="flex items-start justify-between gap-4">
                <p
                  className={cn("text-base leading-relaxed pt-0.5", {
                    "text-slate-200": isDark,
                    "text-slate-800": !isDark,
                  })}
                >
                  {instruction.description}
                </p>

                {/* Compact Metadata */}
                <div className="flex flex-shrink-0 items-center gap-2 text-xs">
                  {instruction.duration && (
                    <span
                      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full", {
                        "bg-slate-800/60 text-slate-300": isDark,
                        "bg-slate-100/80 text-slate-600": !isDark,
                      })}
                    >
                      <FiClock className="w-3 h-3" />
                      {instruction.duration}m
                    </span>
                  )}
                  {instruction.temperature && (
                    <span
                      className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full", {
                        "bg-rose-900/30 text-rose-300": isDark,
                        "bg-rose-100/80 text-rose-700": !isDark,
                      })}
                    >
                      <FiThermometer className="w-3 h-3" />
                      {instruction.temperature.value}°{instruction.temperature.unit}
                    </span>
                  )}
                </div>
              </div>

              {/* Tools and Ingredients Row */}
              {(instruction.toolsNeeded?.length || instruction.ingredientsUsed?.length) && (
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {instruction.toolsNeeded?.map((tool) => (
                    <span
                      key={tool}
                      className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded", {
                        "bg-slate-800/40 text-slate-300": isDark,
                        "bg-slate-100/80 text-slate-600": !isDark,
                      })}
                    >
                      <FiTool className="w-3 h-3" />
                      {tool}
                    </span>
                  ))}
                  {instruction.ingredientsUsed?.map((ingredient) => (
                    <span
                      key={ingredient}
                      className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded", {
                        "bg-emerald-900/20 text-emerald-300": isDark,
                        "bg-emerald-100/80 text-emerald-700": !isDark,
                      })}
                    >
                      <FiPackage className="w-3 h-3" />
                      {ingredient}
                    </span>
                  ))}
                </div>
              )}

              {/* Tips - Inline */}
              {instruction.tips && (
                <div
                  className={cn("text-xs px-2 py-1 rounded flex items-start gap-1.5", {
                    "bg-amber-900/20 text-amber-200": isDark,
                    "bg-amber-50/80 text-amber-800": !isDark,
                  })}
                >
                  <FiInfo className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  {instruction.tips}
                </div>
              )}

              {/* Images - Single Row */}
              {instruction.images && instruction.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
                  {instruction.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={cn("relative w-24 h-24 flex-shrink-0 rounded overflow-hidden", {
                        "border border-white/5": isDark,
                        "border border-black/5": !isDark,
                      })}
                    >
                      <img src={img} alt={`Step ${instruction.order}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
});

const RecipeDetail = memo(function DishDetail({ recipe }: { recipe: Recipe }) {
  const isDark = useIsDark();
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Header Section */}
      <header className="space-y-8 text-center">
        {/* Category and Type */}
        <div className="flex justify-center gap-3">
          <span
            className={cn("px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md", {
              "bg-amber-900/30 text-amber-300": isDark,
              "bg-amber-100/80 text-amber-700": !isDark,
            })}
          >
            {recipe.category} {/* e.g., "Main Course", "Dessert" */}
          </span>
          <span
            className={cn("px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md", {
              "bg-slate-800/80 text-slate-300": isDark,
              "bg-white/80 text-slate-700": !isDark,
            })}
          >
            {recipe.cuisine} {/* e.g., "Italian", "Japanese" */}
          </span>
        </div>

        <h1
          className={cn("text-5xl font-serif mb-6", {
            "text-white": isDark,
            "text-slate-900": !isDark,
          })}
        >
          {recipe.title}
        </h1>

        {/* Required Equipment */}
        {recipe.tools && (
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {recipe.tools.map((tool, index) => (
              <span
                key={index}
                className={cn("px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 backdrop-blur-sm", {
                  "bg-slate-800/60 text-slate-300 border border-white/5": isDark,
                  "bg-white/60 text-slate-700 border border-black/5": !isDark,
                })}
              >
                <FiTool
                  className={cn("w-3.5 h-3.5", {
                    "text-amber-400": isDark,
                    "text-amber-600": !isDark,
                  })}
                />
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Key Info */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <DifficultyBadge difficulty={recipe.difficulty} />
            <span
              className={cn("flex items-center gap-2 text-lg", {
                "text-slate-300": isDark,
                "text-slate-600": !isDark,
              })}
            >
              <FiClock className="w-5 h-5" />
              Total: {recipe.time}
              <span
                className={cn("text-sm", {
                  "text-slate-400": isDark,
                  "text-slate-500": !isDark,
                })}
              >
                ({recipe.prepTime}m prep + {recipe.cookTime}m cooking)
              </span>
            </span>
            <span
              className={cn("flex items-center gap-2 text-lg", {
                "text-slate-300": isDark,
                "text-slate-600": !isDark,
              })}
            >
              <FiUsers className="w-5 h-5" />
              Serves {recipe.servingSize}
            </span>
          </div>
          <p
            className={cn("text-xl font-light max-w-3xl mx-auto leading-relaxed", {
              "text-slate-300": isDark,
              "text-slate-700": !isDark,
            })}
          >
            {recipe.description}
          </p>
        </div>
      </header>

      {/* Image Gallery - Only show if valid images exist */}
      {recipe.images?.length > 0 && (
        <div>
          {(() => {
            // Filter out invalid image URLs first
            const validImages = recipe.images.filter(img => 
              img && 
              (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/'))
            );

            if (validImages.length === 0) return null;

            return (
              <div className={cn(
                "grid gap-6",
                {
                  "grid-cols-1": validImages.length === 1,
                  "grid-cols-1 md:grid-cols-2": validImages.length === 2,
                  "grid-cols-1 md:grid-cols-3": validImages.length === 3,
                  "grid-cols-2 md:grid-cols-4": validImages.length === 4,
                  "grid-cols-2 md:grid-cols-3": validImages.length > 4,
                }
              )}>
                {validImages.slice(0, 6).map((img, index) => {
                  const isSingleImage = validImages.length === 1;
                  const isFirstOfMany = validImages.length > 4 && index === 0;

                  return (
                    <div
                      key={index}
                      className={cn(
                        "relative group overflow-hidden rounded-2xl border transition-transform duration-300 hover:scale-[1.02]",
                        {
                          "border-white/10": isDark,
                          "border-black/5": !isDark,
                          "col-span-1 md:col-span-2 aspect-video": isSingleImage,
                          "col-span-2 aspect-video": isFirstOfMany,
                          "aspect-square": !isSingleImage && !isFirstOfMany,
                        }
                      )}
                    >
                      <img
                        src={img}
                        alt={`${recipe.title} preparation ${index + 1}`}
                        className={cn(
                          "object-cover w-full h-full",
                          "transition-transform duration-500 group-hover:scale-105"
                        )}
                        loading={index === 0 ? "eager" : "lazy"}
                        onError={(e) => {
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            // Remove the element from DOM instead of just hiding it
                            parent.remove();
                            // Recheck grid layout if needed
                            const gallery = parent.parentElement;
                            if (gallery && gallery.children.length === 0) {
                              gallery.remove();
                            }
                          }
                        }}
                      />
                      <div
                        className={cn(
                          "absolute inset-0 transition-opacity duration-300",
                          {
                            "bg-gradient-to-t from-slate-900/40 via-transparent to-transparent": isDark,
                            "bg-gradient-to-t from-slate-50/40 via-transparent to-transparent": !isDark,
                          }
                        )}
                      />
                      {index === 5 && validImages.length > 6 && (
                        <div className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          "bg-black/50 backdrop-blur-sm",
                          "text-white text-lg font-medium"
                        )}>
                          +{validImages.length - 6} more
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-8">
        <NutritionFacts calories={recipe.calories} allergens={recipe.allergens} />

        <div
          className={cn("p-8 backdrop-blur-md rounded-2xl", {
            "bg-slate-800/70 border border-white/10": isDark,
            "bg-white/20 border border-black/5": !isDark,
          })}
        >
          <h3
            className={cn("text-2xl font-serif mb-6", {
              "text-white": isDark,
              "text-slate-900": !isDark,
            })}
          >
            Ingredients Overview
          </h3>
          <div className="flex items-center gap-4 mb-6">
            <div
              className={cn("p-4 rounded-xl", {
                "bg-amber-900/30": isDark,
                "bg-amber-100/80": !isDark,
              })}
            >
              <FiPackage
                className={cn("w-8 h-8", {
                  "text-amber-300": isDark,
                  "text-amber-700": !isDark,
                })}
              />
            </div>
            <div>
              <span
                className={cn("text-4xl font-light", {
                  "text-white": isDark,
                  "text-slate-900": !isDark,
                })}
              >
                {recipe.ingredientsCount}
              </span>
              <span
                className={cn("text-sm ml-2", {
                  "text-slate-400": isDark,
                  "text-slate-500": !isDark,
                })}
              >
                ingredients needed
              </span>
            </div>
          </div>
          <p
            className={cn("text-sm", {
              "text-slate-400": isDark,
              "text-slate-500": !isDark,
            })}
          >
            Some ingredients have substitutes available
          </p>
        </div>

        <div
          className={cn("p-8 backdrop-blur-md rounded-2xl", {
            "bg-slate-800/70 border border-white/10": isDark,
            "bg-white/20 border border-black/5": !isDark,
          })}
        >
          <h3
            className={cn("text-2xl font-serif mb-6", {
              "text-white": isDark,
              "text-slate-900": !isDark,
            })}
          >
            Estimated Cost
          </h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span
              className={cn("text-4xl font-light", {
                "text-amber-400": isDark,
                "text-amber-600": !isDark,
              })}
            >
              {recipe.price}
            </span>
            <span
              className={cn("text-sm", {
                "text-slate-400": isDark,
                "text-slate-500": !isDark,
              })}
            >
              per portion
            </span>
          </div>
          <p
            className={cn("text-sm", {
              "text-slate-400": isDark,
              "text-slate-500": !isDark,
            })}
          >
            Prices may vary by location and season
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-16">
        <section className="space-y-8">
          <h2
            className={cn("text-3xl font-serif flex items-center gap-4", {
              "text-white": isDark,
              "text-slate-900": !isDark,
            })}
          >
            <span
              className={cn("w-8 h-8", {
                "text-amber-400": isDark,
                "text-amber-600": !isDark,
              })}
            >
              <FiShoppingBag className="w-full h-full" />
            </span>
            Ingredients List
          </h2>
          <IngredientsList ingredients={recipe.ingredients} />
        </section>

        <section className="space-y-8">
          <h2
            className={cn("text-3xl font-serif flex items-center gap-4", {
              "text-white": isDark,
              "text-slate-900": !isDark,
            })}
          >
            <span
              className={cn("w-8 h-8", {
                "text-amber-400": isDark,
                "text-amber-600": !isDark,
              })}
            >
              <FiList className="w-full h-full" />
            </span>
            Step-by-Step Instructions
          </h2>
          <InstructionsStepper instructions={recipe.instructions} />
        </section>

        {recipe.videoUrl && (
          <section className="space-y-8">
            <h2
              className={cn("text-3xl font-serif flex items-center gap-4", {
                "text-white": isDark,
                "text-slate-900": !isDark,
              })}
            >
              <span
                className={cn("w-8 h-8", {
                  "text-amber-400": isDark,
                  "text-amber-600": !isDark,
                })}
              >
                <FiFilm className="w-full h-full" />
              </span>
              Video Guide
            </h2>
            <div
              className={cn("aspect-video rounded-2xl overflow-hidden", {
                "bg-slate-800/80 border border-white/5": isDark,
                "bg-white/80 border border-black/5": !isDark,
              })}
            >
              <iframe src={recipe.videoUrl} className="w-full h-full" allowFullScreen title={`How to make ${recipe.title}`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          </section>
        )}
      </div>
    </div>
  );
});
