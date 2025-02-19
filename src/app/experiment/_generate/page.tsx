'use client';

import { Cuisine, DbRecipe } from '~/core/type';
import { cache } from 'react';
import { AnthropicModel, DeepseekModel, LLMRequest, OpenAIModel } from '~/app/api/_services/llm-client';
import axios, { isAxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import View from './_components';

const CUISINE_OPTIONS: Cuisine[] = [
  'Italian',
  'French',
  'Spanish',
  'Greek',
  'Mediterranean',
  'Mexican',
  'Brazilian',
  'Peruvian',
  'American',
  'Japanese',
  'Chinese',
  'Thai',
  'Indian',
  'Middle Eastern',
  'Lebanese',
  'Turkish',
  'Moroccan',
  'Ethiopian',
  'Korean',
  'Vietnamese',
  'Caribbean',
  'Cajun/Creole',
  'German',
  'British',
  'Irish',
  'Scandinavian',
  'Russian',
  'Hawaiian',
  'Filipino',
  'Malaysian',
  'Indonesian',
  'South African',
  'Soul Food',
  'Tex-Mex',
  'Israeli',
  'Polish',
  'Portuguese',
  'Argentinian',
  'Nordic',
  'Southern',
  'Pacific Islander',
  'Fusion',
  'Vegetarian',
  'Vegan',
  'Kosher',
  'BBQ',
];

const PRESET_RECIPE_NAMES: string[] = [];
const PRESET_RECIPE: DbRecipe | undefined = undefined;

const generateRecipeNames = cache(async (length: number, cuisines: Cuisine[], model: LLMRequest['model']) => {
  const origin = process.env.NEXT_PUBLIC_BASE_URL;

  if (PRESET_RECIPE_NAMES.length) return PRESET_RECIPE_NAMES;

  try {
    const url = `${origin}/api/llm/recipe-names`;
    const { data } = await axios.get<string[]>(url, {
      params: { length, cuisines: JSON.stringify(cuisines), model },
    });
    return data;
  } catch (error) {
    console.error('Error generating recipe names:', error);
    if (isAxiosError(error)) {
      throw new Response(error.response?.data?.error || 'Failed to generate recipe names', {
        status: error.response?.status || 500,
      });
    }
    throw new Response('Failed to generate recipe names', { status: 500 });
  }
});

const generateRecipe = cache(async (name: string, model: LLMRequest['model']) => {
  const origin = process.env.NEXT_PUBLIC_BASE_URL;

  if (PRESET_RECIPE) return PRESET_RECIPE;

  try {
    const url = `${origin}/api/llm/recipe`;
    const { data } = await axios.get<DbRecipe>(url, {
      params: {
        name,
        model,
      },
    });
    return data;
  } catch (error) {
    console.error('Error generating recipe:', error);
    if (isAxiosError(error)) {
      throw new Response(error.response?.data?.error || 'Failed to generate recipe', {
        status: error.response?.status || 500,
      });
    }
    throw new Response('Failed to generate recipe', { status: 500 });
  }
});

type FormValues = {
  generateType: 'manual' | 'generate';
  dishName?: string;
  cuisine?: Cuisine;
  count?: number;
  model: LLMRequest['model'];
};

type GeneratedNames = string[];

export default function GeneratePage() {
  const [model, setModel] = useState<LLMRequest['model']>(DeepseekModel.CHAT);
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const [step, setStep] = useState(1);
  const [generatedNames, setGeneratedNames] = useState<GeneratedNames>([]);
  const [selectedName, setSelectedName] = useState<string>('');
  const generateType = watch('generateType');

  const [generatedRecipes, setGeneratedRecipes] = useState<DbRecipe[]>([]);

  const handleStep1 = async (data: FormValues) => {
    if (data.generateType === 'generate') {
      const names = await generateRecipeNames(data.count!, [data.cuisine!], model);
      setGeneratedNames(names);
    }
    setStep(2);
  };

  const handleStep2 = async () => {
    const name = generateType === 'generate' ? selectedName : watch('dishName');
    const generated = await generateRecipe(name!, model);
    setGeneratedRecipes((curr) => [...curr, generated]);
    setStep(1);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
      <div className="model-switcher mb-6 sm:mb-8">
        <label className="text-slate-600 dark:text-slate-400 mr-2 text-sm sm:text-base">Model:</label>
        <select
          className="bg-white/80 dark:bg-slate-800/50 rounded-lg px-3 py-2 text-sm sm:text-base text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 backdrop-blur-sm w-full sm:w-auto"
          value={model}
          onChange={(e) => setModel(e.target.value as LLMRequest['model'])}
        >
          {[
            ...Object.values(OpenAIModel),
            ...Object.values(AnthropicModel).map((m) => `anthropic/${m}`),
            ...Object.values(DeepseekModel),
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <form
        onSubmit={step === 1 ? handleSubmit(handleStep1) : handleSubmit(handleStep2)}
        className="bg-white/70 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700"
      >
        {step === 1 && (
          <>
            <div className="space-y-3 mb-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">Having a recipe name in mind?</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  <input type="radio" value="manual" {...register('generateType')} className="w-4 h-4" />
                  Yes, I have a name
                </label>
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  <input type="radio" value="generate" {...register('generateType')} className="w-4 h-4" />
                  No, generate options
                </label>
              </div>
            </div>

            {generateType === 'manual' && (
              <div className="mb-4">
                <label className="block text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-2">Dish Name</label>
                <input
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                  {...register('dishName', { required: true })}
                />
              </div>
            )}

            {generateType === 'generate' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-2">Cuisine</label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm sm:text-base"
                    {...register('cuisine', { required: true })}
                  >
                    {CUISINE_OPTIONS.map((cuisine) => (
                      <option key={cuisine} value={cuisine}>
                        {cuisine}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-2">
                    Number of Names
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm sm:text-base"
                    {...register('count', { required: true })}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="mt-6 px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-400 transition-colors"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {generateType === 'generate' ? (
              <div className="space-y-4">
                <h3 className="text-slate-700 dark:text-slate-300 text-lg font-medium">Select a Recipe Name:</h3>
                <div className="grid gap-2">
                  {generatedNames.map((name) => (
                    <label
                      key={name}
                      className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="selectedName"
                        value={name}
                        onChange={(e) => setSelectedName(e.target.value)}
                        className="text-amber-500 border-slate-300 dark:border-slate-600 w-5 h-5"
                      />
                      <span className="text-slate-700 dark:text-slate-300 text-base break-words">{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 text-base">Using name: {watch('dishName')}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 sm:py-2 bg-amber-500 text-white rounded-full hover:bg-amber-400 transition-colors text-sm sm:text-base"
              >
                Generate Recipe Details
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 sm:py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm sm:text-base"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </form>

      <View recipes={generatedRecipes} />
    </div>
  );
}
