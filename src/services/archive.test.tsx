import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useArchiveDetail, useArchiveList } from '@/services/archive';
import { api } from '@/services/api';
import type { components } from '@/types/api';

vi.mock('@/services/api', () => ({
  api: { get: vi.fn() },
}));

type ArchiveItemResponse = components['schemas']['ArchiveListItemResponse'];
type ArchivePartyDetailResponse = components['schemas']['ArchivePartyDetailResponse'];

const apiGetMock = vi.mocked(api.get);

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

function makeListItem(overrides: Partial<ArchiveItemResponse> = {}): ArchiveItemResponse {
  return {
    id: '1024',
    partyId: 42,
    type: 'PARTY',
    role: 'PARTICIPANT',
    celebrantName: '김루카',
    date: '2026-05-12T22:10:00+09:00',
    ...overrides,
  };
}

function mockListResponse(items: ArchiveItemResponse[], totalCount = items.length) {
  apiGetMock.mockResolvedValue({ status: 200, data: { items, totalCount } });
}

function makeDetailResponse(
  overrides: Partial<ArchivePartyDetailResponse> = {},
): ArchivePartyDetailResponse {
  return {
    partyId: 42,
    celebrantNickname: '김루카',
    partyOption: 'REALTIME',
    role: 'PARTICIPANT',
    partyStartedAt: '2026-05-12T22:10:00+09:00',
    partyEndedAt: '2026-05-19T22:10:00+09:00',
    participantCount: 2,
    paperCount: 3,
    participants: [{ nickname: '하파' }, { nickname: '린' }],
    chatMessages: [],
    chatHasMore: false,
    myPaperWritten: false,
    ...overrides,
  };
}

beforeEach(() => {
  apiGetMock.mockReset();
});

describe('useArchiveList', () => {
  it('celebrantName이 있는 PARTY 항목을 "{이름}의 파티" 제목으로 매핑한다', async () => {
    mockListResponse([makeListItem()], 37);

    const { result } = renderHook(() => useArchiveList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/archive?size=20');
    expect(result.current.data).toEqual({
      items: [
        {
          id: '1024',
          partyId: '42',
          type: 'PARTY',
          title: '김루카의 파티',
          date: '26.05.12',
          role: 'PARTICIPANT',
        },
      ],
      totalCount: 37,
    });
  });

  it('PAPER 항목은 "{이름}의 롤링페이퍼" 제목으로 매핑한다', async () => {
    mockListResponse([makeListItem({ type: 'PAPER' })]);

    const { result } = renderHook(() => useArchiveList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items[0].title).toBe('김루카의 롤링페이퍼');
  });

  it('celebrantName이 없거나 공백이면 종류만 제목으로 쓴다', async () => {
    mockListResponse([
      makeListItem({ id: '1', celebrantName: undefined, type: 'PARTY' }),
      makeListItem({ id: '2', celebrantName: '', type: 'PAPER' }),
      makeListItem({ id: '3', celebrantName: '   ', type: 'PARTY' }),
    ]);

    const { result } = renderHook(() => useArchiveList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items.map((item) => item.title)).toEqual([
      '파티',
      '롤링페이퍼',
      '파티',
    ]);
  });

  it('role을 HOST/PARTICIPANT 그대로 매핑한다', async () => {
    mockListResponse([
      makeListItem({ id: '1', role: 'HOST' }),
      makeListItem({ id: '2', role: 'PARTICIPANT' }),
    ]);

    const { result } = renderHook(() => useArchiveList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items.map((item) => item.role)).toEqual(['HOST', 'PARTICIPANT']);
  });

  it('role이 누락되면 PARTICIPANT로 폴백한다', async () => {
    // 스펙상 role은 필수지만 구버전 응답 방어 로직(?? PARTICIPANT) 검증 — 필드 제거를 위한 단언
    const itemWithoutRole = {
      id: '1024',
      partyId: 42,
      type: 'PARTY',
      celebrantName: '김루카',
      date: '2026-05-12T22:10:00+09:00',
    } as ArchiveItemResponse;
    mockListResponse([itemWithoutRole]);

    const { result } = renderHook(() => useArchiveList(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items[0].role).toBe('PARTICIPANT');
  });
});

describe('useArchiveDetail', () => {
  it('REALTIME 상세를 "{이름}의 파티" 제목과 날짜·참가자로 매핑한다', async () => {
    apiGetMock.mockResolvedValue({
      status: 200,
      data: makeDetailResponse({
        role: 'HOST',
        chatMessages: [
          {
            id: 7,
            authorName: '하파',
            content: '생일 축하해!',
            sentAt: '2026-05-12T22:15:30+09:00',
          },
        ],
      }),
    });

    const { result } = renderHook(() => useArchiveDetail('42'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiGetMock).toHaveBeenCalledWith('/api/v1/archive/party/42');
    expect(result.current.data).toEqual({
      id: '42',
      title: '김루카의 파티',
      date: '26.05.12',
      time: '22:10',
      endDate: '26.05.19',
      participantCount: 2,
      participants: ['하파', '린'],
      role: 'HOST',
      myPaperWritten: false,
      myPaperContent: undefined,
      myPaperWriterNickname: undefined,
      paperCount: 3,
      chatMessages: [{ id: '7', authorName: '하파', content: '생일 축하해!', sentAt: '22:15' }],
    });
  });

  it('PAPER_ONLY 상세는 "{이름}의 롤링페이퍼" 제목으로 매핑한다', async () => {
    apiGetMock.mockResolvedValue({
      status: 200,
      data: makeDetailResponse({
        partyOption: 'PAPER_ONLY',
        participantCount: 0,
        participants: [],
      }),
    });

    const { result } = renderHook(() => useArchiveDetail('42'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.title).toBe('김루카의 롤링페이퍼');
    expect(result.current.data?.participants).toEqual([]);
  });

  it('celebrantNickname이 없으면 종류만 제목으로 쓴다', async () => {
    apiGetMock.mockResolvedValue({
      status: 200,
      data: makeDetailResponse({ celebrantNickname: undefined }),
    });

    const { result } = renderHook(() => useArchiveDetail('42'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.title).toBe('파티');
  });
});
