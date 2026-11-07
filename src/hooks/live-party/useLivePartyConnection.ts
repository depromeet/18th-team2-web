import { useCallback, useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

import { PARTICIPANT_TOKEN_KEY, WS_ERROR_MESSAGE, WS_EVENT } from '@/constants/live-party';
import {
  connectRealtimeParty,
  getRealtimePartyState,
  useSendChatMessage,
} from '@/services/live-party';
import { useFirecrackerStore } from '@/stores/useFirecrackerStore';
import { applyChatWsEvent, useLivePartyChatStore } from '@/stores/useLivePartyChatStore';
import { applyCandleWsEvent, useLivePartyCandleStore } from '@/stores/useLivePartyCandleStore';
import {
  applyBurstGameWsEvent,
  useLivePartyBurstGameStore,
} from '@/stores/useLivePartyBurstGameStore';
import { applyPartyStateWsEvent, useLivePartyStateStore } from '@/stores/useLivePartyStateStore';
import { parseKstDateTime } from '@/utils/date';

const PARTY_END_RECOVERY_DELAY_MS = 3000;
const PARTY_ENDING_FALLBACK_MS = 30000;

function getTimestamp(value?: string | null) {
  if (!value) return null;

  const dateTime = parseKstDateTime(value);
  return dateTime.isValid() ? dateTime.valueOf() : null;
}

function getPartyEndRecoveryDelay(endingStartedAt?: string, endedAt?: string, serverNow?: string) {
  const endingStartedAtMs = getTimestamp(endingStartedAt);
  const endedAtMs =
    getTimestamp(endedAt) ??
    (endingStartedAtMs == null ? null : endingStartedAtMs + PARTY_ENDING_FALLBACK_MS);

  if (endedAtMs == null) return null;

  const serverNowMs = getTimestamp(serverNow);
  const serverClockOffsetMs = serverNowMs == null ? 0 : Date.now() - serverNowMs;
  const nowOnServer = Date.now() - serverClockOffsetMs;

  return Math.max(0, endedAtMs - nowOnServer) + PARTY_END_RECOVERY_DELAY_MS;
}

function resetLivePartyStores() {
  useLivePartyChatStore.getState().reset();
  useLivePartyCandleStore.getState().reset();
  useLivePartyBurstGameStore.getState().reset();
  useLivePartyStateStore.getState().reset();
}

export function useLivePartyConnection() {
  const { partyId } = useParams<{ partyId: string }>();
  const queryClient = useQueryClient();
  const fire = useFirecrackerStore((state) => state.fire);

  const location = useLocation();

  const locationState = location.state as {
    inviteToken?: string;
    nickname?: string;
    characterId?: number | null;
  } | null;

  const connectParamsRef = useRef({
    inviteToken: locationState?.inviteToken ?? '',
    nickname: locationState?.nickname ?? '',
    characterId: locationState?.characterId,
  });
  connectParamsRef.current = {
    inviteToken: locationState?.inviteToken ?? '',
    nickname: locationState?.nickname ?? '',
    characterId: locationState?.characterId,
  };

  const hasInitializedRef = useRef(false);
  const wsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recoveryInFlightRef = useRef(false);
  const isActiveRef = useRef(true);
  const activePartyIdRef = useRef(partyId);
  activePartyIdRef.current = partyId;
  const partyEndingState = useLivePartyStateStore((state) => state.partyEndingState);
  const endingStartedAt = partyEndingState?.endingStartedAt;
  const endingEndsAt = partyEndingState?.endedAt;
  const endingServerNow = partyEndingState?.serverNow;
  const isPartyEnded = partyEndingState?.ended ?? false;

  const { mutate: sendMessage } = useSendChatMessage();

  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
    };
  }, [partyId]);

  const recoverPartyState = useCallback(async () => {
    if (!partyId || recoveryInFlightRef.current) return;

    recoveryInFlightRef.current = true;

    try {
      const state = await getRealtimePartyState(partyId);
      if (state && isActiveRef.current && activePartyIdRef.current === partyId) {
        useLivePartyStateStore.getState().setPartyState(state);
      }
    } catch (err) {
      Sentry.captureException(err, { extra: { message: '실시간 파티 종료 상태 복구 실패' } });
    } finally {
      recoveryInFlightRef.current = false;
    }
  }, [partyId]);

  useEffect(() => {
    if (isPartyEnded) return;

    const recoveryDelay = getPartyEndRecoveryDelay(endingStartedAt, endingEndsAt, endingServerNow);
    if (recoveryDelay == null) return;

    const timerId = window.setTimeout(() => {
      void recoverPartyState();
    }, recoveryDelay);

    return () => window.clearTimeout(timerId);
  }, [endingEndsAt, endingServerNow, endingStartedAt, isPartyEnded, recoverPartyState]);

  useEffect(() => {
    const { inviteToken, nickname, characterId } = connectParamsRef.current;

    // 새 파티 진입 시 이전 파티의 단계·종료·게임 상태가 잠시라도 노출되지 않도록 먼저 정리한다.
    resetLivePartyStores();

    if (!inviteToken || !nickname) {
      return resetLivePartyStores;
    }

    const controller = new AbortController();

    wsTimeoutRef.current = window.setTimeout(() => {
      if (!hasInitializedRef.current) {
        controller.abort();
        useLivePartyStateStore.getState().setWsError(true);
      }
    }, 15000);

    connectRealtimeParty(
      {
        partyId: partyId ?? '',
        inviteToken,
        nickname,
        characterId,
        participantToken: sessionStorage.getItem(PARTICIPANT_TOKEN_KEY),
      },
      ({ event, data }) => {
        let parsed: Record<string, unknown>;

        try {
          const result = JSON.parse(data) as unknown;

          if (typeof result !== 'object' || result === null || Array.isArray(result)) {
            throw new Error(`Unexpected WebSocket payload shape for event "${event}"`);
          }

          parsed = result as Record<string, unknown>;
        } catch (err) {
          console.error(WS_ERROR_MESSAGE.PARSE_FAILED);
          Sentry.captureException(err, { extra: { message: WS_ERROR_MESSAGE.PARSE_FAILED } });
          return;
        }

        try {
          // 입장(핸드셰이크): participantToken 저장·초기 메시지·쿼리 무효화가 한 이벤트에 얽혀있어
          // 특정 도메인에 넣기보다 연결 훅에서 직접 조율한다.
          if (event === WS_EVENT.ENTERED) {
            const isFirstEntry = !hasInitializedRef.current;

            if (isFirstEntry && wsTimeoutRef.current) {
              clearTimeout(wsTimeoutRef.current);
              wsTimeoutRef.current = null;
            }

            hasInitializedRef.current = true;

            const token = parsed.participantToken as string | undefined;

            if (token) {
              sessionStorage.setItem(PARTICIPANT_TOKEN_KEY, token);
            }

            // entered = 서버가 연결을 승인. 토큰이 세션에 있으면 API 호출 허용.
            if (sessionStorage.getItem(PARTICIPANT_TOKEN_KEY)) {
              useLivePartyStateStore.getState().setHasParticipantToken(true);
            }

            queryClient.invalidateQueries({ queryKey: ['partyPhase', partyId] });
            queryClient.invalidateQueries({ queryKey: ['realtime-profile'] });

            if (isFirstEntry) {
              useLivePartyChatStore
                .getState()
                .setInitialMessages((parsed.messages as unknown[]) ?? []);
            }

            if (
              parsed.liveStartAt ||
              parsed.liveTimerStartedAt ||
              parsed.liveDeadlineAt ||
              parsed.status ||
              parsed.endingStartedAt
            ) {
              applyPartyStateWsEvent(WS_EVENT.PARTY_STATE, parsed);
            }

            return;
          }

          if (event === WS_EVENT.PARTY_PHASE_CHANGED) {
            queryClient.invalidateQueries({ queryKey: ['realtime-party-state', partyId] });
          }

          if (applyChatWsEvent(event, parsed, { queryClient, partyId })) return;
          if (applyCandleWsEvent(event, parsed)) return;
          if (applyBurstGameWsEvent(event, parsed)) return;
          if (applyPartyStateWsEvent(event, parsed)) return;

          if (event === WS_EVENT.FIREWORKS) {
            fire(parsed.participantId as number | undefined);
          }
        } catch (err) {
          console.error(WS_ERROR_MESSAGE.HANDLE_FAILED);
          Sentry.captureException(err, { extra: { message: WS_ERROR_MESSAGE.HANDLE_FAILED } });
        }
      },
      controller.signal,
      {
        onReconnectError: () => {
          void recoverPartyState();
        },
      },
    ).catch((err) => {
      if (wsTimeoutRef.current) {
        clearTimeout(wsTimeoutRef.current);
        wsTimeoutRef.current = null;
      }

      controller.abort();

      if ((err as Error & { status?: number }).status === 409) {
        useLivePartyStateStore.getState().setNicknameDuplicate(true);
        return;
      }

      useLivePartyStateStore.getState().setWsError(true);
      console.error(WS_ERROR_MESSAGE.CONNECTION_FAILED, err);
      Sentry.captureException(err, { extra: { message: WS_ERROR_MESSAGE.CONNECTION_FAILED } });
    });

    return () => {
      controller.abort();
      hasInitializedRef.current = false;
      if (wsTimeoutRef.current) {
        clearTimeout(wsTimeoutRef.current);
        wsTimeoutRef.current = null;
      }
      resetLivePartyStores();
    };
  }, [partyId, queryClient, fire, recoverPartyState]);

  const addMessage = (text: string) => {
    if (!text.trim() || !partyId) {
      return;
    }

    sendMessage({ partyId, content: text });
  };

  return { addMessage };
}
