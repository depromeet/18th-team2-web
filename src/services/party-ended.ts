import { queryOptions, useQuery } from '@tanstack/react-query';

// ── Types ──

export interface PartyEndedData {
  partyId: string;
  hostName: string;
  /** 롤링페이퍼 작성 시작일 (파티 종료 시각) */
  writableFrom: string;
  /** 롤링페이퍼 작성 마감일 (writableFrom + 7일) */
  writableUntil: string;
}

// ── Mock Data ──

// TODO: API 연결 시 createMockData 및 분기 로직 제거
// 테스트 편의를 위한 임시 분기 — partyId가 'expired'면 작성 마감 상태로 시뮬레이션
function createMockData(partyId: string): PartyEndedData {
  const now = new Date();
  const isExpired = partyId === 'expired';

  const writableFrom = isExpired
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10)
    : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const writableUntil = new Date(writableFrom.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    partyId,
    hostName: '김이라',
    writableFrom: writableFrom.toISOString(),
    writableUntil: writableUntil.toISOString(),
  };
}

// ── queryOptions 팩토리 ──

export const partyEndedQueries = {
  detail: (partyId: string) =>
    queryOptions({
      queryKey: ['party-ended', partyId],
      // TODO: API 연결 시 queryFn 교체
      queryFn: () => Promise.resolve(createMockData(partyId)),
    }),
};

// ── Query hooks ──

export function usePartyEnded(partyId: string) {
  return useQuery(partyEndedQueries.detail(partyId));
}
