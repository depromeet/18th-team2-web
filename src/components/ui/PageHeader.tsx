import { useNavigate } from 'react-router-dom';

import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H3 } from '@/components/ui/Typography';

interface Props {
  title: string;
  onBack?: () => void;
}

export function PageHeader({ title, onBack }: Props) {
  const navigate = useNavigate();
  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header className="relative flex h-[42px] items-center px-4">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={handleBack}
        className="absolute left-4 top-[9px] flex h-6 w-6 items-center justify-center"
      >
        <ChevronLeftIcon className="text-grey-900" />
      </button>
      <H3 as="h1" className="mx-auto text-grey-900">
        {title}
      </H3>
    </header>
  );
}
