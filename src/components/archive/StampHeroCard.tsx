import type { StampType } from '@/types/archive';
import { STAMP_SRC, getStampForId } from '@/utils/stamp';

interface StampHeroCardProps {
  id: string;
  stamp?: StampType;
}

export function StampHeroCard({ id, stamp }: StampHeroCardProps) {
  const resolved = stamp ?? getStampForId(id);
  return (
    <div className="px-4 pt-3 pb-4">
      <div className="relative aspect-[343/165] w-full">
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
