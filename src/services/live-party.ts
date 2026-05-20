import characterBlueHostSrc from '@/assets/images/character/character-blue-host.png';
import characterBrownFullSrc from '@/assets/images/character/character-brown-full.png';
import characterPinkFullSrc from '@/assets/images/character/character-pink-full.png';
import characterWhiteFullSrc from '@/assets/images/character/character-white-full.png';
import characterYellowFullSrc from '@/assets/images/character/character-yellow-full.png';

// TODO: API 연결 시 mock 데이터 제거
export type ParticipantRole = 'host' | 'participant';

export interface PartyParticipant {
  id: number;
  name: string;
  image: string;
  role: ParticipantRole;
  isCurrentUser?: boolean;
}

export const MOCK_PARTY_PARTICIPANTS: PartyParticipant[] = [
  { id: 1, name: '하파린', image: characterBlueHostSrc, role: 'host' },
  { id: 2, name: '소다', image: characterPinkFullSrc, role: 'participant', isCurrentUser: true },
  { id: 3, name: '민트', image: characterYellowFullSrc, role: 'participant' },
  { id: 4, name: '버블', image: characterBrownFullSrc, role: 'participant' },
  { id: 5, name: '구름', image: characterWhiteFullSrc, role: 'participant' },
];
