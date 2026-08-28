import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { QueryClient } from '@tanstack/react-query';

import { WS_EVENT } from '@/constants/live-party';
import type { ChatListItem } from '@/hooks/live-party/useChatBottomSheet';
import { resolveImageUrl } from '@/utils/image';

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

interface LivePartyChatState {
  messages: ChatListItem[];
  setInitialMessages: (rawMessages: unknown[]) => void;
  appendChatMessage: (raw: Record<string, unknown>) => void;
  appendEntryMessage: (userName: string) => void;
  appendExitMessage: (userName: string) => void;
}

export const useLivePartyChatStore = create<LivePartyChatState>()(
  devtools(
    (set) => ({
      messages: [],

      setInitialMessages: (rawMessages) =>
        set(
          { messages: rawMessages.map((m) => toChatMessage(m as Record<string, unknown>)) },
          false,
          'setInitialMessages',
        ),

      appendChatMessage: (raw) =>
        set(
          (state) => ({ messages: [...state.messages, toChatMessage(raw)] }),
          false,
          'appendChatMessage',
        ),

      appendEntryMessage: (userName) =>
        set(
          (state) => ({
            messages: [...state.messages, { type: 'entry' as const, id: Date.now(), userName }],
          }),
          false,
          'appendEntryMessage',
        ),

      appendExitMessage: (userName) =>
        set(
          (state) => ({
            messages: [...state.messages, { type: 'exit' as const, id: Date.now(), userName }],
          }),
          false,
          'appendExitMessage',
        ),
    }),
    { name: 'LivePartyChatStore' },
  ),
);

/** 채팅 관련 WS 이벤트(메시지/입장/퇴장)를 해석해 스토어에 반영. 처리한 이벤트면 true. */
export function applyChatWsEvent(
  event: string,
  parsed: Record<string, unknown>,
  ctx: { queryClient: QueryClient; partyId?: string },
) {
  const store = useLivePartyChatStore.getState();

  switch (event) {
    case WS_EVENT.MESSAGE:
      store.appendChatMessage(parsed);
      return true;

    case WS_EVENT.USER_ENTERED:
      store.appendEntryMessage((parsed.nickname ?? parsed.senderNickname ?? '') as string);
      ctx.queryClient.invalidateQueries({ queryKey: ['party-participants', ctx.partyId] });
      return true;

    case WS_EVENT.USER_LEFT:
      store.appendExitMessage((parsed.nickname ?? parsed.senderNickname ?? '') as string);
      ctx.queryClient.invalidateQueries({ queryKey: ['party-participants', ctx.partyId] });
      return true;

    default:
      return false;
  }
}
