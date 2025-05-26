import { Difficulty, Category, Lang } from '../entities/recipe.entity';

export const difficultyTranslations: Record<Difficulty, Record<Lang, string>> = {
  'Beginner': { en: 'Beginner', zh: '初學者', ja: '初級' },
  'Intermediate': { en: 'Intermediate', zh: '中級', ja: '中級' },
  'Advanced': { en: 'Advanced', zh: '高級', ja: '上級' },
};

export const categoryTranslations: Record<Category, Record<Lang, string>> = {
  Appetizers: { en: 'Appetizers', zh: '开胃菜', ja: '前菜' },
  'Main Course': { en: 'Main Course', zh: '主菜', ja: 'メインコース' },
  Desserts: { en: 'Desserts', zh: '甜点', ja: 'デザート' },
  Beverages: { en: 'Beverages', zh: '饮料', ja: '飲み物' },
  Cocktails: { en: 'Cocktails', zh: '鸡尾酒', ja: 'カクテル' },
};

export class TranslationService {
  static getDifficultyTranslation(difficulty: Difficulty, lang: Lang): string {
    return difficultyTranslations[difficulty][lang] || difficultyTranslations[difficulty].en;
  }

  static getCategoryTranslation(category: Category, lang: Lang): string {
    return categoryTranslations[category][lang] || categoryTranslations[category].en;
  }
}
