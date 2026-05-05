import type { ReactNode } from 'react';

import chevronLeftSvg from '@/assets/icons/icon-chevron-left.svg?raw';
import closeSvg from '@/assets/icons/icon-close.svg?raw';
import homeSvg from '@/assets/icons/icon-home.svg?raw';

type NavigationBarVariant = 'back' | 'close' | 'home' | 'double';

interface NavigationBarProps {
  variant?: NavigationBarVariant;
  title?: string;
  /** variant="double"일 때 좌측에 렌더링할 커스텀 버튼 */
  leftSlot?: ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  onHome?: () => void;
}

function NavButton({
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

export function NavigationBar({
  variant = 'back',
  title,
  leftSlot,
  onBack,
  onClose,
  onHome,
}: NavigationBarProps) {
  return (
    <nav className="relative flex h-12 w-full items-center bg-white">
      {variant === 'back' && (
        <NavButton label="뒤로가기" onClick={onBack}>
          <span
            aria-hidden
            className="text-grey-900"
            dangerouslySetInnerHTML={{ __html: chevronLeftSvg }}
          />
        </NavButton>
      )}

      {variant === 'close' && (
        <NavButton label="닫기" onClick={onClose}>
          <span aria-hidden dangerouslySetInnerHTML={{ __html: closeSvg }} />
        </NavButton>
      )}

      {variant === 'home' && (
        <NavButton label="홈으로" onClick={onHome}>
          <span
            aria-hidden
            className="text-grey-900"
            dangerouslySetInnerHTML={{ __html: homeSvg }}
          />
        </NavButton>
      )}

      {variant === 'double' && (
        <>
          <div className="relative z-10 flex items-center">{leftSlot}</div>
          <div className="relative z-10 ml-auto">
            <NavButton label="닫기" onClick={onClose}>
              <span aria-hidden dangerouslySetInnerHTML={{ __html: closeSvg }} />
            </NavButton>
          </div>
        </>
      )}

      {title && (
        <span className="pointer-events-none absolute inset-x-0 text-center text-base font-semibold text-grey-900">
          {title}
        </span>
      )}
    </nav>
  );
}
