import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { config } from '@/config/env';
import { connectRealtimeParty, useSendChatMessage } from '@/services/live-party';

const MIN_HEIGHT = 320;
const PARTICIPANT_TOKEN_KEY = 'rt-participant-token';

export interface ChatMessage {
  id: number;
  user: {
    name: string;
    profileImage: string | null;
    senderRole: 'PARTICIPANT' | 'CELEBRANT';
  };
  text: string;
}

export type ChatListItem =
  | {
      type: 'message';
      id: number;
      user: {
        name: string;
        profileImage: string | null;
        senderRole: 'PARTICIPANT' | 'CELEBRANT';
      };
      text: string;
    }
  | {
      type: 'entry';
      id: number;
      userName: string;
    }
  | {
      type: 'exit';
      id: number;
      userName: string;
    };

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${config.apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export function useChatBottomSheet() {
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const [messages, setMessages] = useState<ChatListItem[]>([]);

  const { partyId } = useParams<{ partyId: string }>();
  const location = useLocation();
  const locationState = location.state as {
    inviteToken?: string;
    nickname?: string;
    characterId?: number | null;
  } | null;

  const inviteToken = locationState?.inviteToken ?? '';
  const nickname = locationState?.nickname ?? '';
  const characterId = locationState?.characterId;

  const { mutate: sendMessage } = useSendChatMessage();

  const MAX_HEIGHT = window.innerHeight - 160;
  const MID = (MIN_HEIGHT + MAX_HEIGHT) / 2;
  const isExpanded = height > MIN_HEIGHT;

  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // SSE 연결
  useEffect(() => {
    if (!inviteToken || !nickname) return;

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

          if (event === 'entered') {
            const token = parsed.participantToken as string | undefined;
            if (token) sessionStorage.setItem(PARTICIPANT_TOKEN_KEY, token);

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
            setMessages((prev) => [...prev, { type: 'entry' as const, id: Date.now(), userName }]);
            return;
          }

          if (event === 'user-left') {
            const userName = (parsed.nickname ?? parsed.senderNickname ?? '') as string;
            setMessages((prev) => [...prev, { type: 'exit' as const, id: Date.now(), userName }]);
          }
        } catch {
          // ignore malformed events
        }
      },
      controller.signal,
    ).catch((err) => {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error('[SSE] 연결 오류:', err);
    });

    return () => {
      controller.abort();
    };
  }, [inviteToken, nickname, characterId]);

  const addMessage = (text: string) => {
    if (!text.trim() || !partyId) return;
    sendMessage({
      partyId,
      content: text,
      participantToken: sessionStorage.getItem(PARTICIPANT_TOKEN_KEY),
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return;
    const delta = e.clientY - startYRef.current;
    const nextHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeightRef.current - delta));
    setHeight(nextHeight);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (height > MID) setHeight(MAX_HEIGHT);
    else setHeight(MIN_HEIGHT);
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  return {
    height,
    isExpanded,
    isDragging,
    handlePointerDown,
    messages,
    addMessage,
  };
}
