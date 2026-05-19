import candleOnBlue from '@/assets/images/live-party/candle-on-blue.svg';
import candleOnGreen from '@/assets/images/live-party/candle-on-green.svg';
import candleOnPurple from '@/assets/images/live-party/candle-on-purple.svg';
import candleOffBlue from '@/assets/images/live-party/candle-off-blue.svg';
import candleOffGreen from '@/assets/images/live-party/candle-off-green.svg';
import candleOffPurple from '@/assets/images/live-party/candle-off-purple.svg';

/** 파티 인트로 */
export interface EntryData {
  text: string;
  showButton?: boolean;
}

export const ENTRY_DATA: EntryData[] = [
  {
    text: `이라님의\n생일파티에\n오신 걸 환영해요!`, //TODO: host 이름으로 변경
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
  '사랑하는 이라님의', // TODO: 호스트 이름으로 변경
  '생일축하합니다',
];

export const MUSIC_LYRICS_TIMINGS = [
  { start: 0, end: 16 },
  { start: 17, end: 20 },
  { start: 21, end: 24 },
  { start: 25, end: 28 },
  { start: 29, end: 32 },
];

export const CANDLES = [
  {
    on: candleOnGreen,
    off: candleOffGreen,
  },

  {
    on: candleOnPurple,
    off: candleOffPurple,
  },

  {
    on: candleOnBlue,
    off: candleOffBlue,
  },

  {
    on: candleOnPurple,
    off: candleOffPurple,
  },

  {
    on: candleOnBlue,
    off: candleOffBlue,
  },

  {
    on: candleOnGreen,
    off: candleOffGreen,
  },

  {
    on: candleOnBlue,
    off: candleOffBlue,
  },

  {
    on: candleOnGreen,
    off: candleOffGreen,
  },

  {
    on: candleOnPurple,
    off: candleOffPurple,
  },
];

export const PARTY_USER = {
  PARTICIPANT_NOT_WRITTEN: 'PARTICIPANT_NOT_WRITTEN',
  PARTICIPANT_WRITTEN: 'PARTICIPANT_WRITTEN',
  HOST: 'HOST',
} as const;

export type PartyUserRole = keyof typeof PARTY_USER;

export const OVERLAY_TRANSITION_STEPS: PartyStep[] = [LIVE_PARTY_STEP.ENTRY, LIVE_PARTY_STEP.MUSIC];
export const OVERLAY_FADE_DURATION = 500;
export const STEP_DELAY_DURATION = 1000;

export const CONFETTI_COLORS = ['#33E3BD', '#909BFF', '#E3BD33', '#FF73F8'];

export const CHAT_SHEET_MIN_HEIGHT = 320;
export const MUSIC_TEXT_HEIGHT = 84;

export const characterSizeStyles = {
  lg: { imageWidth: 'w-[98px]' },
  sm: { imageWidth: 'w-10' },
  xl: { imageWidth: 'w-[125px]' },
} as const;
