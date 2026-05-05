import type { ReactNode } from 'react';

import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { HomeIcon } from '@/components/ui/icons/HomeIcon';

type NavigationBarVariant = 'back' | 'close' | 'home' | 'double';

interface NavigationBarProps {
  variant?: NavigationBarVariant;
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
      className="flex h-12 w-12 cursor-pointer items-center justify-center"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function NavigationBar({
  variant = 'back',
  leftSlot,
  onBack,
  onClose,
  onHome,
}: NavigationBarProps) {
  return (
    <nav className="flex h-12 w-full items-center bg-white">
      {variant === 'back' && (
        <NavButton label="뒤로가기" onClick={onBack}>
          <ChevronLeftIcon className="text-grey-900" />
        </NavButton>
      )}

      {variant === 'close' && (
        <NavButton label="닫기" onClick={onClose}>
          <CloseIcon />
        </NavButton>
      )}

      {variant === 'home' && (
        <NavButton label="홈으로" onClick={onHome}>
          <HomeIcon className="text-grey-900" />
        </NavButton>
      )}

      {variant === 'double' && (
        <>
          <div className="flex items-center">{leftSlot}</div>
          <div className="ml-auto">
            <NavButton label="닫기" onClick={onClose}>
              <CloseIcon />
            </NavButton>
          </div>
        </>
      )}
    </nav>
  );
}
