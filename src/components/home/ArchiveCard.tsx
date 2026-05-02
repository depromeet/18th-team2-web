import { useNavigate } from 'react-router-dom';

import { H2, Caption } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';

interface ArchiveCardProps {
  count: number;
}

export function ArchiveCard({ count }: ArchiveCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="relative h-30 w-full cursor-pointer rounded-[20px] text-left"
      style={{ background: 'linear-gradient(130.25deg, #F9F6D8 0%, #FFF0F7 68.04%)' }}
      onClick={() => navigate(ROUTES.archive)}
    >
      <div className="absolute top-5 left-5 flex items-center gap-1.5">
        <H2>보관함</H2>
        {count > 0 && (
          <Caption className="font-semibold text-blue-500">{count}개</Caption>
        )}
      </div>
    </button>
  );
}
