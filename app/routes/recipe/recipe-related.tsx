import { memo } from 'react';
import {
  FiClock,
  FiThermometer,
  FiTool,
  FiPackage,
  FiInfo,
  FiFilm,
  FiList,
  FiShoppingBag,
  FiUsers,
} from 'react-icons/fi';
import { DbRecipe, Recipe, RecipeIngredient, RecipeInstruction } from '~/core/type';
import cn from 'classnames';

const NutritionFacts = memo(function NutritionFacts({
  calories,
  allergens,
}: {
  calories: number;
  allergens?: string[];
}) {
  return (
    <div className="p-8 backdrop-blur-md rounded-2xl bg-white/20 border border-black/5 dark:bg-slate-800/70 dark:border-white/10">
      <h3 className="text-2xl font-serif mb-6 text-slate-900 dark:text-white">Nutrition</h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-light text-amber-600 dark:text-amber-400">{calories}</span>
        <span className="text-sm text-slate-500 dark:text-slate-400">calories per serving</span>
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-rose-600 dark:text-rose-300">⚠️ Allergy Information</h4>
        <div className="flex flex-wrap gap-2">
          {allergens?.length ? (
            allergens.map((allergen, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm bg-rose-100/80 text-rose-700 hover:bg-rose-200/80 dark:bg-rose-900/30 dark:text-rose-300 dark:hover:bg-rose-900/40"
              >
                {allergen.charAt(0).toUpperCase() + allergen.slice(1)}
              </span>
            ))
          ) : (
            <span className="text-sm text-slate-500 dark:text-slate-400">None specified</span>
          )}
        </div>
      </div>
    </div>
  );
});

const IngredientsList = memo(function IngredientsList({ ingredients }: { ingredients: RecipeIngredient[] }) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:gap-2">
      {ingredients.map((ingredient, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-1.5 px-3 sm:py-2.5 sm:px-4 rounded-lg backdrop-blur-sm bg-white/40 hover:bg-white/60 border border-black/5 dark:bg-slate-800/40 dark:hover:bg-slate-800/60 dark:border-white/5"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-1 h-4 rounded-full bg-amber-600/30 dark:bg-amber-400/30" />
            <div className="min-w-0 truncate">
              <span className="font-medium text-slate-800 dark:text-slate-200">{ingredient.name}</span>
              {ingredient.preparation && (
                <span className="text-sm ml-2 text-slate-500 dark:text-slate-400">· {ingredient.preparation}</span>
              )}
            </div>
          </div>
          <div className="text-sm tabular-nums pl-3 text-slate-600 dark:text-slate-300">
            {ingredient.quantity}
            <span className="text-xs ml-1 text-slate-500 dark:text-slate-400">{ingredient.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
});

const InstructionsStepper = memo(function InstructionsStepper({ instructions }: { instructions: RecipeInstruction[] }) {
  return (
    <div className="space-y-2 sm:space-y-3">
      {instructions
        .sort((a, b) => a.order - b.order)
        .map((instruction) => (
          <div key={instruction.order} className="relative pl-6 sm:pl-8 border-l border-black/5 dark:border-white/5">
            {/* Step Number */}
            <div className="absolute left-0 top-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs bg-amber-600/10 text-amber-700 border border-amber-600/30 dark:bg-amber-400/20 dark:text-amber-300 dark:border-amber-400/30">
              {instruction.order}
            </div>

            <div className="space-y-2">
              {/* Description and Metadata Row */}
              <div className="flex items-start justify-between gap-4">
                <p className="text-base leading-relaxed pt-0.5 text-slate-800 dark:text-slate-200">
                  {instruction.description}
                </p>

                {/* Compact Metadata */}
                <div className="flex flex-shrink-0 items-center gap-2 text-xs">
                  {instruction.duration && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100/80 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                      <FiClock className="w-3 h-3" />
                      {instruction.duration}m
                    </span>
                  )}
                  {instruction.temperature && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
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
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100/80 text-slate-600 dark:bg-slate-800/40 dark:text-slate-300"
                    >
                      <FiTool className="w-3 h-3" />
                      {tool}
                    </span>
                  ))}
                  {instruction.ingredientsUsed?.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                    >
                      <FiPackage className="w-3 h-3" />
                      {ingredient}
                    </span>
                  ))}
                </div>
              )}

              {/* Tips - Inline */}
              {instruction.tips && (
                <div className="text-xs px-2 py-1 rounded flex items-start gap-1.5 bg-amber-50/80 text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
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
                      className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden border border-black/5 dark:border-white/5"
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

export const RecipeDetail = memo(function DishDetail({
  recipe,
  images,
}: {
  recipe: Recipe;
  images: DbRecipe['images'];
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
      {/* Header Section */}
      <header className="space-y-8 text-center">
        {/* Category and Type */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm font-medium backdrop-blur-md bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
            {recipe.category}
          </span>
          <span className="px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm font-medium backdrop-blur-md bg-white/80 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300">
            {recipe.cuisine.join(', ')}
          </span>
        </div>

        <h1 className="text-5xl font-serif mb-6 text-slate-900 dark:text-white">{recipe.title}</h1>

        {/* Required Equipment */}
        {recipe.tools && (
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {recipe.tools.map((tool, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 backdrop-blur-sm bg-white/60 text-slate-700 border border-black/5 dark:bg-slate-800/60 dark:text-slate-300 dark:border-white/5"
              >
                <FiTool className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {tool}
              </span>
            ))}
          </div>
        )}

        {/* Key Info */}
        <div className="flex flex-col items-center gap-6">
          {/* Metadata Row */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 bg-opacity-50 backdrop-blur-sm rounded-2xl p-4 border border-black/5 dark:border-white/10 transition-colors duration-300">
            {/* Difficulty Level */}
            <div className="text-center">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium
                ${
                  recipe.difficulty === 'Beginner'
                    ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : ''
                }
                ${
                  recipe.difficulty === 'Intermediate'
                    ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : ''
                }
                ${
                  recipe.difficulty === 'Advanced'
                    ? 'bg-rose-100/80 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                    : ''
                }`}
              >
                {recipe.difficulty} Level
              </span>
            </div>

            {/* Time Info */}
            <div className="text-center">
              <FiClock className="w-6 h-6 mx-auto mb-1 text-amber-600 dark:text-amber-400" />
              <p className="font-serif text-base text-slate-800 dark:text-slate-100">
                {recipe.prepTime + recipe.cookTime}m Total
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ({recipe.prepTime}m prep + {recipe.cookTime}m cook)
              </p>
            </div>

            {/* Serving Size */}
            <div className="text-center">
              <FiUsers className="w-6 h-6 mx-auto mb-1 text-amber-600 dark:text-amber-400" />
              <p className="font-serif text-base text-slate-800 dark:text-slate-100">
                Serves {recipe.servingSize.replace('For ', '')}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-center font-serif text-xl italic text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
            &quot;{recipe.description}&quot;
          </p>
        </div>
      </header>

      {/* Image Gallery - Only show if valid images exist */}
      {images?.length > 0 && (
        <div>
          {(() => {
            // Filter out invalid image URLs first
            const validImages = images.filter(
              (img) => img && (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/')),
            );

            if (validImages.length === 0) return null;

            return (
              <div
                className={cn('grid gap-6', {
                  'grid-cols-1': validImages.length === 1,
                  'grid-cols-1 md:grid-cols-2': validImages.length === 2,
                  'grid-cols-1 md:grid-cols-3': validImages.length === 3,
                  'grid-cols-2 md:grid-cols-4': validImages.length === 4,
                  'grid-cols-2 md:grid-cols-3': validImages.length > 4,
                })}
              >
                {validImages.slice(0, 6).map((img, index) => {
                  const isSingleImage = validImages.length === 1;
                  const isFirstOfMany = validImages.length > 4 && index === 0;

                  return (
                    <div
                      key={index}
                      className={cn(
                        'relative group overflow-hidden rounded-2xl border transition-transform duration-300 hover:scale-[1.02]',
                        {
                          'border-black/5 dark:border-white/10': true,
                          'col-span-1 md:col-span-2 aspect-video': isSingleImage,
                          'col-span-2 aspect-video': isFirstOfMany,
                          'aspect-square': !isSingleImage && !isFirstOfMany,
                        },
                      )}
                    >
                      <img
                        src={img}
                        alt={`${recipe.title} preparation ${index + 1}`}
                        className={cn(
                          'object-cover w-full h-full',
                          'transition-transform duration-500 group-hover:scale-105',
                        )}
                        loading={index === 0 ? 'eager' : 'lazy'}
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
                      <div className="absolute inset-0 transition-opacity duration-300 bg-gradient-to-t from-slate-50/40 via-transparent to-transparent dark:from-slate-900/40" />
                      {index === 5 && validImages.length > 6 && (
                        <div
                          className={cn(
                            'absolute inset-0 flex items-center justify-center',
                            'bg-black/50 backdrop-blur-sm',
                            'text-white text-lg font-medium',
                          )}
                        >
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
      <div className="grid md:grid-cols-2 gap-8">
        <NutritionFacts calories={recipe.calories} allergens={recipe.allergens} />

        <div className="p-8 backdrop-blur-md rounded-2xl bg-white/20 border border-black/5 dark:bg-slate-800/70 dark:border-white/10">
          <h3 className="text-2xl font-serif mb-6 text-slate-900 dark:text-white">Ingredients Overview</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 rounded-xl bg-amber-100/80 dark:bg-amber-900/30">
              <FiPackage className="w-8 h-8 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <span className="text-4xl font-light text-slate-900 dark:text-white">{recipe.ingredientsCount}</span>
              <span className="text-sm ml-2 text-slate-500 dark:text-slate-400">ingredients needed</span>
            </div>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Some ingredients have substitutes available</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-16">
        <section className="space-y-8">
          <h2 className="text-3xl font-serif flex items-center gap-4 text-slate-900 dark:text-white">
            <span className="w-8 h-8 text-amber-600 dark:text-amber-400">
              <FiShoppingBag className="w-full h-full" />
            </span>
            Ingredients List
          </h2>
          <IngredientsList ingredients={recipe.ingredients} />
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl font-serif flex items-center gap-4 text-slate-900 dark:text-white">
            <span className="w-8 h-8 text-amber-600 dark:text-amber-400">
              <FiList className="w-full h-full" />
            </span>
            Step-by-Step Instructions
          </h2>
          <InstructionsStepper instructions={recipe.instructions} />
        </section>

        {recipe.videoUrl && (
          <section className="space-y-8">
            <h2 className="text-3xl font-serif flex items-center gap-4 text-slate-900 dark:text-white">
              <span className="w-8 h-8 text-amber-600 dark:text-amber-400">
                <FiFilm className="w-full h-full" />
              </span>
              Video Guide
            </h2>
            <div className="aspect-video rounded-2xl overflow-hidden bg-white/80 border border-black/5 dark:bg-slate-800/80 dark:border-white/5">
              <iframe
                src={recipe.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title={`How to make ${recipe.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
});
