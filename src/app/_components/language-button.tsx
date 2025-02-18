import { memo, useState } from 'react';
import useLanguage from '~/core/use-language';
import { Lang } from '~/core/type';
import { MdKeyboardArrowDown } from 'react-icons/md';
import cn from 'classnames';

const LanguageButton = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm font-medium',
          {
            'text-gray-500 border-gray-500/30 bg-gray-200/30 hover:bg-gray-200 hover:text-gray-700': true,
            'dark:text-gray-400 dark:border-gray-400/30 dark:bg-gray-700/30 dark:hover:bg-gray-700 dark:hover:text-white':
              true,
          },
          'backdrop-blur-sm border rounded-md',
          'transition-all duration-300',
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-sans">{LANGUAGE_NAME_MAPPING[language].slice(0, 2)}</span>
        <MdKeyboardArrowDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`absolute ${isOpen ? 'block' : 'hidden'} right-0 mt-1 w-40 
        bg-white/80 dark:bg-gray-900/80 border border-black/5 dark:border-white/5 
        rounded-lg shadow-lg backdrop-blur-sm`}
      >
        {Object.entries(LANGUAGE_NAME_MAPPING).map(([code, name]) => (
          <button
            key={code}
            onClick={() => {
              setLanguage(code as Lang);
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 text-black dark:text-white
              ${
                language === code
                  ? 'bg-gray-100/60 dark:bg-gray-800/60'
                  : 'hover:bg-gray-50/60 dark:hover:bg-gray-800/60'
              }
              transition-all duration-300`}
          >
            <span className="font-sans text-xs w-6">{code.toUpperCase()}</span>
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default memo(LanguageButton);

export const LANGUAGE_NAME_MAPPING: { [key in Lang]: string } = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
};
