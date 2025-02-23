'use client';

import { Cuisine, DbRecipe } from '~/core/type';
import { cache } from 'react';
import { AnthropicModel, DeepseekModel, LLMRequest, OpenAIModel } from '~/app/api/_services/llm-client';
import axios, { isAxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import View from './_components';
import useLanguage from '~/core/use-language';

const CUISINE_OPTIONS: { en: Cuisine; zh: string; ja: string }[] = [
  { en: 'Italian', zh: '意大利菜', ja: 'イタリア料理' },
  { en: 'French', zh: '法国菜', ja: 'フランス料理' },
  { en: 'Spanish', zh: '西班牙菜', ja: 'スペイン料理' },
  { en: 'Greek', zh: '希腊菜', ja: 'ギリシャ料理' },
  { en: 'Mediterranean', zh: '地中海菜', ja: '地中海料理' },
  { en: 'Mexican', zh: '墨西哥菜', ja: 'メキシコ料理' },
  { en: 'Brazilian', zh: '巴西菜', ja: 'ブラジル料理' },
  { en: 'Peruvian', zh: '秘鲁菜', ja: 'ペルー料理' },
  { en: 'American', zh: '美国菜', ja: 'アメリカ料理' },
  { en: 'Japanese', zh: '日本菜', ja: '日本料理' },
  { en: 'Chinese', zh: '中国菜', ja: '中華料理' },
  { en: 'Thai', zh: '泰国菜', ja: 'タイ料理' },
  { en: 'Indian', zh: '印度菜', ja: 'インド料理' },
  { en: 'Middle Eastern', zh: '中东菜', ja: '中東料理' },
  { en: 'Lebanese', zh: '黎巴嫩菜', ja: 'レバノン料理' },
  { en: 'Turkish', zh: '土耳其菜', ja: 'トルコ料理' },
  { en: 'Moroccan', zh: '摩洛哥菜', ja: 'モロッコ料理' },
  { en: 'Ethiopian', zh: '埃塞俄比亚菜', ja: 'エチオピア料理' },
  { en: 'Korean', zh: '韩国菜', ja: '韓国料理' },
  { en: 'Vietnamese', zh: '越南菜', ja: 'ベトナム料理' },
  { en: 'Caribbean', zh: '加勒比菜', ja: 'カリブ料理' },
  { en: 'Cajun/Creole', zh: '卡真/克里奥尔菜', ja: 'ケイジャン/クレオール料理' },
  { en: 'German', zh: '德国菜', ja: 'ドイツ料理' },
  { en: 'British', zh: '英国菜', ja: 'イギリス料理' },
  { en: 'Irish', zh: '爱尔兰菜', ja: 'アイルランド料理' },
  { en: 'Scandinavian', zh: '北欧菜', ja: '北欧料理' },
  { en: 'Russian', zh: '俄罗斯菜', ja: 'ロシア料理' },
  { en: 'Hawaiian', zh: '夏威夷菜', ja: 'ハワイ料理' },
  { en: 'Filipino', zh: '菲律宾菜', ja: 'フィリピン料理' },
  { en: 'Malaysian', zh: '马来西亚菜', ja: 'マレーシア料理' },
  { en: 'Indonesian', zh: '印度尼西亚菜', ja: 'インドネシア料理' },
  { en: 'South African', zh: '南非菜', ja: '南アフリカ料理' },
  { en: 'Soul Food', zh: '灵魂食物', ja: 'ソウルフード' },
  { en: 'Tex-Mex', zh: '德州墨西哥菜', ja: 'テクス・メクス料理' },
  { en: 'Israeli', zh: '以色列菜', ja: 'イスラエル料理' },
  { en: 'Polish', zh: '波兰菜', ja: 'ポーランド料理' },
  { en: 'Portuguese', zh: '葡萄牙菜', ja: 'ポルトガル料理' },
  { en: 'Argentinian', zh: '阿根廷菜', ja: 'アルゼンチン料理' },
  { en: 'Nordic', zh: '北欧菜', ja: '北欧料理' },
  { en: 'Southern', zh: '南方菜', ja: '南部料理' },
  { en: 'Pacific Islander', zh: '太平洋岛民菜', ja: '太平洋諸島料理' },
  { en: 'Fusion', zh: '融合菜', ja: 'フュージョン料理' },
  { en: 'Vegetarian', zh: '素食', ja: 'ベジタリアン料理' },
  { en: 'Vegan', zh: '纯素食', ja: 'ヴィーガン料理' },
  { en: 'Kosher', zh: '犹太菜', ja: 'コーシャ料理' },
  { en: 'BBQ', zh: '烧烤', ja: 'バーベキュー' },
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

const TRANSLATIONS = {
  en: {
    modelLabel: 'Model:',
    recipePrompt: 'Having a recipe name in mind?',
    yesOption: 'Yes, I have a name',
    noOption: 'No, generate options',
    dishNameLabel: 'Dish Name',
    cuisineLabel: 'Cuisine',
    numNamesLabel: 'Number of Names',
    nextButton: 'Next',
    selectRecipe: 'Select a Recipe Name:',
    usingName: 'Using name:',
    generateDetails: 'Generate Recipe Details',
    backButton: 'Back',
  },
  zh: {
    modelLabel: '模型:',
    recipePrompt: '有想好的菜名吗？',
    yesOption: '是的，我有菜名',
    noOption: '没有，请生成选项',
    dishNameLabel: '菜名',
    cuisineLabel: '菜系',
    numNamesLabel: '生成数量',
    nextButton: '下一步',
    selectRecipe: '选择菜名:',
    usingName: '使用名称:',
    generateDetails: '生成食谱详情',
    backButton: '返回',
  },
  ja: {
    modelLabel: 'モデル:',
    recipePrompt: 'レシピ名は決まっていますか？',
    yesOption: 'はい、レシピ名があります',
    noOption: 'いいえ、オプションを生成してください',
    dishNameLabel: '料理名',
    cuisineLabel: '料理ジャンル',
    numNamesLabel: '生成数',
    nextButton: '次へ',
    selectRecipe: 'レシピ名を選択:',
    usingName: '使用する名前:',
    generateDetails: 'レシピ詳細を生成',
    backButton: '戻る',
  },
};

export default function GeneratePage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [model, setModel] = useState<LLMRequest['model']>(DeepseekModel.CHAT);
  const { register, handleSubmit, watch } = useForm<FormValues>();
  const [step, setStep] = useState(1);
  const [generatedNames, setGeneratedNames] = useState<GeneratedNames>([]);
  const [selectedName, setSelectedName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const generateType = watch('generateType');

  const [generatedRecipes, setGeneratedRecipes] = useState<DbRecipe[]>([]);

  const handleStep1 = async (data: FormValues) => {
    setIsLoading(true);
    try {
      if (data.generateType === 'generate') {
        const names = await generateRecipeNames(data.count!, [data.cuisine!], model);
        setGeneratedNames(names);
      }
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2 = async () => {
    setIsLoading(true);
    try {
      const name = generateType === 'generate' ? selectedName : watch('dishName');
      const generated = await generateRecipe(name!, model);
      setGeneratedRecipes((curr) => [...curr, generated]);
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 p-4 sm:p-6">
      <div className="model-switcher mb-6 sm:mb-8">
        <label className="text-slate-600 dark:text-slate-400 mr-2 text-sm sm:text-base">{t.modelLabel}</label>
        <select
          className="bg-white/80 dark:bg-slate-800/50 rounded-lg px-3 py-2 text-sm sm:text-base text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 backdrop-blur-sm w-full sm:w-auto"
          value={model}
          onChange={(e) => setModel(e.target.value as LLMRequest['model'])}
        >
          {[...Object.values(OpenAIModel), ...Object.values(AnthropicModel), ...Object.values(DeepseekModel)].map(
            (m) => (
              <option key={m} value={m}>
                {!m.includes('/') ? `anthropic/${m}` : m}
              </option>
            ),
          )}
        </select>
      </div>

      <form
        onSubmit={step === 1 ? handleSubmit(handleStep1) : handleSubmit(handleStep2)}
        className="bg-white/70 dark:bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-700"
      >
        {step === 1 && (
          <>
            <div className="space-y-3 mb-4">
              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">{t.recipePrompt}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  <input type="radio" value="manual" {...register('generateType')} className="w-4 h-4" />
                  {t.yesOption}
                </label>
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                  <input type="radio" value="generate" {...register('generateType')} className="w-4 h-4" />
                  {t.noOption}
                </label>
              </div>
            </div>

            {generateType === 'manual' && (
              <div className="mb-4">
                <label className="block text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-2">
                  {t.dishNameLabel}
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
                  {...register('dishName', { required: true })}
                />
              </div>
            )}

            {generateType === 'generate' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-2">
                    {t.cuisineLabel}
                  </label>
                  <select
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 text-sm sm:text-base"
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
                  <label className="block text-slate-600 dark:text-slate-400 text-sm sm:text-base mb-2">
                    {t.numNamesLabel}
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
          </>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {generateType === 'generate' ? (
              <div className="space-y-4">
                <h3 className="text-slate-700 dark:text-slate-300 text-lg font-medium">{t.selectRecipe}</h3>
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
                <p className="text-slate-7 00 dark:text-slate-300 text-base">
                  {t.usingName} {watch('dishName')}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 sm:py-2 bg-amber-500 text-white rounded-full hover:bg-amber-400 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex-1 px-6 py-3 sm:py-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm sm:text-base"
              >
                {t.backButton}
              </button>
            </div>
          </div>
        )}
      </form>

      <View recipes={generatedRecipes} />
    </div>
  );
}
