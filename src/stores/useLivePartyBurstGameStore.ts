import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WS_EVENT } from '@/constants/live-party';
import type { components } from '@/types/api';

export type BurstGameState = Partial<components['schemas']['BurstGameStateResponse']> & {
  status?: 'ACTIVE' | 'ENDED';
};

function shouldUpdateBurstGameState(
  currentState: BurstGameState | null,
  nextStateVersion: number | undefined,
) {
  if (nextStateVersion == null || currentState?.stateVersion == null) {
    return true;
  }

  return nextStateVersion >= currentState.stateVersion;
}

interface LivePartyBurstGameState {
  burstGameState: BurstGameState | null;
  updateBurstGameState: (parsed: Record<string, unknown>, isEnded: boolean) => void;
}

export const useLivePartyBurstGameStore = create<LivePartyBurstGameState>()(
  devtools(
    (set, get) => ({
      burstGameState: null,

      updateBurstGameState: (parsed, isEnded) => {
        const prev = get().burstGameState;
        const nextStateVersion = parsed.stateVersion as number | undefined;

        if (!shouldUpdateBurstGameState(prev, nextStateVersion)) {
          return;
        }

        set(
          {
            burstGameState: {
              ...prev,
              partyId: (parsed.partyId as number | undefined) ?? prev?.partyId,
              startedAt: (parsed.startedAt as string | undefined) ?? prev?.startedAt,
              endsAt: (parsed.endsAt as string | undefined) ?? prev?.endsAt,
              totalTapCount: (parsed.totalTapCount as number | undefined) ?? prev?.totalTapCount,
              myTapCount: (parsed.myTapCount as number | undefined) ?? prev?.myTapCount,
              stateVersion: nextStateVersion,
              serverTime: (parsed.serverTime as string | undefined) ?? prev?.serverTime,
              remainingSeconds:
                (parsed.remainingSeconds as number | undefined) ?? prev?.remainingSeconds,
              rankings: (parsed.rankings as BurstGameState['rankings']) ?? prev?.rankings,
              ended: isEnded ? true : prev?.ended,
              status: isEnded ? 'ENDED' : 'ACTIVE',
            },
          },
          false,
          'updateBurstGameState',
        );
      },
    }),
    { name: 'LivePartyBurstGameStore' },
  ),
);

/** 박터뜨리기 관련 WS 이벤트를 해석해 스토어에 반영. 처리한 이벤트면 true. */
export function applyBurstGameWsEvent(event: string, parsed: Record<string, unknown>) {
  switch (event) {
    case WS_EVENT.BURST_GAME_STARTED:
    case WS_EVENT.BURST_GAME_PROGRESS:
    case WS_EVENT.BURST_GAME_ENDED:
      useLivePartyBurstGameStore
        .getState()
        .updateBurstGameState(parsed, event === WS_EVENT.BURST_GAME_ENDED);
      return true;

    default:
      return false;
  }
}
