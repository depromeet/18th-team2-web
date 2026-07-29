import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';

import { PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';
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

export function useLivePartySSE() {
  const [messages, setMessages] = useState<ChatListItem[]>([]);
  const [candleBlowState, setCandleBlowState] = useState<CandleBlowState | null>(null);
  const [burstGameState, setBurstGameState] = useState<BurstGameState | null>(null);
  const [partyEndingState, setPartyEndingState] = useState<RealtimePartyEndingState | null>(null);
  const [currentPhase, setCurrentPhase] = useState<PartyApiPhase | null>(null);
  const [hasParticipantToken, setHasParticipantToken] = useState(false);
  const [sseError, setSseError] = useState(false);
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
  const sseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate: sendMessage } = useSendChatMessage();

  useEffect(() => {
    const { inviteToken, nickname, characterId } = connectParamsRef.current;

    if (!inviteToken || !nickname) {
      return;
    }

    const controller = new AbortController();

    sseTimeoutRef.current = window.setTimeout(() => {
      if (!hasInitializedRef.current) {
        setSseError(true);
      }
    }, 15000);

    connectRealtimeParty(
      {
        inviteToken,
        nickname,
        characterId,
        participantToken: sessionStorage.getItem(PARTICIPANT_TOKEN_KEY),
      },
      ({ event, data }) => {
        try {
          const parsed = JSON.parse(data) as Record<string, unknown>;

          // 최초 입장 이벤트는 1번만 처리
          if (event === 'entered') {
            if (hasInitializedRef.current) {
              return;
            }

            hasInitializedRef.current = true;

            if (sseTimeoutRef.current) {
              clearTimeout(sseTimeoutRef.current);
              sseTimeoutRef.current = null;
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

            const initialMessages = ((parsed.messages as unknown[]) ?? []).map((m) => {
              const msg = m as Record<string, unknown>;

              return {
                type: 'message' as const,
                id: msg.messageId as number,

                user: {
                  name: msg.senderNickname as string,
                  profileImage: resolveImageUrl(msg.senderCharacterImageUrl as string | null),
                  senderRole: msg.senderRole as 'PARTICIPANT' | 'CELEBRANT',
                },

                text: msg.content as string,
              };
            });

            setMessages(initialMessages);

            return;
          }

          if (event === 'message') {
            setMessages((prev) => [
              ...prev,
              {
                type: 'message' as const,
                id: parsed.messageId as number,

                user: {
                  name: parsed.senderNickname as string,
                  profileImage: resolveImageUrl(parsed.senderCharacterImageUrl as string | null),
                  senderRole: parsed.senderRole as 'PARTICIPANT' | 'CELEBRANT',
                },

                text: parsed.content as string,
              },
            ]);

            return;
          }

          if (event === 'user-entered') {
            const userName = (parsed.nickname ?? parsed.senderNickname ?? '') as string;

            setMessages((prev) => [
              ...prev,
              {
                type: 'entry' as const,
                id: Date.now(),
                userName,
              },
            ]);

            queryClient.invalidateQueries({ queryKey: ['party-participants', partyId] });

            return;
          }

          if (event === 'user-left') {
            const userName = (parsed.nickname ?? parsed.senderNickname ?? '') as string;

            setMessages((prev) => [
              ...prev,
              {
                type: 'exit' as const,
                id: Date.now(),
                userName,
              },
            ]);

            queryClient.invalidateQueries({ queryKey: ['party-participants', partyId] });

            return;
          }

          if (
            event === 'candle-blow-started' ||
            event === 'candle-blow-progress' ||
            event === 'candle-blow-ended'
          ) {
            setCandleBlowState(parsed as CandleBlowState);

            return;
          }

          if (
            event === 'burst-game-started' ||
            event === 'burst-game-progress' ||
            event === 'burst-game-ended'
          ) {
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
                totalTapCount: (parsed.totalTapCount as number | undefined) ?? prev?.totalTapCount,
                myTapCount: (parsed.myTapCount as number | undefined) ?? prev?.myTapCount,
                stateVersion: nextStateVersion,
                serverTime: (parsed.serverTime as string | undefined) ?? prev?.serverTime,
                remainingSeconds:
                  (parsed.remainingSeconds as number | undefined) ?? prev?.remainingSeconds,
                rankings: (parsed.rankings as BurstGameState['rankings']) ?? prev?.rankings,
                ended: event === 'burst-game-ended' ? true : prev?.ended,
                status: event === 'burst-game-ended' ? 'ENDED' : 'ACTIVE',
              };
            });

            return;
          }

          if (event === 'fireworks') {
            const participantId = parsed.participantId as number | undefined;
            fire(participantId);

            return;
          }

          if (event === 'party-phase-changed') {
            setCurrentPhase(parsed.phase as PartyApiPhase);

            return;
          }

          if (event === 'party-ending') {
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

          if (event === 'party-ended') {
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
        } catch (err) {
          console.error('[SSE] 이벤트 파싱 실패');
          Sentry.captureException(err, { extra: { message: '[SSE] 이벤트 파싱 실패' } });
        }
      },
      controller.signal,
    ).catch((err) => {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      if ((err as Error & { status?: number }).status === 409) {
        setNicknameDuplicate(true);
        return;
      }

      console.error('[SSE] 연결 오류:', err);
      Sentry.captureException(err, { extra: { message: '[SSE] 연결 오류' } });
    });

    return () => {
      controller.abort();
      if (sseTimeoutRef.current) {
        clearTimeout(sseTimeoutRef.current);
        sseTimeoutRef.current = null;
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
    hasParticipantToken,
    sseError,
    nicknameDuplicate,
  };
}
