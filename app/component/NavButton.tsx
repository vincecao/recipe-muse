import { Link } from "@remix-run/react";
import { memo, ReactNode } from "react";
import { useIsDark } from "~/core/useIsDark";
import cn from "classnames";

const NavButton = ({ to, type, icon, text, onClick }: { to?: string; type?: "button" | "submit"; icon?: ReactNode; text?: string; onClick?: () => void }) => {
  const isDark = useIsDark();
  let el = <></>;

  const className = cn(
    `flex items-center gap-2 p-2
font-serif text-sm tracking-wider
border rounded-md
transition-all duration-300`,
    {
      "text-gray-500 border-gray-500/30 hover:bg-gray-200 hover:text-gray-700": !isDark,
      "text-gray-400 border-gray-400/30 hover:bg-gray-700 hover:text-white": isDark,
    }
  );

  if (to)
    el = (
      <Link to={to} className={className} onClick={onClick}>
        {text && <span className="sr-only">{text}</span>}
        {icon ?? null}
      </Link>
    );

  if (type)
    el = (
      <button type={type} className={className} onClick={onClick}>
        {text && <span className="sr-only">{text}</span>}
        {icon ?? null}
      </button>
    );
  return el;
};

export default memo(NavButton);
