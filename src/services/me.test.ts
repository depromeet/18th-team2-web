import { afterEach, describe, expect, it, vi } from 'vitest';

import { deriveDisplayState } from '@/services/me';
import type { components } from '@/types/api';

type UpcomingPartyResponse = components['schemas']['UpcomingPartyResponse'];

function paperOnlyParty(overrides: Partial<UpcomingPartyResponse> = {}): UpcomingPartyResponse {
  return {
    partyId: 1,
    inviteToken: 'invite-token',
    partyOption: 'PAPER_ONLY',
    celebrantNickname: '홍길동',
    partyStartedAt: '2026-11-23T00:00:00+09:00',
    partyEndedAt: '2026-11-30T22:00:00+09:00',
    isHost: true,
    rollingPaperWritten: false,
    hostRollingPaperOpenAt: '2026-11-23T22:00:00+09:00',
    hostRollingPaperNoticePending: false,
    realtimeEnterable: false,
    ...overrides,
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('deriveDisplayState', () => {
  it('롤링페이퍼 작성 마감 시각이 지나면 마감 상태로 매핑한다', () => {
    vi.spyOn(Date, 'now').mockReturnValue(new Date('2026-12-01T00:00:00+09:00').getTime());

    expect(deriveDisplayState(paperOnlyParty())).toEqual({
      isOpen: true,
      isEnded: true,
    });
  });
});
