import type { ReactNode } from 'react';

interface RollingPaperFormFooterProps {
  children: ReactNode;
  /** 키보드가 올라온 만큼 아래 여백을 띄울 때 사용 (px) */
  bottomOffset?: number;
  /** 상단 페이드 그라디언트 노출 여부 */
  withGradient?: boolean;
  className?: string;
}

export function RollingPaperFormFooter({
  children,
  bottomOffset = 0,
  withGradient = false,
  className,
}: RollingPaperFormFooterProps) {
  return (
    <div
      className={`fixed inset-x-0 z-10 mx-auto flex w-full max-w-150 flex-col items-center gap-2 px-4 pb-6 ${
        withGradient
          ? 'pt-8 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)]'
          : ''
      } ${className ?? ''}`}
      style={{ bottom: bottomOffset }}
    >
      {children}
    </div>
  );
}
