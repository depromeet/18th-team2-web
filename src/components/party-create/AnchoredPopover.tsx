import type { ReactNode } from 'react';

interface AnchoredPopoverProps {
  position: {
    top: number;
    left: number;
  };
  className?: string;
  children: ReactNode;
}

export function AnchoredPopover({ position, className, children }: AnchoredPopoverProps) {
  return (
    <div
      className={`bg-grey-600/70 fixed z-50 w-[282px] rounded-lg text-white shadow-lg backdrop-blur-sm ${className ?? ''}`}
      style={{ top: position.top, left: position.left }}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </div>
  );
}
