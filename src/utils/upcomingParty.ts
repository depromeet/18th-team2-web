import type { UpcomingParty } from '@/types/home';
import { parseKstDateTime } from '@/utils/date';

const MINUTE_MS = 60 * 1000;
const ENTER_NOTICE_WINDOW_MS = 5 * MINUTE_MS;

interface RealtimeCardTiming {
  isEnterable: boolean;
  noticeText: string | null;
}

function getTimestamp(value?: string) {
  if (!value) return null;

  const dateTime = parseKstDateTime(value);
  return dateTime.isValid() ? dateTime.valueOf() : null;
}

export function getRealtimeCardTiming(party: UpcomingParty, nowMs: number): RealtimeCardTiming {
  if (party.partyOption !== 'REALTIME' || party.isEnded) {
    return { isEnterable: false, noticeText: null };
  }

  const schedule = party.realtimeSchedule;
  const enterableFromMs = getTimestamp(schedule?.enterableFrom);
  const liveStartMs = getTimestamp(schedule?.liveStartAt);
  const liveEndMs = getTimestamp(schedule?.liveEndAt);
  const isClosingOrClosed =
    party.realtimeStatus === 'LIVE_ENDING' ||
    party.realtimeStatus === 'LIVE_CLOSED' ||
    party.realtimeStatus === 'ROLLING_PAPER_CLOSED';
  const isEnterableByTime =
    enterableFromMs != null && liveEndMs != null && enterableFromMs <= nowMs && nowMs < liveEndMs;
  const isEnterable = !isClosingOrClosed && (party.realtimeEnterable || isEnterableByTime);

  if (!isEnterable || liveStartMs == null) {
    return { isEnterable, noticeText: null };
  }

  const remainingMs = liveStartMs - nowMs;

  if (remainingMs <= 0) {
    return {
      isEnterable,
      noticeText: '파티 시작 시간이 되었어요! 지금 바로 입장해주세요!',
    };
  }

  if (remainingMs > ENTER_NOTICE_WINDOW_MS) {
    return { isEnterable, noticeText: null };
  }

  const remainingMinutes = Math.ceil(remainingMs / MINUTE_MS);

  return {
    isEnterable,
    noticeText: `파티 시작이 ${remainingMinutes}분 남았어요! 지금 바로 입장해주세요!`,
  };
}
