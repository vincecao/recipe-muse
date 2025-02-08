import { useMantineColorScheme } from "@mantine/core";
import { memo, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import NavButton from "./NavButton";

function useIsDark() {
  const { colorScheme } = useMantineColorScheme();
  return colorScheme === "dark";
}

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

  return <NavButton onClick={toggleColorScheme} text="Toggle theme" icon={isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />} active={isDark} iconClassName="w-4 h-4" />;
});

export default ThemeButton;
