import { describe, expect, it } from 'vitest';

import { PARTY_ROLE } from '@/constants/party';
import type { UpcomingParty } from '@/types/home';
import { getCardRoutePath } from '@/utils/homeRoute';

function createPaperOnlyParty(overrides: Partial<UpcomingParty> = {}): UpcomingParty {
  return {
    partyId: '42',
    inviteToken: 'invite-token',
    partyName: '내 롤링페이퍼',
    date: '26.10.29',
    realtimeEnterable: false,
    role: PARTY_ROLE.HOST,
    partyOption: 'PAPER_ONLY',
    isOpen: false,
    isEnded: false,
    ...overrides,
  };
}

describe('getCardRoutePath', () => {
  it('롤링페이퍼 전용 파티 주최자는 공개 전에도 작성 현황 화면으로 이동한다', () => {
    expect(getCardRoutePath(createPaperOnlyParty())).toBe('/rolling-paper/42');
  });

  it('롤링페이퍼 전용 파티 참가자는 기존처럼 초대장으로 이동한다', () => {
    expect(getCardRoutePath(createPaperOnlyParty({ role: PARTY_ROLE.PARTICIPANT }))).toBe(
      '/invite/invite-token',
    );
  });
});
