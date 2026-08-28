import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WS_EVENT } from '@/constants/live-party';
import type { PartyApiPhase } from '@/services/live-party';
import type { components } from '@/types/api';

export type PartyEndingReason = components['schemas']['RealtimePartyStateResult']['endingReason'];

export interface RealtimePartyEndingState {
  partyId?: number;
  endingStartedAt?: string;
  endedAt?: string;
  endingReason?: PartyEndingReason;
  hostNickname?: string;
  serverNow?: string;
  ended: boolean;
}

interface LivePartyState {
  hasParticipantToken: boolean;
  wsError: boolean;
  nicknameDuplicate: boolean;
  currentPhase: PartyApiPhase | null;
  currentPhaseStartedAt: string | null;
  currentPhaseServerNow: string | null;
  partyEndingState: RealtimePartyEndingState | null;

  setHasParticipantToken: (value: boolean) => void;
  setWsError: (value: boolean) => void;
  setNicknameDuplicate: (value: boolean) => void;
  setPartyPhase: (
    phase: PartyApiPhase,
    phaseStartedAt: string | undefined,
    serverNow: string | undefined,
  ) => void;
  startPartyEnding: (payload: Omit<RealtimePartyEndingState, 'ended'>) => void;
  endParty: (payload: Omit<RealtimePartyEndingState, 'ended' | 'endingStartedAt'>) => void;
}

export const useLivePartyStateStore = create<LivePartyState>()(
  devtools(
    (set) => ({
      hasParticipantToken: false,
      wsError: false,
      nicknameDuplicate: false,
      currentPhase: null,
      currentPhaseStartedAt: null,
      currentPhaseServerNow: null,
      partyEndingState: null,

      setHasParticipantToken: (value) =>
        set({ hasParticipantToken: value }, false, 'setHasParticipantToken'),

      setWsError: (value) => set({ wsError: value }, false, 'setWsError'),

      setNicknameDuplicate: (value) =>
        set({ nicknameDuplicate: value }, false, 'setNicknameDuplicate'),

      setPartyPhase: (phase, phaseStartedAt, serverNow) =>
        set(
          {
            currentPhase: phase,
            currentPhaseStartedAt: phaseStartedAt ?? null,
            currentPhaseServerNow: serverNow ?? null,
          },
          false,
          'setPartyPhase',
        ),

      startPartyEnding: (payload) =>
        set({ partyEndingState: { ...payload, ended: false } }, false, 'startPartyEnding'),

      endParty: (payload) =>
        set(
          (state) => ({
            partyEndingState: {
              ...state.partyEndingState,
              ...payload,
              ended: true,
            },
          }),
          false,
          'endParty',
        ),
    }),
    { name: 'LivePartyStateStore' },
  ),
);

/** 파티 진행 단계/종료 관련 WS 이벤트를 해석해 스토어에 반영. 처리한 이벤트면 true. */
export function applyPartyStateWsEvent(event: string, parsed: Record<string, unknown>) {
  const store = useLivePartyStateStore.getState();

  switch (event) {
    case WS_EVENT.PARTY_PHASE_CHANGED:
      store.setPartyPhase(
        parsed.phase as PartyApiPhase,
        parsed.phaseStartedAt as string | undefined,
        parsed.serverNow as string | undefined,
      );
      return true;

    case WS_EVENT.PARTY_ENDING:
      store.startPartyEnding({
        partyId: parsed.partyId as number | undefined,
        endingStartedAt: parsed.endingStartedAt as string | undefined,
        endedAt: parsed.endedAt as string | undefined,
        endingReason: parsed.endingReason as PartyEndingReason | undefined,
        hostNickname: parsed.hostNickname as string | undefined,
        serverNow: parsed.serverNow as string | undefined,
      });
      return true;

    case WS_EVENT.PARTY_ENDED:
      store.endParty({
        partyId: parsed.partyId as number | undefined,
        endedAt: parsed.endedAt as string | undefined,
        endingReason: parsed.endingReason as PartyEndingReason | undefined,
        hostNickname: parsed.hostNickname as string | undefined,
        serverNow: parsed.serverNow as string | undefined,
      });
      return true;

    default:
      return false;
  }
}
