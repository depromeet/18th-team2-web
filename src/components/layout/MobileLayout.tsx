import type { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-grey-100 mx-auto flex min-h-screen w-full max-w-150 flex-col border-x bg-white">
        {children}
      </div>
    </div>
  );
}
