import type { ReactNode } from 'react';

interface CalloutMessageProps {
  variant?: 'alert' | 'check';
  children: ReactNode;
  className?: string;
}

export function CalloutMessage({ variant = 'alert', children, className }: CalloutMessageProps) {
  const isCheck = variant === 'check';

  return (
    <div
      className={`flex min-h-12 w-full items-center justify-center gap-2 rounded-[12px] px-4 py-2 ${
        isCheck ? 'bg-blue-30 text-blue-700' : 'bg-red-30 text-red-500'
      } ${className ?? ''}`}
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[12px] leading-none font-bold text-white ${
            isCheck ? 'bg-blue-500' : 'bg-red-500'
          }`}
        >
          {isCheck ? '✓' : '!'}
        </span>
      </span>
      <span className="text-label-1 font-medium">{children}</span>
    </div>
  );
}
