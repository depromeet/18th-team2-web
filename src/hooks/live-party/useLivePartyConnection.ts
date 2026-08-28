import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

import { PARTICIPANT_TOKEN_KEY, WS_ERROR_MESSAGE, WS_EVENT } from '@/constants/live-party';
import { connectRealtimeParty, useSendChatMessage } from '@/services/live-party';
import { useFirecrackerStore } from '@/stores/useFirecrackerStore';
import { applyChatWsEvent, useLivePartyChatStore } from '@/stores/useLivePartyChatStore';
import { applyCandleWsEvent, useLivePartyCandleStore } from '@/stores/useLivePartyCandleStore';
import {
  applyBurstGameWsEvent,
  useLivePartyBurstGameStore,
} from '@/stores/useLivePartyBurstGameStore';
import { applyPartyStateWsEvent, useLivePartyStateStore } from '@/stores/useLivePartyStateStore';

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

  const hasInitializedRef = useRef(false);
  const wsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate: sendMessage } = useSendChatMessage();

  useEffect(() => {
    const { inviteToken, nickname, characterId } = connectParamsRef.current;

    if (!inviteToken || !nickname) {
      return;
    }

    // 파티 전환 시 이전 파티의 잔여 상태(종료 플래그, participantToken 등)가
    // 새 파티로 새어 들어가지 않도록 연결 시작 시점에 전부 초기화한다.
    useLivePartyChatStore.getState().reset();
    useLivePartyCandleStore.getState().reset();
    useLivePartyBurstGameStore.getState().reset();
    useLivePartyStateStore.getState().reset();

    const controller = new AbortController();

    wsTimeoutRef.current = window.setTimeout(() => {
      if (!hasInitializedRef.current) {
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
            if (hasInitializedRef.current) {
              return;
            }

            hasInitializedRef.current = true;

            if (wsTimeoutRef.current) {
              clearTimeout(wsTimeoutRef.current);
              wsTimeoutRef.current = null;
            }

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

            useLivePartyChatStore
              .getState()
              .setInitialMessages((parsed.messages as unknown[]) ?? []);

            return;
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
    ).catch((err) => {
      if ((err as Error & { status?: number }).status === 409) {
        useLivePartyStateStore.getState().setNicknameDuplicate(true);
        return;
      }

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
    };
  }, [partyId, queryClient, fire]);

  const addMessage = (text: string) => {
    if (!text.trim() || !partyId) {
      return;
    }

    sendMessage({ partyId, content: text });
  };

  return { addMessage };
}
