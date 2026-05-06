import stampCandle from '@/assets/images/stamps/stamp-candle-long.png';
import stampDonut from '@/assets/images/stamps/stamp-donut-long.png';
import stampFirework from '@/assets/images/stamps/stamp-firework-long.png';
import stampRollcake from '@/assets/images/stamps/stamp-rollcake-long.png';
import stampStrawberry from '@/assets/images/stamps/stamp-strawberry-long.png';
import type { StampType } from '@/types/archive';

const STAMPS: readonly StampType[] = [
  'strawberry',
  'candle',
  'firework',
  'rollcake',
  'donut',
] as const;

export const STAMP_SRC: Record<StampType, string> = {
  strawberry: stampStrawberry,
  candle: stampCandle,
  firework: stampFirework,
  rollcake: stampRollcake,
  donut: stampDonut,
};

// BE에서 stamp 필드가 누락된 경우 fallback. id 기반 결정적 매핑.
export function getStampForId(id: string): StampType {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % STAMPS.length;
  return STAMPS[index];
}
