import { useMantineColorScheme } from "@mantine/core";
import { useNavigate } from "@remix-run/react";
import { memo } from "react";
import { FiArrowLeft } from "react-icons/fi";

const BackButton = () => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(-1)}
      className={`
    fixed left-3 top-3
    flex items-center gap-2
    p-2 rounded-full
    transition-colors
    ${isDark ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100"}
  `}
    >
      <FiArrowLeft className="w-6 h-6" />
      Back
    </button>
  );
};

export default memo(BackButton);
