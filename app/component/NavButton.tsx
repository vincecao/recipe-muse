import { Link } from "@remix-run/react";
import { memo, ReactNode } from "react";
import cn from "classnames";

type NavButtonProps = {
  to?: string;
  type?: "button" | "submit";
  icon?: ReactNode;
  text?: string;
  onClick?: () => void;
  className?: string;
  iconClassName?: string;
  active?: boolean;
};

const NavButton = ({ 
  to, 
  type, 
  icon, 
  text, 
  onClick, 
  className: customClass,
  iconClassName,
  active = false
}: NavButtonProps) => {
  const baseClass = cn(
    `flex items-center justify-center h-9 w-9 p-2
    font-serif text-sm tracking-wider
    border rounded-md
    transition-all duration-300
    backdrop-blur-sm
    flex-shrink-0`,
    {
      'text-gray-500 border-gray-500/30 bg-gray-200/30 hover:bg-gray-200 hover:text-gray-700': !active,
      'dark:text-gray-400 dark:border-gray-400/30 dark:bg-gray-700/30 dark:hover:bg-gray-700 dark:hover:text-white': !active,
      'text-slate-600 dark:text-amber-300 border-slate-200 dark:border-amber-300/30 hover:border-slate-400 dark:hover:border-amber-300/60 bg-gray-200/30 dark:bg-gray-700/30': active
    },
    customClass
  );

  const content = (
    <>
      {text && <span className="sr-only">{text}</span>}
      {icon && <span className={cn("flex items-center justify-center w-4 h-4", iconClassName)}>{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClass} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseClass}
      onClick={onClick}
    >
      {content}
    </button>
  );
};

export default memo(NavButton);
