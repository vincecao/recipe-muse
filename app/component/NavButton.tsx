import { Link } from "@remix-run/react";
import { memo, ReactNode } from "react";
import cn from "classnames";

const NavButton = ({ to, type, icon, text, onClick }: { to?: string; type?: "button" | "submit"; icon?: ReactNode; text?: string; onClick?: () => void }) => {
  let el = <></>;

  const className = cn(
    `flex items-center gap-2 p-2
font-serif text-sm tracking-wider
border rounded-md
transition-all duration-300
text-gray-500 border-gray-500/30 bg-gray-200/30 hover:bg-gray-200 hover:text-gray-700
dark:text-gray-400 dark:border-gray-400/30 dark:bg-gray-700/30 dark:hover:bg-gray-700 dark:hover:text-white
backdrop-blur-sm`
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
