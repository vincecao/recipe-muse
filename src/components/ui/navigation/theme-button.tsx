'use client';

import { memo, useEffect, useLayoutEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import NavButton from './nav-button';
import { useTheme } from '../../layout/theme-provider';

const ThemeButton = memo(function ThemeButtonComponent() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => setMounted(true), []);

  // Use layout effect to prevent flash
  useLayoutEffect(() => {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
      htmlElement.classList.toggle('dark', isDark);
    }
  }, [isDark]);

  if (!mounted) return;

  return (
    <NavButton
      onClick={toggleTheme}
      icon={isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
      active={isDark}
      tooltip={{ content: 'Toggle theme' }}
      iconClassName="w-4 h-4"
    />
  );
});

export default ThemeButton;
