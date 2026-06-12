import { generatePath, useNavigate } from 'react-router-dom';

import { B2, Caption } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import type { ArchiveListItem } from '@/types/archive';
import { STAMP_SRC, getStampForId } from '@/utils/stamp';

interface ArchiveStampCardProps {
  item: ArchiveListItem;
}

export function ArchiveStampCard({ item }: ArchiveStampCardProps) {
  const navigate = useNavigate();
  const stamp = getStampForId(item.partyId);

  const handleClick = () => {
    // 상세 조회는 partyId 필수 — 누락 시 이동하지 않음
    if (!item.partyId) return;
    if (item.type === 'PARTY') {
      navigate(generatePath(ROUTES.archivePartyDetail, { partyId: item.partyId }));
    } else {
      navigate(generatePath(ROUTES.archivePaperDetail, { partyId: item.partyId }));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative block aspect-[343/165] w-full cursor-pointer text-left focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      aria-label={`${item.title} ${item.date}`}
    >
      <img src={STAMP_SRC[stamp]} alt="" aria-hidden className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <B2 as="span" className="text-grey-900 font-semibold">
          {item.title}
        </B2>
        <Caption className="text-grey-600">{item.date}</Caption>
      </div>
    </button>
  );
}
