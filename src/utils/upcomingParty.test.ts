import { describe, expect, it } from 'vitest';

import { PARTY_ROLE } from '@/constants/party';
import type { UpcomingParty } from '@/types/home';
import { parseKstDateTime } from '@/utils/date';
import { getRealtimeCardTiming } from '@/utils/upcomingParty';

function createRealtimeParty(): UpcomingParty {
  return {
    partyName: '내 생일파티',
    date: '26.10.20',
    time: '오전 11:45',
    role: PARTY_ROLE.HOST,
    partyOption: 'REALTIME',
    isOpen: true,
    isEnded: false,
    realtimeEnterable: true,
    realtimeStatus: 'LIVE_OPEN',
    realtimeSchedule: {
      enterableFrom: '2026-10-20T11:40:00+09:00',
      liveStartAt: '2026-10-20T11:45:00+09:00',
      liveEndAt: '2026-10-20T12:15:00+09:00',
    },
  };
}

describe('getRealtimeCardTiming', () => {
  it('예약 시작 2분 전이면 실제 남은 분을 안내한다', () => {
    const party = createRealtimeParty();
    const nowMs = parseKstDateTime('2026-10-20T11:43:00+09:00').valueOf();

    expect(getRealtimeCardTiming(party, nowMs)).toEqual({
      isEnterable: true,
      noticeText: '파티 시작이 2분 남았어요! 지금 바로 입장해주세요!',
    });
  });

  it('예약 시작 시각이 지나면 5분 전 문구 대신 시작 안내를 표시한다', () => {
    const party = createRealtimeParty();
    party.time = '오전 11:30';
    party.realtimeSchedule = {
      enterableFrom: '2026-10-20T11:25:00+09:00',
      liveStartAt: '2026-10-20T11:30:00+09:00',
      liveEndAt: '2026-10-20T12:00:00+09:00',
    };
    const nowMs = parseKstDateTime('2026-10-20T11:31:00+09:00').valueOf();

    expect(getRealtimeCardTiming(party, nowMs)).toEqual({
      isEnterable: true,
      noticeText: '파티 시작 시간이 되었어요! 지금 바로 입장해주세요!',
    });
  });

  it('종료 처리 중에는 입장 안내를 표시하지 않는다', () => {
    const party = createRealtimeParty();
    party.realtimeStatus = 'LIVE_ENDING';
    const nowMs = parseKstDateTime('2026-10-20T11:43:00+09:00').valueOf();

    expect(getRealtimeCardTiming(party, nowMs)).toEqual({
      isEnterable: false,
      noticeText: null,
    });
  });
});
