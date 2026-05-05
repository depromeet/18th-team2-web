import type { ReactNode } from 'react';

import chevronLeftSvg from '@/assets/icons/icon-chevron-left.svg?raw';
import closeSvg from '@/assets/icons/icon-close.svg?raw';
import homeSvg from '@/assets/icons/icon-home.svg?raw';

type PageHeaderVariant = 'back' | 'close' | 'home' | 'double';

interface PageHeaderProps {
  variant?: PageHeaderVariant;
  title?: string;
  /** variant="double"일 때 좌측에 렌더링할 커스텀 버튼 */
  leftSlot?: ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  onHome?: () => void;
}

function PageHeaderButton({
  onClick,
  label,
  children,
}: {
  onClick?: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative z-10 flex h-12 w-12 cursor-pointer items-center justify-center"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function PageHeader({
  variant = 'back',
  title,
  leftSlot,
  onBack,
  onClose,
  onHome,
}: PageHeaderProps) {
  return (
    <header className="relative flex h-12 w-full items-center">
      {variant === 'back' && (
        <PageHeaderButton label="뒤로가기" onClick={onBack}>
          <span
            aria-hidden
            className="text-grey-900"
            dangerouslySetInnerHTML={{ __html: chevronLeftSvg }}
          />
        </PageHeaderButton>
      )}

      {variant === 'close' && (
        <PageHeaderButton label="닫기" onClick={onClose}>
          <span aria-hidden dangerouslySetInnerHTML={{ __html: closeSvg }} />
        </PageHeaderButton>
      )}

      {variant === 'home' && (
        <PageHeaderButton label="홈으로" onClick={onHome}>
          <span
            aria-hidden
            className="text-grey-900"
            dangerouslySetInnerHTML={{ __html: homeSvg }}
          />
        </PageHeaderButton>
      )}

      {variant === 'double' && (
        <>
          <div className="relative z-10 flex items-center">{leftSlot}</div>
          <div className="relative z-10 ml-auto">
            <PageHeaderButton label="닫기" onClick={onClose}>
              <span aria-hidden dangerouslySetInnerHTML={{ __html: closeSvg }} />
            </PageHeaderButton>
          </div>
        </>
      )}

      {title && (
        <span className="pointer-events-none absolute inset-x-0 text-center text-base font-semibold text-grey-900">
          {title}
        </span>
      )}
    </header>
  );
}
