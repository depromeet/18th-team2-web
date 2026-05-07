/** 파티 인트로 */
export interface EntryData {
  text: string;
  showButton?: boolean;
}

export const ENTRY_DATA: EntryData[] = [
  {
    text: `현진님의\n생일파티에\n오신 걸 환영해요!`,
  },
  {
    text: `소중한 시간을 내어\n방문해 주셔서 고마워요`,
  },
  {
    text: `이 생일파티는\n[5분] 정도 짧게 진행돼요`,
  },
  {
    text: `축하의 마음을\n남기는 것만으로도\n최고의 선물이 될 거에요!`,
  },
  {
    text: `축하할 준비가 됐다면\n이제 시작할게요`,
  },
  {
    text: `두근두근\n[커튼]을 열어볼까요?`,
    showButton: true,
  },
];

/** 파티 상태  */
export const LIVE_PARTY_STEP = {
  ENTRY: 'ENTRY', // 주인공 등장
  MUSIC: 'MUSIC', // 노래
  CANDLE: 'CANDLE', // 촛불 불기
  PINATA: 'PINATA', // 박 깨기
  END: 'END', // 파티 종료
} as const;

export type PartyStep = keyof typeof LIVE_PARTY_STEP;

export const LIVE_PARTY_STEP_ARRAY: PartyStep[] = [
  LIVE_PARTY_STEP.ENTRY,
  LIVE_PARTY_STEP.MUSIC,
  LIVE_PARTY_STEP.CANDLE,
  LIVE_PARTY_STEP.PINATA,
  LIVE_PARTY_STEP.END,
];

export const CHAT_CHIPS = ['🎉', '👏', '❤️', '🥳', '생일축하해'];

/** 음악 안내 멘트 */
export const MUSIC_GUIDE_TEXT = [
  '지금부터 생일축하 노래가 나올 예정이에요',
  '무음모드라면 해제해야 노래를 들을 수 있어요',
];

export const MUSIC_GUIDE_TEXT_DURATION = 4500;

export const MUSIC_GUIDE_DURATION = MUSIC_GUIDE_TEXT.length * MUSIC_GUIDE_TEXT_DURATION;

export const MUSIC_LYRICS = [
  '~♬~',
  '생일축하합니다',
  '생일축하합니다',
  '사랑하는 현진님의',
  '생일축하합니다',
];
