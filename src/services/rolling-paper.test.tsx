import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/services/api';
import { useRollingPaper } from '@/services/rolling-paper';
import type { components } from '@/types/api';

vi.mock('@/services/api', () => ({
  api: { get: vi.fn() },
}));

type OwnerListResponse = components['schemas']['OwnerRollingPaperListResponse'];
type OwnerListItem = components['schemas']['OwnerRollingPaperListItemResult'];
type ParticipantListResponse = components['schemas']['ParticipantRollingPaperListResponse'];
type ParticipantListItem = components['schemas']['ParticipantRollingPaperListItemResult'];
type PageInfo = components['schemas']['RollingPaperPageInfoResult'];

const apiGetMock = vi.mocked(api.get);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function pageInfo(overrides: Partial<PageInfo> = {}): PageInfo {
  return {
    page: 1,
    totalCount: 0,
    totalPages: 0,
    hasNext: false,
    ...overrides,
  };
}

function ownerItem(overrides: Partial<OwnerListItem> = {}): OwnerListItem {
  return {
    rollingPaperId: 1,
    position: 1,
    writerNickname: '축하요정',
    content: '생일 축하해요!',
    toppingImageUrl: '/images/rolling-paper-wrappers/Topping_Cherry.svg',
    ...overrides,
  };
}

function participantItem(overrides: Partial<ParticipantListItem> = {}): ParticipantListItem {
  return {
    rollingPaperId: 1,
    writerNickname: '축하요정',
    toppingImageUrl: '/images/rolling-paper-wrappers/Topping_Cherry.svg',
    ...overrides,
  };
}

function ownerResponse(overrides: Partial<OwnerListResponse> = {}): OwnerListResponse {
  return {
    celebrantNickname: '홍길동',
    partyEndAt: '2026-05-19T22:10:00+09:00',
    items: [],
    pageInfo: pageInfo(),
    ...overrides,
  };
}

function participantResponse(
  overrides: Partial<ParticipantListResponse> = {},
): ParticipantListResponse {
  return {
    partyOption: 'REALTIME',
    items: [],
    pageInfo: pageInfo(),
    ...overrides,
  };
}

/** api.get 모킹 형태: 소스가 res.data를 읽으므로 { status, data } 로 감싼다 */
function ok<T>(data: T) {
  return { status: 200, data };
}

beforeEach(() => {
  apiGetMock.mockReset();
});

describe('useRollingPaper (주최자 — partyId 경로)', () => {
  it('totalPages=3이면 page 1·2·3을 모두 호출하고 전체 페이지의 토핑을 합산한다', async () => {
    // page1: 3개, page2: 7개, page3: 5개 → 합계 15개, totalCount 15
    const page1 = ownerResponse({
      items: Array.from({ length: 3 }, (_, i) => ownerItem({ rollingPaperId: 100 + i })),
      pageInfo: pageInfo({ page: 1, totalPages: 3, totalCount: 15, hasNext: true }),
    });
    const page2 = ownerResponse({
      items: Array.from({ length: 7 }, (_, i) => ownerItem({ rollingPaperId: 200 + i })),
      pageInfo: pageInfo({ page: 2, totalPages: 3, totalCount: 15, hasNext: true }),
    });
    const page3 = ownerResponse({
      items: Array.from({ length: 5 }, (_, i) => ownerItem({ rollingPaperId: 300 + i })),
      pageInfo: pageInfo({ page: 3, totalPages: 3, totalCount: 15, hasNext: false }),
    });

    // URL의 page 쿼리에 따라 응답을 라우팅 — 호출 순서(병렬)에 무관하게 정확히 매칭
    apiGetMock.mockImplementation((endpoint: string) => {
      if (endpoint.includes('page=1')) return Promise.resolve(ok(page1));
      if (endpoint.includes('page=2')) return Promise.resolve(ok(page2));
      if (endpoint.includes('page=3')) return Promise.resolve(ok(page3));
      throw new Error(`unexpected endpoint: ${endpoint}`);
    });

    const { result } = renderHook(() => useRollingPaper('42'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // 전 페이지 합산: 3 + 7 + 5 = 15
    expect(result.current.data?.messages).toHaveLength(15);
    expect(result.current.data?.totalCount).toBe(15);
    expect(result.current.data?.hostName).toBe('홍길동');

    // api.get 3회 호출 + page=1/2/3 URL 모두 호출됐는지 확인
    expect(apiGetMock).toHaveBeenCalledTimes(3);
    const calledUrls = apiGetMock.mock.calls.map((c) => c[0]);
    expect(calledUrls).toContainEqual('/api/v1/parties/42/rolling-papers?page=1');
    expect(calledUrls).toContainEqual('/api/v1/parties/42/rolling-papers?page=2');
    expect(calledUrls).toContainEqual('/api/v1/parties/42/rolling-papers?page=3');
  });

  it('totalPages=1이면 api.get을 1회만 호출한다', async () => {
    apiGetMock.mockResolvedValue(
      ok(
        ownerResponse({
          items: [ownerItem(), ownerItem({ rollingPaperId: 2 })],
          pageInfo: pageInfo({ page: 1, totalPages: 1, totalCount: 2, hasNext: false }),
        }),
      ),
    );

    const { result } = renderHook(() => useRollingPaper('42'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiGetMock).toHaveBeenCalledTimes(1);
    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/parties/42/rolling-papers?page=1');
    expect(result.current.data?.messages).toHaveLength(2);
    expect(result.current.data?.totalCount).toBe(2);
  });

  it('빈 응답(totalPages=0)이면 api.get을 1회만 호출하고 messages는 빈 배열', async () => {
    apiGetMock.mockResolvedValue(
      ok(
        ownerResponse({
          items: [],
          pageInfo: pageInfo({ page: 1, totalPages: 0, totalCount: 0, hasNext: false }),
        }),
      ),
    );

    const { result } = renderHook(() => useRollingPaper('42'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiGetMock).toHaveBeenCalledTimes(1);
    expect(result.current.data?.messages).toEqual([]);
    expect(result.current.data?.totalCount).toBe(0);
  });
});

describe('useRollingPaper (참가자 — inviteToken 경로)', () => {
  it('totalPages=3이면 inviteToken URL로 page 1·2·3을 모두 호출하고 합산한다', async () => {
    const page1 = participantResponse({
      items: Array.from({ length: 6 }, (_, i) => participantItem({ rollingPaperId: 10 + i })),
      pageInfo: pageInfo({ page: 1, totalPages: 3, totalCount: 15, hasNext: true }),
    });
    const page2 = participantResponse({
      items: Array.from({ length: 6 }, (_, i) => participantItem({ rollingPaperId: 20 + i })),
      pageInfo: pageInfo({ page: 2, totalPages: 3, totalCount: 15, hasNext: true }),
    });
    const page3 = participantResponse({
      items: Array.from({ length: 3 }, (_, i) => participantItem({ rollingPaperId: 30 + i })),
      pageInfo: pageInfo({ page: 3, totalPages: 3, totalCount: 15, hasNext: false }),
    });

    apiGetMock.mockImplementation((endpoint: string) => {
      if (endpoint.includes('page=1')) return Promise.resolve(ok(page1));
      if (endpoint.includes('page=2')) return Promise.resolve(ok(page2));
      if (endpoint.includes('page=3')) return Promise.resolve(ok(page3));
      throw new Error(`unexpected endpoint: ${endpoint}`);
    });

    const { result } = renderHook(() => useRollingPaper('42', 'invite-abc'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.messages).toHaveLength(15);
    expect(result.current.data?.totalCount).toBe(15);
    // 참가자 경로는 hostName을 매핑하지 않는다
    expect(result.current.data?.hostName).toBeUndefined();

    expect(apiGetMock).toHaveBeenCalledTimes(3);
    const calledUrls = apiGetMock.mock.calls.map((c) => c[0]);
    expect(calledUrls).toContainEqual('/api/v1/party-invites/invite-abc/rolling-papers?page=1');
    expect(calledUrls).toContainEqual('/api/v1/party-invites/invite-abc/rolling-papers?page=2');
    expect(calledUrls).toContainEqual('/api/v1/party-invites/invite-abc/rolling-papers?page=3');
  });

  it('빈 응답(totalPages=0)이면 api.get을 1회만 호출하고 messages는 빈 배열', async () => {
    apiGetMock.mockResolvedValue(
      ok(
        participantResponse({
          items: [],
          pageInfo: pageInfo({ page: 1, totalPages: 0, totalCount: 0, hasNext: false }),
        }),
      ),
    );

    const { result } = renderHook(() => useRollingPaper('42', 'invite-abc'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiGetMock).toHaveBeenCalledTimes(1);
    expect(result.current.data?.messages).toEqual([]);
    expect(result.current.data?.totalCount).toBe(0);
  });
});

describe('mapItems — toppingType 추정', () => {
  it('toppingImageUrl에 candle/strawberry가 포함되면 해당 토핑으로, 그 외엔 cherry로 매핑한다', async () => {
    apiGetMock.mockResolvedValue(
      ok(
        ownerResponse({
          items: [
            ownerItem({
              rollingPaperId: 1,
              toppingImageUrl: '/images/rolling-paper-wrappers/Topping_Candle.svg',
            }),
            ownerItem({
              rollingPaperId: 2,
              toppingImageUrl: '/images/rolling-paper-wrappers/Topping_Strawberry.svg',
            }),
            ownerItem({
              rollingPaperId: 3,
              toppingImageUrl: '/images/rolling-paper-wrappers/Topping_Cherry.svg',
            }),
            // 매칭 안 되는 URL → cherry 폴백
            ownerItem({ rollingPaperId: 4, toppingImageUrl: '/images/unknown.svg' }),
          ],
          pageInfo: pageInfo({ page: 1, totalPages: 1, totalCount: 4, hasNext: false }),
        }),
      ),
    );

    const { result } = renderHook(() => useRollingPaper('42'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.messages.map((m) => m.toppingType)).toEqual([
      'candle',
      'strawberry',
      'cherry',
      'cherry',
    ]);
    // id는 문자열로 매핑되고 작성자 닉네임이 그대로 전달되는지 확인
    expect(result.current.data?.messages[0]).toMatchObject({
      id: '1',
      writerNickname: '축하요정',
    });
  });
});
