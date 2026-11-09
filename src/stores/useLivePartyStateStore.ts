import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { WS_EVENT } from '@/constants/live-party';
import type { PartyApiPhase } from '@/services/live-party';
import type { components } from '@/types/api';

export type PartyEndingReason = components['schemas']['RealtimePartyStateResult']['endingReason'];
export type PartyStatus = components['schemas']['RealtimePartyStateResult']['status'];

export interface RealtimePartyEndingState {
  partyId?: number;
  endingStartedAt?: string;
  endedAt?: string;
  endingReason?: PartyEndingReason;
  hostNickname?: string;
  serverNow?: string;
  ended: boolean;
}

export interface RealtimePartyDeletedState {
  partyId?: number;
  reason?: 'HOST_DELETED';
  serverNow?: string;
}

interface PartyStatePayload {
  partyId?: number;
  liveStartAt?: string;
  liveTimerStartedAt?: string;
  liveDeadlineAt?: string;
  status?: PartyStatus;
  endingStartedAt?: string;
  endedAt?: string;
  endingReason?: PartyEndingReason;
  hostNickname?: string;
  serverNow?: string;
}

interface LivePartyState {
  hasParticipantToken: boolean;
  wsError: boolean;
  nicknameDuplicate: boolean;
  currentPhase: PartyApiPhase | null;
  currentPhaseStartedAt: string | null;
  currentPhaseServerNow: string | null;
  partyEndingState: RealtimePartyEndingState | null;
  partyDeletedState: RealtimePartyDeletedState | null;
  // 입장 시 한 번 오는 party-state 스냅샷 — liveStartAt/status는 WS 브로드캐스트로 갱신되지 않는다.
  liveStartAt: string | null;
  liveTimerStartedAt: string | null;
  liveDeadlineAt: string | null;
  status: PartyStatus | null;

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
  deleteParty: (payload: RealtimePartyDeletedState) => void;
  setPartyState: (payload: PartyStatePayload) => void;
  reset: () => void;
}

const initialState = {
  hasParticipantToken: false,
  wsError: false,
  nicknameDuplicate: false,
  currentPhase: null,
  currentPhaseStartedAt: null,
  currentPhaseServerNow: null,
  partyEndingState: null,
  partyDeletedState: null,
  liveStartAt: null,
  liveTimerStartedAt: null,
  liveDeadlineAt: null,
  status: null,
} as const;

export const useLivePartyStateStore = create<LivePartyState>()(
  devtools(
    (set) => ({
      ...initialState,

      reset: () => set({ ...initialState }, false, 'reset'),

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

      deleteParty: (payload) => set({ partyDeletedState: payload }, false, 'deleteParty'),

      setPartyState: (payload) =>
        set(
          (state) => {
            const isClosed =
              payload.status === 'LIVE_CLOSED' || payload.status === 'ROLLING_PAPER_CLOSED';
            const shouldApplyEndingState = isClosed || Boolean(payload.endingStartedAt);

            return {
              liveStartAt: payload.liveStartAt ?? state.liveStartAt,
              liveTimerStartedAt: payload.liveTimerStartedAt ?? state.liveTimerStartedAt,
              liveDeadlineAt: payload.liveDeadlineAt ?? state.liveDeadlineAt,
              status: payload.status ?? state.status,
              // 재연결·REST 복구 스냅샷이 종료 상태라면 party-ended 이벤트 없이도 종료 처리한다.
              partyEndingState: shouldApplyEndingState
                ? {
                    partyId: payload.partyId ?? state.partyEndingState?.partyId,
                    endingStartedAt:
                      payload.endingStartedAt ?? state.partyEndingState?.endingStartedAt,
                    endedAt: payload.endedAt ?? state.partyEndingState?.endedAt,
                    endingReason: payload.endingReason ?? state.partyEndingState?.endingReason,
                    hostNickname: payload.hostNickname ?? state.partyEndingState?.hostNickname,
                    serverNow: payload.serverNow ?? state.partyEndingState?.serverNow,
                    ended: isClosed,
                  }
                : state.partyEndingState,
            };
          },
          false,
          'setPartyState',
        ),
    }),
    { name: 'LivePartyStateStore' },
  ),
);

/** 파티 진행 단계/종료 관련 WS 이벤트를 해석해 스토어에 반영. 처리한 이벤트면 true. */
export function applyPartyStateWsEvent(event: string, parsed: Record<string, unknown>) {
  const store = useLivePartyStateStore.getState();

  switch (event) {
    case WS_EVENT.PARTY_STATE:
      store.setPartyState({
        partyId: parsed.partyId as number | undefined,
        liveStartAt: parsed.liveStartAt as string | undefined,
        liveTimerStartedAt: parsed.liveTimerStartedAt as string | undefined,
        liveDeadlineAt: parsed.liveDeadlineAt as string | undefined,
        status: parsed.status as PartyStatus | undefined,
        endingStartedAt: parsed.endingStartedAt as string | undefined,
        endedAt: parsed.endedAt as string | undefined,
        endingReason: parsed.endingReason as PartyEndingReason | undefined,
        hostNickname: parsed.hostNickname as string | undefined,
        serverNow: parsed.serverNow as string | undefined,
      });
      return true;

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

    case WS_EVENT.PARTY_DELETED:
      store.deleteParty({
        partyId: parsed.partyId as number | undefined,
        reason: parsed.reason as RealtimePartyDeletedState['reason'],
        serverNow: parsed.serverNow as string | undefined,
      });
      return true;

    default:
      return false;
  }
}
