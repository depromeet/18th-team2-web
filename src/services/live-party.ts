import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

import { config } from '@/config/env';
import { PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/useAuthStore';
import { useParticipantStore } from '@/stores/useParticipantStore';
import type { components } from '@/types/api';

type SubmitBurstGameTapRequest = components['schemas']['SubmitBurstGameTapRequest'];
type ApiResponseSubmitBurstGameTapResponse =
  components['schemas']['ApiResponseSubmitBurstGameTapResponse'];
type ApiResponseStartBurstGameResponse = components['schemas']['ApiResponseStartBurstGameResponse'];
type ApiResponseBurstGameStateResponse = components['schemas']['ApiResponseBurstGameStateResponse'];

export type PartyApiPhase = components['schemas']['PartyPhaseResult']['phase'];

export type RealtimePartyState = components['schemas']['RealtimePartyStateResult'];
export type RealtimePartyEndResult = components['schemas']['RealtimePartyEndResult'];
export type PartyParticipantsResult = components['schemas']['PartyParticipantsResponse'];
export type PartyParticipantResult = components['schemas']['PartyParticipantResponse'];

export const realtimePartyQueries = {
  state: (partyId: string) =>
    queryOptions({
      queryKey: ['realtime-party-state', partyId],
      queryFn: async () => {
        const res = await api.get<components['schemas']['ApiResponseRealtimePartyStateResult']>(
          `/api/v1/parties/${partyId}/realtime-state`,
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
        );
        return res.data ?? null;
      },
      enabled: Boolean(partyId) && enabled,
      refetchInterval: 3000,
    }),
};

export function useRealtimePartyState(partyId: string, enabled = true) {
  return useQuery({ ...realtimePartyQueries.state(partyId), enabled: enabled && Boolean(partyId) });
}

export function usePartyParticipants(partyId: string, enabled = true) {
  return useQuery(realtimePartyQueries.participants(partyId, enabled));
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

function getParticipantTokenOptions(participantToken?: string | null) {
  const isLoggedIn = Boolean(useAuthStore.getState().accessToken);

  return !isLoggedIn && participantToken
    ? { headers: { 'X-Participant-Token': participantToken } }
    : undefined;
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

// ── 파티 참여자 목록 조회 (비회원 지원) ──

export function useGetPartyParticipants(partyId: string | undefined) {
  const participantToken = useParticipantStore((s) => s.participantToken);
  const isLoggedIn = Boolean(useAuthStore.getState().accessToken);
  const hasAuth = isLoggedIn || !!participantToken;

  return useQuery({
    queryKey: ['partyParticipants', partyId],
    queryFn: () => {
      const options =
        !isLoggedIn && participantToken
          ? { headers: { 'X-Participant-Token': participantToken } }
          : undefined;
      return api.get<components['schemas']['ApiResponsePartyParticipantsResponse']>(
        `/api/v1/parties/${partyId}/participants`,
        options,
      );
    },
    enabled: !!partyId && hasAuth,
  });
}

// ── 파티 Phase 조회 ──

export function useGetPhase(partyId: string | undefined) {
  const participantToken = useParticipantStore((s) => s.participantToken);
  const isLoggedIn = Boolean(useAuthStore.getState().accessToken);
  const hasAuth = isLoggedIn || !!participantToken;

  return useQuery({
    queryKey: ['partyPhase', partyId],
    queryFn: () => {
      const options =
        !isLoggedIn && participantToken
          ? { headers: { 'X-Participant-Token': participantToken } }
          : undefined;
      return api.get<components['schemas']['ApiResponsePartyPhaseResult']>(
        `/api/v1/parties/${partyId}/phase`,
        options,
      );
    },
    enabled: !!partyId && hasAuth,
    refetchInterval: hasAuth ? 3000 : false,
  });
}

// ── 파티 Phase 전환 ──

export function useAdvancePhase() {
  return useMutation({
    mutationFn: ({
      partyId,
      currentPhase,
      participantToken,
    }: {
      partyId: string;
      currentPhase: PartyApiPhase;
      participantToken?: string | null;
    }) => {
      const isLoggedIn = Boolean(useAuthStore.getState().accessToken);
      const options =
        !isLoggedIn && participantToken
          ? { headers: { 'X-Participant-Token': participantToken } }
          : undefined;
      return api.post<components['schemas']['ApiResponsePartyPhaseResult']>(
        `/api/v1/parties/${partyId}/phase/advance`,
        { currentPhase },
        options,
      );
    },
  });
}

// ── 촛불끄기 초기 상태 조회 ──

export function useGetCandleBlowState(partyId: string | undefined) {
  return useQuery({
    queryKey: ['candleBlowState', partyId],
    queryFn: () => {
      const isLoggedIn = Boolean(useAuthStore.getState().accessToken);
      const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
      const options =
        !isLoggedIn && participantToken
          ? { headers: { 'X-Participant-Token': participantToken } }
          : undefined;
      return api.get<components['schemas']['ApiResponseCandleBlowResponse']>(
        `/api/v1/parties/${partyId}/candle-blow`,
        options,
      );
    },
    enabled: !!partyId,
  });
}

// ── 촛불 끄기 ──

export function useBlowCandle() {
  return useMutation({
    mutationFn: ({
      partyId,
      candleId,
      participantToken,
    }: {
      partyId: string;
      candleId: number;
      participantToken?: string | null;
    }) => {
      const isLoggedIn = Boolean(useAuthStore.getState().accessToken);
      const options =
        !isLoggedIn && participantToken
          ? { headers: { 'X-Participant-Token': participantToken } }
          : undefined;
      return api.post<components['schemas']['ApiResponseCandleBlowResponse']>(
        `/api/v1/parties/${partyId}/candle-blow/candles/${candleId}`,
        undefined,
        options,
      );
    },
  });
}

// ── 박터뜨리기 ──

export function useStartBurstGame() {
  return useMutation({
    mutationFn: ({
      partyId,
      participantToken,
    }: {
      partyId: string;
      participantToken?: string | null;
    }) =>
      api.post<ApiResponseStartBurstGameResponse>(
        `/api/v1/parties/${partyId}/burst-game/start`,
        undefined,
        getParticipantTokenOptions(participantToken),
      ),
  });
}

export function useGetBurstGameState(
  partyId: string | undefined,
  participantToken?: string | null,
) {
  return useQuery({
    queryKey: ['burstGameState', partyId, participantToken],
    queryFn: () =>
      api.get<ApiResponseBurstGameStateResponse>(
        `/api/v1/parties/${partyId}/burst-game`,
        getParticipantTokenOptions(participantToken),
      ),
    enabled: !!partyId,
  });
}

export function useSubmitBurstGameTaps() {
  return useMutation({
    mutationFn: ({
      partyId,
      body,
      participantToken,
    }: {
      partyId: string;
      body: SubmitBurstGameTapRequest;
      participantToken?: string | null;
    }) =>
      api.post<ApiResponseSubmitBurstGameTapResponse>(
        `/api/v1/parties/${partyId}/burst-game/taps`,
        body,
        getParticipantTokenOptions(participantToken),
      ),
  });
}

// ── 폭죽 트리거 ──

export function useTriggerFireworks() {
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
      return api.post<void>(`/api/v1/parties/${partyId}/fireworks`, undefined, options);
    },
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
