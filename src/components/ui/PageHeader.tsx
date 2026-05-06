import type { ReactNode } from 'react';

import { useNavigate } from 'react-router-dom';

import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { HomeIcon } from '@/components/ui/icons/HomeIcon';
import { H3 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';

type PageHeaderVariant = 'back' | 'close' | 'home' | 'double';

interface PageHeaderProps {
  variant?: PageHeaderVariant;
  title?: string;
  leftSlot?: ReactNode;
  onBack?: () => void;
  onClose?: () => void;
  onHome?: () => void;
}

interface PageHeaderButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

function PageHeaderButton({ label, onClick, className = 'left-4', children }: PageHeaderButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-[9px] flex h-6 w-6 items-center justify-center ${className}`}
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
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));
  const handleHome = onHome ?? (() => navigate(ROUTES.home));

  return (
    <header className="sticky top-0 z-10 flex h-[42px] items-center bg-white px-4">
      {variant === 'back' && (
        <PageHeaderButton label="뒤로가기" onClick={handleBack}>
          <ChevronLeftIcon className="text-grey-900" />
        </PageHeaderButton>
      )}

      {variant === 'close' && (
        <PageHeaderButton label="닫기" onClick={onClose}>
          <CloseIcon className="text-grey-900" />
        </PageHeaderButton>
      )}

      {variant === 'home' && (
        <PageHeaderButton label="홈으로" onClick={handleHome}>
          <HomeIcon className="text-grey-900" />
        </PageHeaderButton>
      )}

      {variant === 'double' && (
        <>
          <div className="absolute top-[9px] left-4 flex h-6 items-center">{leftSlot}</div>
          <PageHeaderButton label="닫기" onClick={onClose} className="right-4">
            <CloseIcon className="text-grey-900" />
          </PageHeaderButton>
        </>
      )}

      {title && (
        <H3 as="h1" className="mx-auto text-grey-900">
          {title}
        </H3>
      )}
    </header>
  );
}
