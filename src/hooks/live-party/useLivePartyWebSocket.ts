import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

import { PARTICIPANT_TOKEN_KEY, WS_ERROR_MESSAGE, WS_EVENT } from '@/constants/live-party';
import {
  connectRealtimeParty,
  useSendChatMessage,
  type PartyApiPhase,
} from '@/services/live-party';
import type { ChatListItem } from '@/hooks/live-party/useChatBottomSheet';
import { resolveImageUrl } from '@/utils/image';
import type { components } from '@/types/api';
import { useFirecrackerStore } from '@/stores/useFirecrackerStore';

type CandleBlowState = components['schemas']['CandleBlowResponse'];
export type BurstGameState = Partial<components['schemas']['BurstGameStateResponse']> & {
  status?: 'ACTIVE' | 'ENDED';
};
type PartyEndingReason = components['schemas']['RealtimePartyStateResult']['endingReason'];

export interface RealtimePartyEndingState {
  partyId?: number;
  endingStartedAt?: string;
  endedAt?: string;
  endingReason?: PartyEndingReason;
  hostNickname?: string;
  ended: boolean;
}

function shouldUpdateBurstGameState(
  currentState: BurstGameState | null,
  nextStateVersion: number | undefined,
) {
  if (nextStateVersion == null || currentState?.stateVersion == null) {
    return true;
  }

  return nextStateVersion >= currentState.stateVersion;
}

function toChatMessage(raw: Record<string, unknown>): Extract<ChatListItem, { type: 'message' }> {
  return {
    type: 'message',
    id: raw.messageId as number,
    user: {
      name: raw.senderNickname as string,
      profileImage: resolveImageUrl(raw.senderCharacterImageUrl as string | null),
      senderRole: raw.senderRole as 'PARTICIPANT' | 'CELEBRANT',
    },
    text: raw.content as string,
  };
}

export function useLivePartyWebSocket() {
  const [messages, setMessages] = useState<ChatListItem[]>([]);
  const [candleBlowState, setCandleBlowState] = useState<CandleBlowState | null>(null);
  const [burstGameState, setBurstGameState] = useState<BurstGameState | null>(null);
  const [partyEndingState, setPartyEndingState] = useState<RealtimePartyEndingState | null>(null);
  const [currentPhase, setCurrentPhase] = useState<PartyApiPhase | null>(null);
  const [currentPhaseStartedAt, setCurrentPhaseStartedAt] = useState<string | null>(null);
  const [currentPhaseServerNow, setCurrentPhaseServerNow] = useState<string | null>(null);
  const [hasParticipantToken, setHasParticipantToken] = useState(false);
  const [wsError, setWsError] = useState(false);
  const [nicknameDuplicate, setNicknameDuplicate] = useState(false);

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

    const controller = new AbortController();

    wsTimeoutRef.current = window.setTimeout(() => {
      if (!hasInitializedRef.current) {
        setWsError(true);
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
          switch (event) {
            // 실시간 파티 입장
            case WS_EVENT.ENTERED: {
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
                setHasParticipantToken(true);
              }

              queryClient.invalidateQueries({ queryKey: ['partyPhase', partyId] });
              queryClient.invalidateQueries({ queryKey: ['realtime-profile'] });

              const initialMessages = ((parsed.messages as unknown[]) ?? []).map((m) =>
                toChatMessage(m as Record<string, unknown>),
              );

              setMessages(initialMessages);

              return;
            }

            // 실시간 파티 메시지 수신
            case WS_EVENT.MESSAGE: {
              setMessages((prev) => [...prev, toChatMessage(parsed)]);

              return;
            }

            // 실시간 파티 유저 입장
            case WS_EVENT.USER_ENTERED: {
              const userName = (parsed.nickname ?? parsed.senderNickname ?? '') as string;

              setMessages((prev) => [
                ...prev,
                { type: 'entry' as const, id: Date.now(), userName },
              ]);
              queryClient.invalidateQueries({ queryKey: ['party-participants', partyId] });

              return;
            }

            // 실시간 파티 유저 퇴장
            case WS_EVENT.USER_LEFT: {
              const userName = (parsed.nickname ?? parsed.senderNickname ?? '') as string;

              setMessages((prev) => [...prev, { type: 'exit' as const, id: Date.now(), userName }]);
              queryClient.invalidateQueries({ queryKey: ['party-participants', partyId] });

              return;
            }

            // 촛불 불기
            case WS_EVENT.CANDLE_BLOW_STARTED:
            case WS_EVENT.CANDLE_BLOW_PROGRESS:
            case WS_EVENT.CANDLE_BLOW_ENDED: {
              setCandleBlowState(parsed as CandleBlowState);

              return;
            }

            // 박 깨기
            case WS_EVENT.BURST_GAME_STARTED:
            case WS_EVENT.BURST_GAME_PROGRESS:
            case WS_EVENT.BURST_GAME_ENDED: {
              setBurstGameState((prev) => {
                const nextStateVersion = parsed.stateVersion as number | undefined;

                if (!shouldUpdateBurstGameState(prev, nextStateVersion)) {
                  return prev;
                }

                return {
                  ...prev,
                  partyId: (parsed.partyId as number | undefined) ?? prev?.partyId,
                  startedAt: (parsed.startedAt as string | undefined) ?? prev?.startedAt,
                  endsAt: (parsed.endsAt as string | undefined) ?? prev?.endsAt,
                  totalTapCount:
                    (parsed.totalTapCount as number | undefined) ?? prev?.totalTapCount,
                  myTapCount: (parsed.myTapCount as number | undefined) ?? prev?.myTapCount,
                  stateVersion: nextStateVersion,
                  serverTime: (parsed.serverTime as string | undefined) ?? prev?.serverTime,
                  remainingSeconds:
                    (parsed.remainingSeconds as number | undefined) ?? prev?.remainingSeconds,
                  rankings: (parsed.rankings as BurstGameState['rankings']) ?? prev?.rankings,
                  ended: event === WS_EVENT.BURST_GAME_ENDED ? true : prev?.ended,
                  status: event === WS_EVENT.BURST_GAME_ENDED ? 'ENDED' : 'ACTIVE',
                };
              });

              return;
            }

            // 폭죽 터뜨리기
            case WS_EVENT.FIREWORKS: {
              const participantId = parsed.participantId as number | undefined;
              fire(participantId);

              return;
            }

            // 실시간 파티 상태 변경
            case WS_EVENT.PARTY_PHASE_CHANGED: {
              setCurrentPhase(parsed.phase as PartyApiPhase);
              setCurrentPhaseStartedAt((parsed.phaseStartedAt as string | undefined) ?? null);
              setCurrentPhaseServerNow((parsed.serverNow as string | undefined) ?? null);

              return;
            }

            // 실시간 파티 종료 시작
            case WS_EVENT.PARTY_ENDING: {
              setPartyEndingState({
                partyId: parsed.partyId as number | undefined,
                endingStartedAt: parsed.endingStartedAt as string | undefined,
                endedAt: parsed.endedAt as string | undefined,
                endingReason: parsed.endingReason as PartyEndingReason | undefined,
                hostNickname: parsed.hostNickname as string | undefined,
                ended: false,
              });

              return;
            }

            // 실시간 파티 종료
            case WS_EVENT.PARTY_ENDED: {
              setPartyEndingState((prev) => ({
                ...prev,
                partyId: parsed.partyId as number | undefined,
                endedAt: parsed.endedAt as string | undefined,
                endingReason:
                  (parsed.endingReason as PartyEndingReason | undefined) ?? prev?.endingReason,
                hostNickname: (parsed.hostNickname as string | undefined) ?? prev?.hostNickname,
                ended: true,
              }));

              return;
            }

            default:
              return;
          }
        } catch (err) {
          console.error(WS_ERROR_MESSAGE.HANDLE_FAILED);
          Sentry.captureException(err, { extra: { message: WS_ERROR_MESSAGE.HANDLE_FAILED } });
        }
      },
      controller.signal,
    ).catch((err) => {
      if ((err as Error & { status?: number }).status === 409) {
        setNicknameDuplicate(true);
        return;
      }

      console.error(WS_ERROR_MESSAGE.CONNECTION_FAILED, err);
      Sentry.captureException(err, { extra: { message: WS_ERROR_MESSAGE.CONNECTION_FAILED } });
    });

    return () => {
      controller.abort();
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

  return {
    messages,
    addMessage,
    candleBlowState,
    burstGameState,
    partyEndingState,
    currentPhase,
    currentPhaseStartedAt,
    currentPhaseServerNow,
    hasParticipantToken,
    wsError,
    nicknameDuplicate,
  };
}
