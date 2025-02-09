'use client';

import { useLocalStorage } from '@mantine/hooks';
import { Lang } from './type';
import { useEffect } from 'react';

export function useLanguage() {
  const [language, setLanguage] = useLocalStorage<Lang>({
    key: 'language',
    defaultValue: 'en',
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage };
}

export const LANGUAGE_MAPPING: { [key in Lang]: string } = {
  en: 'English',
  zh: 'Simplified Chinese',
  ja: 'Japanese',
};