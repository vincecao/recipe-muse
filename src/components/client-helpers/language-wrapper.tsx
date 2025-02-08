'use client';

import { memo } from 'react';
import { Lang } from '~/core/type';
import { useLanguage } from '~/core/use-language';

function LanguageWrapper({ children }: { children: (language: Lang) => React.ReactNode }) {
  const { language } = useLanguage();
  return children(language);
}

export default memo(LanguageWrapper);
