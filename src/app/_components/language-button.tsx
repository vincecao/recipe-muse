import { memo } from "react";
import NavButton from "./nav-button";
import { useLanguage } from "~/core/use-language";

const LangButton = () => {
  const { language, setLanguage } = useLanguage();
  
  return language === "zh" ? (
    <NavButton
      onClick={() => setLanguage("en")}
      text="English"
      icon={<span className="font-sans">EN</span>}
    />
  ) : (
    <NavButton
      onClick={() => setLanguage("zh")}
      text="中文"
      icon={<span className="font-sans">中</span>}
    />
  );
};

export default memo(LangButton);
