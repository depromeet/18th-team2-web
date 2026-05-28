import { useEffect, useState } from 'react';

import { parseKstDateTime } from '@/utils/date';

// liveStartAt(ISO, KST 벽시계)까지 남은 ms. 값이 없거나 무효면 null.
function getRemainingMs(liveStartAt: string | null | undefined): number | null {
  if (!liveStartAt) return null;
  const target = parseKstDateTime(liveStartAt);
  if (!target.isValid()) return null;
  return Math.max(0, target.valueOf() - Date.now());
}

/**
 * 파티 시작까지 남은 시간을 초 단위로 카운트다운한다.
 * - `isReady`: 유효한 liveStartAt이 있어 카운트다운/게이트 판정이 가능한지
 * - `hasStarted`: 파티 시작 시각 도달 여부 (입장 게이트 기준)
 */
export function usePartyStartCountdown(liveStartAt: string | null | undefined) {
  const [remainingMs, setRemainingMs] = useState(() => getRemainingMs(liveStartAt));

  useEffect(() => {
    setRemainingMs(getRemainingMs(liveStartAt));
    if (!liveStartAt) return;

    const id = setInterval(() => setRemainingMs(getRemainingMs(liveStartAt)), 1000);
    return () => clearInterval(id);
  }, [liveStartAt]);

  if (remainingMs === null) {
    return { isReady: false, minutes: 0, seconds: 0, hasStarted: false };
  }

  const totalSeconds = Math.floor(remainingMs / 1000);
  return {
    isReady: true,
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
    hasStarted: remainingMs <= 0,
  };
}
