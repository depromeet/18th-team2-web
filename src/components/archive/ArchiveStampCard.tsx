import { generatePath, useNavigate } from 'react-router-dom';

import stampCandle from '@/assets/images/stamps/stamp-candle-long.svg';
import stampDonut from '@/assets/images/stamps/stamp-donut-long.svg';
import stampFirework from '@/assets/images/stamps/stamp-firework-long.svg';
import stampRollcake from '@/assets/images/stamps/stamp-rollcake-long.svg';
import stampStrawberry from '@/assets/images/stamps/stamp-strawberry-long.svg';
import { B2, Caption } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import type { ArchiveListItem, StampType } from '@/types/archive';
import { getStampForId } from '@/utils/stamp';

const STAMP_SRC: Record<StampType, string> = {
  strawberry: stampStrawberry,
  candle: stampCandle,
  firework: stampFirework,
  rollcake: stampRollcake,
  donut: stampDonut,
};

interface Props {
  item: ArchiveListItem;
}

export function ArchiveStampCard({ item }: Props) {
  const navigate = useNavigate();
  const stamp = item.stamp ?? getStampForId(item.id);

  const handleClick = () => {
    if (item.type === 'PARTY') {
      navigate(generatePath(ROUTES.archivePartyDetail, { partyId: item.id }));
    } else {
      navigate(generatePath(ROUTES.rollingPaper, { id: item.id }));
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative block w-full cursor-pointer text-left"
      style={{ aspectRatio: '343 / 165' }}
      aria-label={`${item.title} ${item.date}`}
    >
      <img
        src={STAMP_SRC[stamp]}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
        <B2 as="span" className="font-semibold text-grey-900">
          {item.title}
        </B2>
        <Caption className="text-grey-600">{item.date}</Caption>
      </div>
    </button>
  );
}
