import type { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col bg-white">
      {children}
    </div>
  );
}
