import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/routes';

interface ArchiveCardProps {
  count: number;
}

export function ArchiveCard({ count }: ArchiveCardProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="flex h-30 w-full cursor-pointer items-start justify-between rounded-[20px] p-5 text-left"
      style={{ background: 'linear-gradient(130.25deg, #F9F6D8 0%, #FFF0F7 68.04%)' }}
      onClick={() => navigate(ROUTES.archive)}
    >
      <div className="flex items-start gap-1">
        <span className="text-head-2 font-semibold tracking-tight">보관함</span>
        {count > 0 && <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-400" />}
      </div>
      {count > 0 && <span className="text-head-3 text-grey-600 font-medium">{count}개</span>}
    </button>
  );
}
