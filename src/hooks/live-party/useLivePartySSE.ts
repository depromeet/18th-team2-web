import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { config } from '@/config/env';
import { connectRealtimeParty, useSendChatMessage } from '@/services/live-party';
import type { ChatListItem } from '@/hooks/live-party/useChatBottomSheet';

const PARTICIPANT_TOKEN_KEY = 'rt-participant-token';

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return `${config.apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export function useLivePartySSE() {
  const [messages, setMessages] = useState<ChatListItem[]>([]);

  const { partyId } = useParams<{ partyId: string }>();

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

  const { mutate: sendMessage } = useSendChatMessage();

  useEffect(() => {
    const { inviteToken, nickname, characterId } = connectParamsRef.current;

    if (!inviteToken || !nickname) {
      return;
    }

    const controller = new AbortController();

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

            const token = parsed.participantToken as string | undefined;

            if (token) {
              sessionStorage.setItem(PARTICIPANT_TOKEN_KEY, token);
            }

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
          }
        } catch {
          console.error('[SSE] 이벤트 파싱 실패');
        }
      },
      controller.signal,
    ).catch((err) => {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      console.error('[SSE] 연결 오류:', err);
    });

    return () => {
      controller.abort();
    };
  }, []);

  const addMessage = (text: string) => {
    if (!text.trim() || !partyId) {
      return;
    }

    sendMessage({
      partyId,
      content: text,
      participantToken: sessionStorage.getItem(PARTICIPANT_TOKEN_KEY),
    });
  };

  return {
    messages,
    addMessage,
  };
}
