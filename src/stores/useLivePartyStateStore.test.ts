import { beforeEach, describe, expect, it } from 'vitest';

import { useLivePartyStateStore } from '@/stores/useLivePartyStateStore';

describe('useLivePartyStateStore', () => {
  beforeEach(() => {
    useLivePartyStateStore.getState().reset();
  });

  it('LIVE_CLOSED 스냅샷만으로 종료 이벤트 누락 상태를 복구한다', () => {
    useLivePartyStateStore.getState().setPartyState({
      partyId: 42,
      status: 'LIVE_CLOSED',
      endedAt: '2026-10-20T20:00:30',
      serverNow: '2026-10-20T20:00:33',
    });

    expect(useLivePartyStateStore.getState().partyEndingState).toMatchObject({
      partyId: 42,
      endedAt: '2026-10-20T20:00:30',
      ended: true,
    });
  });

  it('LIVE_ENDING 스냅샷은 종료 카운트다운 상태로 복구한다', () => {
    useLivePartyStateStore.getState().setPartyState({
      partyId: 42,
      status: 'LIVE_ENDING',
      endingStartedAt: '2026-10-20T20:00:00',
      endedAt: '2026-10-20T20:00:30',
      endingReason: 'HOST_REQUEST',
    });

    expect(useLivePartyStateStore.getState().partyEndingState).toMatchObject({
      partyId: 42,
      endingReason: 'HOST_REQUEST',
      ended: false,
    });
  });
});
