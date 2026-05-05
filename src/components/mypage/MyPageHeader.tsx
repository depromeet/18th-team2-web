import { useNavigate } from 'react-router-dom';

import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H3 } from '@/components/ui/Typography';

export function MyPageHeader() {
  const navigate = useNavigate();

  return (
    <header className="relative flex h-12 items-center justify-center">
      <button
        type="button"
        aria-label="뒤로 가기"
        className="absolute left-1 flex h-12 w-12 items-center justify-center"
        onClick={() => navigate(-1)}
      >
        <ChevronLeftIcon />
      </button>
      <H3 className="text-grey-900">계정 관리</H3>
    </header>
  );
}
