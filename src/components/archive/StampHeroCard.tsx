import stampCandle from '@/assets/images/stamps/stamp-candle-long.svg';
import stampDonut from '@/assets/images/stamps/stamp-donut-long.svg';
import stampFirework from '@/assets/images/stamps/stamp-firework-long.svg';
import stampRollcake from '@/assets/images/stamps/stamp-rollcake-long.svg';
import stampStrawberry from '@/assets/images/stamps/stamp-strawberry-long.svg';
import type { StampType } from '@/types/archive';
import { getStampForId } from '@/utils/stamp';

const STAMP_SRC: Record<StampType, string> = {
  strawberry: stampStrawberry,
  candle: stampCandle,
  firework: stampFirework,
  rollcake: stampRollcake,
  donut: stampDonut,
};

interface Props {
  id: string;
  stamp?: StampType;
}

export function StampHeroCard({ id, stamp }: Props) {
  const resolved = stamp ?? getStampForId(id);
  return (
    <div className="px-4 pt-3 pb-4">
      <div className="relative w-full" style={{ aspectRatio: '343 / 165' }}>
        <img
          src={STAMP_SRC[resolved]}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </div>
  );
}
