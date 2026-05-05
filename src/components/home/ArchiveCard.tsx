import { useNavigate } from 'react-router-dom';

import { ArchiveStampCard } from '@/components/archive/ArchiveStampCard';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { B1, H2 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import type { ArchiveListItem } from '@/types/archive';

interface ArchiveCardProps {
  count: number;
  previewItem?: ArchiveListItem;
}

export function ArchiveCard({ count, previewItem }: ArchiveCardProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col bg-white">
      <button
        type="button"
        onClick={() => navigate(ROUTES.archive)}
        className="flex w-full cursor-pointer items-center justify-between px-5 py-5"
      >
        <div className="flex items-start gap-1">
          <H2 as="span" className="text-black">
            보관함
          </H2>
          {count > 0 && <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-400" />}
        </div>
        <div className="flex items-center gap-0">
          <B1 className="text-grey-600 text-right font-medium">{count}</B1>
          <ChevronRightIcon className="text-grey-400 h-5 w-5" />
        </div>
      </button>
      {previewItem && (
        <div className="px-4">
          <ArchiveStampCard item={previewItem} />
        </div>
      )}
    </div>
  );
}
