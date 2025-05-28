'use client';

import { useLocalStorage } from '@mantine/hooks';
import { Lang } from '../../domain/entities/recipe.entity';
import { useEffect } from 'react';

export default function useLanguage() {
  const [language, setLanguage] = useLocalStorage<Lang>({
    key: 'language',
    defaultValue: 'en',
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return { language, setLanguage };
}