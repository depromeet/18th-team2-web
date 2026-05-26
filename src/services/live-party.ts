import { useMutation, useQuery } from '@tanstack/react-query';

import { config } from '@/config/env';
import { PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { components } from '@/types/api';

// TODO: API 연결 시 mock 데이터 제거
export type ParticipantRole = 'host' | 'participant';

export interface PartyParticipant {
  id: number;
  name: string;
  image: string;
  role: ParticipantRole;
  isCurrentUser?: boolean;
}

// ── SSE ──

export interface SSEEvent {
  event: string;
  data: string;
}

export interface ConnectRealtimePartyParams {
  inviteToken: string;
  nickname: string;
  characterId?: number | null;
  participantToken?: string | null;
}

export function connectRealtimeParty(
  params: ConnectRealtimePartyParams,
  onEvent: (event: SSEEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  const { inviteToken, nickname, characterId, participantToken } = params;
  const accessToken = useAuthStore.getState().accessToken;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  return fetch(
    `${config.apiBaseUrl}/api/v1/party-invites/${inviteToken}/realtime-participants/stream`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        nickname,
        ...(characterId != null ? { characterId } : {}),
        ...(participantToken ? { participantToken } : {}),
      }),
      signal,
    },
  ).then(async (response) => {
    if (!response.ok || !response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      // abort 되었으면 즉시 종료
      if (signal.aborted) {
        break;
      }

      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      const { events, remaining } = parseSSEBuffer(buffer);

      buffer = remaining;

      for (const sseEvent of events) {
        // 중간에 abort 되면 이벤트 처리 중단
        if (signal.aborted) {
          break;
        }

        onEvent(sseEvent);
      }
    }
  });
}

function parseSSEBuffer(buffer: string): { events: SSEEvent[]; remaining: string } {
  const events: SSEEvent[] = [];
  const parts = buffer.split(/\r?\n\r?\n/);

  for (let i = 0; i < parts.length - 1; i++) {
    const block = parts[i].trim();
    if (!block) continue;

    let event = 'message';
    let data = '';

    for (const line of block.split(/\r?\n/)) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) data += line.slice(5).trim();
    }

    if (data) events.push({ event, data });
  }

  return { events, remaining: parts[parts.length - 1] };
}

// ── 채팅 메시지 전송 ──

export function useSendChatMessage() {
  return useMutation({
    mutationFn: ({
      partyId,
      content,
      participantToken,
    }: {
      partyId: string;
      content: string;
      participantToken?: string | null;
    }) => {
      const isLoggedIn = Boolean(useAuthStore.getState().accessToken);
      const options =
        !isLoggedIn && participantToken
          ? { headers: { 'X-Participant-Token': participantToken } }
          : undefined;
      return api.post<components['schemas']['ApiResponseChatMessageResponse']>(
        `/api/v1/parties/${partyId}/chat-messages`,
        { content },
        options,
      );
    },
  });
}

// ── 파티 참여자 목록 조회 ──

export function useGetPartyParticipants(partyId: string | undefined) {
  return useQuery({
    queryKey: ['partyParticipants', partyId],
    queryFn: () => {
      const isLoggedIn = Boolean(useAuthStore.getState().accessToken);
      const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
      const options =
        !isLoggedIn && participantToken
          ? { headers: { 'X-Participant-Token': participantToken } }
          : undefined;
      return api.get<components['schemas']['ApiResponsePartyParticipantsResponse']>(
        `/api/v1/parties/${partyId}/participants`,
        options,
      );
    },
    enabled: !!partyId,
  });
}

// ── 실시간 파티 퇴장 ──

export function useLeaveParty() {
  return useMutation({
    mutationFn: ({
      partyId,
      participantToken,
    }: {
      partyId: string;
      participantToken?: string | null;
    }) => {
      const isLoggedIn = Boolean(useAuthStore.getState().accessToken);
      const options =
        !isLoggedIn && participantToken
          ? { headers: { 'X-Participant-Token': participantToken } }
          : undefined;
      return api.delete<void>(`/api/v1/parties/${partyId}/realtime-participants`, options);
    },
  });
}
