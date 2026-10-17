import type { ReactNode } from 'react';

import { L2 } from '@/components/ui/Typography';

type BadgeTheme = 'blue' | 'white';

interface BadgeProps {
  children: ReactNode;
  theme?: BadgeTheme;
  className?: string;
}

const THEME_CLASS: Record<BadgeTheme, string> = {
  blue: 'bg-[#1b35a5]/50 text-white',
  white: 'bg-white/50 text-blue-700',
};

export function Badge({ children, theme = 'blue', className }: BadgeProps) {
  return (
    <div
      className={`flex h-6.5 w-fit rounded-2xl px-2.5 py-1 ${THEME_CLASS[theme]} ${className ?? ''}`}
    >
      <L2>{children}</L2>
    </div>
  );
}
