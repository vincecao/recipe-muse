import { useMantineColorScheme } from "@mantine/core";
import { memo, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useIsDark } from "~/core/useIsDark";

const ThemeButton = memo(function ThemeButtonComponent() {
  const { toggleColorScheme } = useMantineColorScheme();
  const isDark = useIsDark();

  // Sync dark to tailwindcss
  useEffect(() => {
    const htmlElement = document.querySelector("html");
    if (htmlElement) {
      if (isDark) {
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    }
  }, [isDark]);

  return (
    <button
      onClick={() => toggleColorScheme()}
      className="flex items-center gap-2 p-2
        font-serif text-sm tracking-wider
        border rounded-md
        transition-all duration-300
        text-slate-600 dark:text-amber-300
        border-slate-200 dark:border-amber-300/30
        hover:border-slate-400 dark:hover:border-amber-300/60
        bg-gray-200/30 dark:bg-gray-700/30
        backdrop-blur-sm"
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
    </button>
  );
});

export default ThemeButton;
