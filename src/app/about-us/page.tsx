'use client';

import Link from 'next/link';
import { MenuLayout } from '../menu/_components/menu';
import { GiCookingPot, GiMeal, GiSpoon } from 'react-icons/gi';
import { MdOutlineTimer, MdRestaurantMenu } from 'react-icons/md';
import useLanguage from '~/core/use-language';

const content = {
  en: {
    title: 'Revolutionizing Meal Planning',
    subtitle:
      'Never wonder "what\'s for dinner" again. Our AI-powered platform creates personalized recipes based on your preferences, pantry items, and cooking skill level.',
    features: [
      {
        title: 'Smart Recipe Generation',
        description:
          "Tell us your dietary needs, available ingredients, and desired cuisine type - we'll handle the rest",
      },
      {
        title: 'Interactive Cooking',
        description: 'Step-by-step instructions with built-in timers and progress tracking',
      },
      {
        title: 'Meal Recommendations',
        description: 'Daily suggestions based on time of day, seasonality, and your cooking history',
      },
      {
        title: 'Visual Inspiration',
        description: 'Automatically sourced food photography to help you visualize each dish',
      },
    ],
    cta: 'Start Your Culinary Journey',
  },
  ja: {
    title: '食事プランニングの革新',
    subtitle:
      '「今晩の夕食は何にしよう」という悩みはもう終わり。AIを活用したプラットフォームが、あなたの好み、食材、料理スキルに基づいてパーソナライズされたレシピを作成します。',
    features: [
      {
        title: 'スマートなレシピ生成',
        description: '食事制限、使用可能な食材、好みの料理タイプを教えていただければ、後は私たちにお任せください',
      },
      {
        title: 'インタラクティブな調理',
        description: 'タイマー機能と進捗管理を備えたステップバイステップの説明',
      },
      {
        title: '食事のレコメンデーション',
        description: '時間帯、季節、調理履歴に基づいた日々のおすすめ',
      },
      {
        title: 'ビジュアルインスピレーション',
        description: '各料理のイメージを掴めるよう、自動的に収集された料理写真を提供',
      },
    ],
    cta: '料理の旅を始める',
  },
  zh: {
    title: '革新餐饮规划',
    subtitle: '不用再为"今天吃什么"而烦恼。我们的AI驱动平台根据您的喜好、食材和烹饪水平创建个性化食谱。',
    features: [
      {
        title: '智能食谱生成',
        description: '告诉我们您的饮食需求、可用食材和想要的菜系类型 - 剩下的交给我们',
      },
      {
        title: '互动烹饪体验',
        description: '带有内置计时器和进度跟踪的分步说明',
      },
      {
        title: '餐点推荐',
        description: '根据一天中的时间、季节性和您的烹饪历史提供每日建议',
      },
      {
        title: '视觉灵感',
        description: '自动收集的美食摄影，帮助您想象每道菜的成品',
      },
    ],
    cta: '开启您的烹饪之旅',
  },
};

export default function AboutPage() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <MenuLayout>
      <div className="relative max-w-4xl mx-auto p-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-slate-800 dark:text-slate-200">{t.title}</h1>
          <p className="text-lg max-w-2xl mx-auto text-slate-600 dark:text-slate-400">{t.subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {t.features.map((feature, index) => {
            const icons = [
              <GiCookingPot key="cooking" className="w-8 h-8" />,
              <MdOutlineTimer key="timer" className="w-8 h-8" />,
              <GiMeal key="meal" className="w-8 h-8" />,
              <MdRestaurantMenu key="menu" className="w-8 h-8" />,
            ];
            return (
              <div
                key={index}
                className="p-6 rounded-xl backdrop-blur-sm border bg-white/50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-amber-600 dark:text-amber-400">{icons[index]}</span>
                  <h3 className="text-xl font-medium text-slate-800 dark:text-slate-200">{feature.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <GiSpoon className="mx-auto w-12 h-12 text-amber-500" />
          <Link
            href="/"
            className="inline-block px-8 py-3 rounded-full font-medium transition-all bg-amber-600 text-white hover:bg-amber-500 dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400"
          >
            {t.cta}
          </Link>
        </div>
      </div>
    </MenuLayout>
  );
}
