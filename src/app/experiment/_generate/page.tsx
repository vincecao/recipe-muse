'use client';

import { Cuisine } from '~/core/type';
import { AnthropicModel, DeepseekModel, ModelFamily, OpenAIModel } from '~/app/api/_services/llm-client';
import { useForm } from 'react-hook-form';
import View from './_components';
import useLanguage from '~/core/use-language';
import { CUISINE_OPTIONS, TRANSLATIONS } from './_constants';
import { generateRecipe, generateRecipeNames } from './_utils';
import { useGenerateReducer } from './_use-generate-reducer';

type FormValues = {
  generateType: 'manual' | 'generate';
  dishName?: string;
  cuisine?: Cuisine;
  count?: number;
  model: string;
};

export default function GeneratePage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const generateType = watch('generateType');

  const [
    { model, step, generatedNames, selectedName, isLoading, generatedRecipes, progress },
    {
      setStartLoading,
      setStopLoading,
      resetProgress,
      setProgress,
      setStep,
      setGeneratedNames,
      addRecipe,
      setModel,
      setSelectedName,
    },
  ] = useGenerateReducer();

  async function handleStep1(data: FormValues) {
    try {
      setStartLoading();
      resetProgress();
      if (data.generateType === 'generate') {
        const names = await generateRecipeNames(data.count!, [data.cuisine!], model);
        setGeneratedNames(names);
      }
      setStep(2);
    } finally {
      setStopLoading();
    }
  }

  async function handleStep2() {
    try {
      setStartLoading();
      setProgress({ message: 'Starting', value: 0 });
      const name = generateType === 'generate' ? selectedName : watch('dishName');
      const generated = await generateRecipe(name!, model, setProgress);
      addRecipe(generated);
      setStep(1);
    } catch (error) {
      console.error('Generation failed:', error);
      // Handle error state here
    } finally {
      setStopLoading();
    }
  }

  const modelSelectCtrl = (
    <div className="model-switcher mb-6 sm:mb-8">
      <label className="text-slate-600 dark:text-slate-400 mr-2 text-sm sm:text-base">{t.modelLabel}</label>
      <select
        className="bg-white/80 dark:bg-slate-800/50 rounded-lg px-3 py-2 text-sm sm:text-base text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 backdrop-blur-sm w-full sm:w-auto"
        value={model}
        onChange={(e) => setModel(e.target.value as string)}
      >
        {[
          ...Object.values(OpenAIModel).map((m) => `${ModelFamily.OPENAI}/${m}`),
          ...Object.values(AnthropicModel).map((m) => `${ModelFamily.ANTHROPIC}/${m}`),
          ...Object.values(DeepseekModel).map((m) => `${ModelFamily.DEEPSEEK}/${m}`),
          ,
        ].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );

  const stepOneSubmitBtnCtrl = (
    <button
      type="submit"
      className="mt-6 px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {t.nextButton}
        </div>
      ) : (
        t.nextButton
      )}
    </button>
  );

  const stepOneForm = (
    <>
      <div className="space-y-3 mb-4">
        <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">{t.recipePrompt}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            <input
              type="radio"
              value="manual"
              {...register('generateType')}
              className="w-4 h-4 text-amber-500 bg-white/80 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 focus:ring-amber-500 backdrop-blur-sm"
            />
            {t.yesOption}
          </label>
          <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            <input
              type="radio"
              value="generate"
              {...register('generateType')}
              className="w-4 h-4 text-amber-500 bg-white/80 dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 focus:ring-amber-500 backdrop-blur-sm"
            />
            {t.noOption}
          </label>
        </div>
      </div>

      {generateType === 'manual' && (
        <div className="mb-4">
          <label className="block text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-2">
            {t.dishNameLabel}
          </label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
            {...register('dishName', { required: true })}
          />
        </div>
      )}

      {generateType === 'generate' && (
        <div className="space-y-4">
          <div>
            <label className="block text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-2">
              {t.cuisineLabel}
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              {...register('cuisine', { required: true })}
            >
              {CUISINE_OPTIONS.map((cuisine) => (
                <option key={cuisine.en} value={cuisine.en}>
                  {cuisine[language] || cuisine.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-300 text-sm sm:text-base mb-2">
              {t.numNamesLabel}
            </label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
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

      {stepOneSubmitBtnCtrl}
    </>
  );

  const stepTwoSubmitBtnCtrl = (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        type="submit"
        className="flex-1 px-6 py-3 sm:py-2 bg-amber-500 text-white rounded-full hover:bg-amber-400 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {t.generateDetails}
          </div>
        ) : (
          t.generateDetails
        )}
      </button>
      <button
        type="button"
        onClick={() => setStep(1)}
        className="flex-1 px-6 py-3 sm:py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all text-sm sm:text-base"
      >
        {t.backButton}
      </button>
    </div>
  );

  const progressCtrl = (
    <>
      {isLoading && progress !== undefined && (
        <div className="mt-4 space-y-2">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div
              className="bg-amber-500 dark:bg-amber-400 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress.value}%` }}
            ></div>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {progress.value < 100 && `${progress.message}... ${progress.value}%`}
          </div>
        </div>
      )}
    </>
  );

  const stepTwoForm = (
    <>
      <div className="space-y-6 mb-4">
        {generateType === 'generate' ? (
          <div className="space-y-4">
            <h3 className="text-slate-700 dark:text-slate-200 text-lg font-medium">{t.selectRecipe}</h3>
            <div className="grid gap-2">
              {generatedNames.map((name) => (
                <label
                  key={name}
                  className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                >
                  <input
                    type="radio"
                    name="selectedName"
                    value={name}
                    onChange={(e) => setSelectedName(e.target.value)}
                    className="text-amber-500 border-slate-300 dark:border-slate-500 w-5 h-5 focus:ring-amber-500"
                  />
                  <span className="text-slate-700 dark:text-slate-200 text-base break-words">{name}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-600">
            <p className="text-slate-700 dark:text-slate-200 text-base">
              {t.usingName} {watch('dishName')}
            </p>
          </div>
        )}
      </div>

      {stepTwoSubmitBtnCtrl}
    </>
  );

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
      {modelSelectCtrl}

      <form
        onSubmit={step === 1 ? handleSubmit(handleStep1) : handleSubmit(handleStep2)}
        className="bg-white/70 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700 mb-4"
      >
        {step === 1 && stepOneForm}

        {step === 2 && stepTwoForm}
      </form>

      {progressCtrl}

      <View recipes={generatedRecipes} />
    </div>
  );
}
