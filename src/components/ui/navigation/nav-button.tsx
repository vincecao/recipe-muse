import { memo, ReactNode, ButtonHTMLAttributes, MouseEventHandler } from 'react';
import cn from 'classnames';
import Link from 'next/link';
import Tooltip from '../tooltip';

type NavButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  to?: string;
  icon?: ReactNode;
  text?: string;
  className?: string;
  iconClassName?: string;
  active?: boolean;
  tooltip?: { content?: string; placement?: 'top' | 'bottom' | 'left' | 'right' };
};

const NavButton = ({
  to,
  type = 'button',
  icon,
  text,
  onClick,
  className: customClass,
  iconClassName,
  active = false,
  disabled = false,
  tooltip,
}: NavButtonProps) => {
  const baseClass = cn(
    `flex items-center justify-center h-9 w-9 p-2
    font-serif text-sm tracking-wider
    border rounded-md
    transition-all duration-300
    backdrop-blur-sm
    flex-shrink-0`,
    {
      'text-gray-500 border-gray-500/30 bg-gray-200/30 hover:bg-gray-200 hover:text-gray-700': !active && !disabled,
      'dark:text-gray-400 dark:border-gray-400/30 dark:bg-gray-700/30 dark:hover:bg-gray-700 dark:hover:text-white':
        !active && !disabled,
      'text-slate-600 dark:text-amber-300 border-slate-200 dark:border-amber-300/30 hover:border-slate-400 dark:hover:border-amber-300/60 bg-gray-200/30 dark:bg-gray-700/30':
        active,
      'opacity-50 cursor-not-allowed pointer-events-none select-none': disabled,
      'text-gray-400 border-gray-400/20 bg-gray-200/20 dark:text-gray-500 dark:border-gray-500/20 dark:bg-gray-700/20':
        disabled,
    },
    customClass,
  );

  const content = (
    <>
      {text && <span className="sr-only">{text}</span>}
      {icon && <span className={cn('flex items-center justify-center w-4 h-4', iconClassName)}>{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Tooltip {...tooltip}>
        <Link
          href={to}
          className={cn(baseClass, 'group', { 'pointer-events-none': disabled })}
          onClick={onClick as unknown as MouseEventHandler<HTMLAnchorElement>}
          aria-disabled={disabled}
        >
          {content}
        </Link>
      </Tooltip>
    );
  }

  return (
    <Tooltip {...tooltip}>
      <button type={type} className={cn(baseClass, 'group')} onClick={onClick} disabled={disabled}>
        {content}
      </button>
    </Tooltip>
  );
};

export default memo(NavButton);
