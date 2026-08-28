import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { Client, type IMessage } from '@stomp/stompjs';

import { config } from '@/config/env';
import { api } from '@/services/api';
import { PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';

import type { components } from '@/types/api';
import { getParticipantOptions } from '@/utils/headers';
import { useAuthStore } from '@/stores/useAuthStore';

type SubmitBurstGameTapRequest = components['schemas']['SubmitBurstGameTapRequest'];
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

// ── WebSocket ──

const wsBrokerUrl = `${config.apiBaseUrl.replace(/^http/, 'ws')}/ws`;

export interface WebSocketEvent {
  event: string;
  data: string;
}

export interface ConnectRealtimePartyParams {
  partyId: string;
  inviteToken: string;
  nickname: string;
  characterId?: number | null;
  participantToken?: string | null;
}

// 입장 후 다른 액션(채팅 전송/촛불끄기/박터뜨리기/폭죽/퇴장)이 같은 연결로 publish할 수 있도록 공유
let activeClient: Client | null = null;

function publishPartyAction(destination: string, body: Record<string, unknown>) {
  if (!activeClient?.connected) {
    throw new Error('WebSocket이 연결되어 있지 않습니다.');
  }

  const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);

  activeClient.publish({
    destination,
    body: JSON.stringify({
      ...body,
      ...(participantToken ? { participantToken } : {}),
      clientRequestId: crypto.randomUUID(),
    }),
  });
}

function parseWebSocketFrame(body: string): { event: string; data: unknown } | null {
  try {
    return JSON.parse(body) as { event: string; data: unknown };
  } catch (err) {
    console.error('[WS] 프레임 파싱 실패', err);
    return null;
  }
}

export function connectRealtimeParty(
  params: ConnectRealtimePartyParams,
  onEvent: (event: WebSocketEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  const { partyId, inviteToken, nickname, characterId, participantToken } = params;
  const accessToken = useAuthStore.getState().accessToken;

  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      resolve();
      return;
    }

    let settled = false;

    const client = new Client({
      brokerURL: wsBrokerUrl,
      connectHeaders: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        const clientRequestId = crypto.randomUUID();
        let broadcastSubscribed = false;

        client.subscribe(
          `/topic/parties/${partyId}/personal/${clientRequestId}`,
          (message: IMessage) => {
            const parsed = parseWebSocketFrame(message.body);
            if (!parsed) return;

            const { event, data } = parsed;
            onEvent({ event, data: JSON.stringify(data) });

            if (event === 'entered') {
              if (!settled) {
                settled = true;
                resolve();
              }

              if (!broadcastSubscribed) {
                broadcastSubscribed = true;
                client.subscribe(`/topic/parties/${partyId}`, (broadcast: IMessage) => {
                  const parsedBroadcast = parseWebSocketFrame(broadcast.body);
                  if (!parsedBroadcast) return;

                  onEvent({
                    event: parsedBroadcast.event,
                    data: JSON.stringify(parsedBroadcast.data),
                  });
                });
              }
            }
          },
        );

        client.subscribe(`/topic/errors/${clientRequestId}`, (message: IMessage) => {
          const parsed = parseWebSocketFrame(message.body);
          if (!parsed) return;

          const { data } = parsed as { data: { code: string; message: string } };

          if (!settled) {
            settled = true;
            const err = new Error(data.message);
            (err as Error & { status?: number }).status =
              data.code === 'PARTY_NICKNAME_DUPLICATED' ? 409 : undefined;
            reject(err);
          }
        });

        const currentParticipantToken =
          sessionStorage.getItem(PARTICIPANT_TOKEN_KEY) ?? participantToken;

        client.publish({
          destination: `/app/party-invites/${inviteToken}/realtime-participants`,
          body: JSON.stringify({
            nickname,
            ...(characterId != null ? { characterId } : {}),
            ...(currentParticipantToken ? { participantToken: currentParticipantToken } : {}),
            clientRequestId,
          }),
        });
      },
      onStompError: (frame) => {
        if (!settled) {
          settled = true;
          reject(new Error(frame.headers?.message ?? 'STOMP 연결 에러'));
        }
      },
    });

    signal.addEventListener('abort', () => {
      if (activeClient === client) {
        activeClient = null;
      }
      client.deactivate();
      if (!settled) {
        settled = true;
        resolve();
      }
    });

    activeClient = client;
    client.activate();
  });
}

// ── 채팅 메시지 전송 ──

export function useSendChatMessage() {
  return useMutation({
    mutationFn: async ({ partyId, content }: { partyId: string; content: string }) => {
      publishPartyAction(`/app/parties/${partyId}/chat-messages`, { content });
    },
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
    mutationFn: async ({ partyId, candleId }: { partyId: string; candleId: number }) => {
      publishPartyAction(`/app/parties/${partyId}/candle-blow/candles/${candleId}`, {});
    },
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
    mutationFn: async ({ partyId, body }: { partyId: string; body: SubmitBurstGameTapRequest }) => {
      publishPartyAction(`/app/parties/${partyId}/burst-game/taps`, body);
    },
  });
}

// ── 폭죽 트리거 ──

export function useTriggerFireworks() {
  return useMutation({
    mutationFn: async ({ partyId }: { partyId: string }) => {
      publishPartyAction(`/app/parties/${partyId}/fireworks`, {});
    },
  });
}

// ── 실시간 파티 퇴장 ──

export function useLeaveParty() {
  return useMutation({
    mutationFn: async ({ partyId }: { partyId: string }) => {
      publishPartyAction(`/app/parties/${partyId}/leave`, {});
    },
  });
}
