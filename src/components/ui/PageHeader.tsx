import { useNavigate } from 'react-router-dom';

import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H3 } from '@/components/ui/Typography';

interface PageHeaderProps {
  title?: string;
  onBack?: () => void;
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header className="sticky top-0 z-10 flex h-[42px] items-center bg-white px-4">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={handleBack}
        className="absolute top-[9px] left-4 flex h-6 w-6 items-center justify-center"
      >
        <ChevronLeftIcon className="text-grey-900" />
      </button>
      {title && (
        <H3 as="h1" className="text-grey-900 mx-auto">
          {title}
        </H3>
      )}
    </header>
  );
}
