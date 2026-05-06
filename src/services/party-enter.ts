// TODO: API 연결 시 mock 데이터 제거
export interface Participant {
  id: number;
  nickname: string;
  imageUrl: string;
}

export const MOCK_PARTICIPANTS: Participant[] = [
  {
    id: 1,
    nickname: '하파린',
    imageUrl: 'https://placehold.co/40x40',
  },
  {
    id: 2,
    nickname: '소다',
    imageUrl: 'https://placehold.co/40x40',
  },
  {
    id: 3,
    nickname: '민트',
    imageUrl: 'https://placehold.co/40x40',
  },
];
