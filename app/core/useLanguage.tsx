import { useLocalStorage } from '@mantine/hooks';
import { Lang } from './type';

export function useLanguage() {
  const [language, setLanguage] = useLocalStorage<Lang>({
    key: 'language',
    defaultValue: 'en',
  });

  return { language, setLanguage };
}
