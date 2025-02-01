import { useMantineColorScheme } from "@mantine/core";
import { memo } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { useIsDark } from "~/core/useIsDark";

const ThemeButton = memo(function ThemeButtonComponent() {
  const { toggleColorScheme } = useMantineColorScheme();
  const isDark = useIsDark();

  return (
    <button
      onClick={() => toggleColorScheme()}
      className={`flex items-center gap-2 p-2
        font-serif text-sm tracking-wider
        border rounded-md
        transition-all duration-300
        ${isDark ? "text-amber-300 border-amber-300/30 hover:border-amber-300/60" : "text-slate-600 border-slate-200 hover:border-slate-400"}
      `}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
    </button>
  );
});

export default ThemeButton;
