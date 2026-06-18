import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { config } from '@/config/env';
import { api } from '@/services/api';

import type { components } from '@/types/api';
import { getParticipantOptions } from '@/utils/headers';
import { useAuthStore } from '@/stores/useAuthStore';

type SubmitBurstGameTapRequest = components['schemas']['SubmitBurstGameTapRequest'];
type ApiResponseSubmitBurstGameTapResponse =
  components['schemas']['ApiResponseSubmitBurstGameTapResponse'];
type ApiResponseBurstGameStateResponse = components['schemas']['ApiResponseBurstGameStateResponse'];
type ApiResponseRealtimePartyNextActionResult =
  components['schemas']['ApiResponseRealtimePartyNextActionResult'];

export type PartyApiPhase = components['schemas']['PartyPhaseResult']['phase'];

export type RealtimePartyState = components['schemas']['RealtimePartyStateResult'];
export type RealtimePartyEndResult = components['schemas']['RealtimePartyEndResult'];
export type RealtimePartyNextActionResult = components['schemas']['RealtimePartyNextActionResult'];
export type PartyParticipantsResult = components['schemas']['PartyParticipantsResponse'];
export type PartyParticipantResult = components['schemas']['PartyParticipantResponse'];

export const realtimePartyQueries = {
  state: (partyId: string) =>
    queryOptions({
      queryKey: ['realtime-party-state', partyId],
      queryFn: async () => {
        const res = await api.get<components['schemas']['ApiResponseRealtimePartyStateResult']>(
          `/api/v1/parties/${partyId}/realtime-state`,
          getParticipantOptions(),
        );
        return res.data ?? null;
      },
      enabled: Boolean(partyId),
      refetchInterval: 3000,
    }),

  participants: (partyId: string, enabled = true) =>
    queryOptions({
      queryKey: ['party-participants', partyId],
      queryFn: async () => {
        const res = await api.get<components['schemas']['ApiResponsePartyParticipantsResponse']>(
          `/api/v1/parties/${partyId}/participants`,
          getParticipantOptions(),
        );
        return res.data ?? null;
      },
      enabled: Boolean(partyId) && enabled,
      refetchInterval: 3000,
    }),
  nextAction: (partyId: string, participantToken?: string | null, enabled = true) =>
    queryOptions({
      queryKey: ['realtime-party-next-action', partyId, participantToken],
      queryFn: async () => {
        const res = await api.get<ApiResponseRealtimePartyNextActionResult>(
          `/api/v1/parties/${partyId}/realtime-next-action`,
          getParticipantOptions(),
        );
        return res.data ?? null;
      },
      enabled: Boolean(partyId) && enabled,
    }),
};

export function useRealtimePartyState(partyId: string, enabled = true) {
  return useQuery({ ...realtimePartyQueries.state(partyId), enabled: Boolean(partyId) && enabled });
}

export function useRealtimePartyNextAction(
  partyId: string,
  participantToken?: string | null,
  enabled = true,
) {
  return useQuery(realtimePartyQueries.nextAction(partyId, participantToken, enabled));
}

export function useStartRealtimeEnd() {
  return useMutation({
    mutationFn: async (partyId: string) => {
      const res = await api.post<components['schemas']['ApiResponseRealtimePartyEndResult']>(
        `/api/v1/parties/${partyId}/realtime-end`,
      );
      return res.data ?? null;
    },
  });
}

// ── Phase ──

export function useGetPhase(partyId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['partyPhase', partyId],
    queryFn: () =>
      api.get<components['schemas']['ApiResponsePartyPhaseResult']>(
        `/api/v1/parties/${partyId}/phase`,
        getParticipantOptions(),
      ),
    enabled: !!partyId && enabled,
  });
}

export function useAdvancePhase() {
  return useMutation({
    mutationFn: ({ partyId, currentPhase }: { partyId: string; currentPhase: PartyApiPhase }) =>
      api.post<components['schemas']['ApiResponsePartyPhaseResult']>(
        `/api/v1/parties/${partyId}/phase/advance`,
        { currentPhase },
        getParticipantOptions(),
      ),
  });
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
      if (signal.aborted) break;

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const { events, remaining } = parseSSEBuffer(buffer);
      buffer = remaining;

      for (const sseEvent of events) {
        if (signal.aborted) break;
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
    mutationFn: ({ partyId, content }: { partyId: string; content: string }) =>
      api.post<components['schemas']['ApiResponseChatMessageResponse']>(
        `/api/v1/parties/${partyId}/chat-messages`,
        { content },
        getParticipantOptions(),
      ),
  });
}

// ── 파티 참여자 목록 조회 (비회원 지원) ──

export function useGetPartyParticipants(
  partyId?: string,
  options?: {
    enabled?: boolean;
    refetchInterval?: number;
  },
) {
  return useQuery({
    queryKey: ['party-participants', partyId],
    queryFn: async () => {
      const res = await api.get<components['schemas']['ApiResponsePartyParticipantsResponse']>(
        `/api/v1/parties/${partyId}/participants`,
        getParticipantOptions(),
      );

      return res.data ?? null;
    },
    enabled: Boolean(partyId) && (options?.enabled ?? true),
    refetchInterval: options?.refetchInterval,
  });
}

// ── 촛불끄기 초기 상태 조회 ──

export function useGetCandleBlowState(partyId: string | undefined) {
  return useQuery({
    queryKey: ['candleBlowState', partyId],
    queryFn: () =>
      api.get<components['schemas']['ApiResponseCandleBlowResponse']>(
        `/api/v1/parties/${partyId}/candle-blow`,
        getParticipantOptions(),
      ),
    enabled: !!partyId,
  });
}

// ── 촛불 끄기 ──

export function useBlowCandle() {
  return useMutation({
    mutationFn: ({ partyId, candleId }: { partyId: string; candleId: number }) =>
      api.post<components['schemas']['ApiResponseCandleBlowResponse']>(
        `/api/v1/parties/${partyId}/candle-blow/candles/${candleId}`,
        undefined,
        getParticipantOptions(),
      ),
  });
}

// ── 박터뜨리기 ──

export function useGetBurstGameState(
  partyId: string | undefined,
  _participantToken?: string | null,
) {
  return useQuery({
    queryKey: ['burstGameState', partyId],
    queryFn: () =>
      api.get<ApiResponseBurstGameStateResponse>(
        `/api/v1/parties/${partyId}/burst-game`,
        getParticipantOptions(),
      ),
    enabled: !!partyId,
  });
}

export function useSubmitBurstGameTaps() {
  return useMutation({
    mutationFn: ({
      partyId,
      body,
    }: {
      partyId: string;
      body: SubmitBurstGameTapRequest;
      participantToken?: string | null;
    }) =>
      api.post<ApiResponseSubmitBurstGameTapResponse>(
        `/api/v1/parties/${partyId}/burst-game/taps`,
        body,
        getParticipantOptions(),
      ),
  });
}

// ── 폭죽 트리거 ──

export function useTriggerFireworks() {
  return useMutation({
    mutationFn: ({ partyId }: { partyId: string }) =>
      api.post<void>(`/api/v1/parties/${partyId}/fireworks`, undefined, getParticipantOptions()),
  });
}

// ── 실시간 파티 퇴장 ──

export function useLeaveParty() {
  return useMutation({
    mutationFn: ({ partyId }: { partyId: string }) =>
      api.delete<void>(`/api/v1/parties/${partyId}/realtime-participants`, getParticipantOptions()),
  });
}
