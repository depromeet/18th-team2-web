import { queryOptions, useQuery } from '@tanstack/react-query';

// ── Types ──

export type ToppingType = 'cherry' | 'strawberry' | 'candle';

export interface RollingPaperMessage {
  id: string;
  content: string;
  writerName: string;
  toppingType: ToppingType;
}

export interface RollingPaperData {
  partyId: string;
  hostName: string;
  messages: RollingPaperMessage[];
  partyStartedAt: string;
  writableUntil: string;
}

// ── Mock Data ──

const MOCK_MESSAGES: RollingPaperMessage[] = [
  {
    id: '1',
    content: '생일 축하해!!! 올해도 건강하고 행복한 한 해 보내길 바랄게 🎂',
    writerName: '해파링링',
    toppingType: 'cherry',
  },
  {
    id: '2',
    content: '우리 같이 보낸 시간들이 너무 소중해. 앞으로도 좋은 추억 많이 만들자!',
    writerName: '해파링링',
    toppingType: 'strawberry',
  },
  {
    id: '3',
    content: '항상 응원하고 있어! 하고 싶은 거 다 이루는 한 해가 되길 바라!',
    writerName: '해파링링',
    toppingType: 'cherry',
  },
  {
    id: '4',
    content: '생일 진심으로 축하해~ 맛있는 거 많이 먹고 좋은 하루 보내!',
    writerName: '해파링링',
    toppingType: 'candle',
  },
  {
    id: '5',
    content: '너랑 친구여서 정말 다행이야. 생일 축하하고, 올해도 잘 부탁해!',
    writerName: '해파링링',
    toppingType: 'strawberry',
  },
  {
    id: '6',
    content: '생일 축하해! 네가 웃고 있으면 나도 행복해 😊',
    writerName: '해파링링',
    toppingType: 'cherry',
  },
  {
    id: '7',
    content: '오늘 하루가 너에게 특별한 날이 되길! 생일 축하해!',
    writerName: '해파링링',
    toppingType: 'candle',
  },
  {
    id: '8',
    content: '매번 고마워! 올해 생일은 더 특별하게 보내자~',
    writerName: '해파링링',
    toppingType: 'strawberry',
  },
  {
    id: '9',
    content: '생일 축하합니다! 항상 밝은 에너지 고마워요 :)',
    writerName: '해파링링',
    toppingType: 'cherry',
  },
  {
    id: '10',
    content: '함께해서 즐거워! 생일 축하하고 올해도 파이팅!',
    writerName: '해파링링',
    toppingType: 'candle',
  },
  {
    id: '11',
    content: '생축!! 다음에 같이 맛집 가자~ 🍕',
    writerName: '해파링링',
    toppingType: 'strawberry',
  },
  {
    id: '12',
    content: '너무너무 축하해!! 오늘 주인공은 너야~ 🎉',
    writerName: '해파링링',
    toppingType: 'cherry',
  },
];

function createMockData(): RollingPaperData {
  const now = new Date();
  const partyStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0);
  const writableEnd = new Date(partyStart.getTime() + 7 * 24 * 60 * 60 * 1000);

  return {
    partyId: 'mock-party-id',
    hostName: '김이라',
    messages: MOCK_MESSAGES,
    partyStartedAt: partyStart.toISOString(),
    writableUntil: writableEnd.toISOString(),
  };
}

// ── queryOptions 팩토리 ──

export const rollingPaperQueries = {
  detail: (partyId: string) =>
    queryOptions({
      queryKey: ['rolling-paper', partyId],
      // TODO: API 연결 시 queryFn 교체
      queryFn: () => Promise.resolve(createMockData()),
    }),
};

// ── Query hooks ──

export function useRollingPaper(partyId: string) {
  return useQuery(rollingPaperQueries.detail(partyId));
}
