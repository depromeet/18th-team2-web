import type { StampType } from '@/types/archive';

const STAMPS: readonly StampType[] = [
  'strawberry',
  'candle',
  'firework',
  'rollcake',
  'donut',
] as const;

export function getStampForId(id: string): StampType {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % STAMPS.length;
  return STAMPS[index];
}
