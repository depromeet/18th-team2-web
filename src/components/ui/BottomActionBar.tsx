import type { ReactNode } from 'react';

interface BottomActionBarProps {
  children: ReactNode;
}

// 화면 하단 고정 액션 영역 — 흰색 그라데이션 배경 + 좌우 마진 + 최대 너비.
export function BottomActionBar({ children }: BottomActionBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex min-h-27.5 w-full max-w-150 items-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#FFFFFF_40.91%)] px-4 pt-2 pb-6">
      <div className="w-full">{children}</div>
    </div>
  );
}
