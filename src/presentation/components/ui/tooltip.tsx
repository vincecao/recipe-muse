import { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export default function Tooltip({ children, content, placement = 'bottom' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && content) {
      let style = {};
      switch (placement) {
        case 'top':
          style = { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' };
          break;
        case 'bottom':
          style = { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' };
          break;
        case 'left':
          style = { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' };
          break;
        case 'right':
          style = { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' };
          break;
      }

      setTooltipStyle(style);
    }
  }, [content, placement]);

  if (!content) return <>{children}</>;

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {content && (
        <span
          className={`absolute z-50 px-2 py-1 text-sm text-white bg-black rounded transition-opacity duration-200 font-sans truncate max-w-[90vw] whitespace-nowrap ${
            isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={tooltipStyle}
        >
          {content}
        </span>
      )}
    </div>
  );
}
