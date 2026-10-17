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
 * 파티 시작까지 남은 시간을 1초마다 갱신해 시작 여부를 판정한다.
 * 5분 전 입장 게이트는 초대장 화면에서 처리하므로 여기서는 다루지 않는다.
 * - `isReady`: 유효한 liveStartAt이 있어 판정이 가능한지
 * - `hasStarted`: 파티 시작 시각 도달 여부
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
    return { isReady: false, hasStarted: false };
  }

  return {
    isReady: true,
    hasStarted: remainingMs <= 0,
  };
}
