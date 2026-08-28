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

export function getEntryData(hostName: string): EntryData[] {
  return [
    {
      text: `${hostName}님의\n생일파티에\n오신 걸 환영해요!`,
    },
    {
      text: `소중한 시간을 내어\n방문해 주셔서 고마워요`,
    },
    {
      text: `이 파티는\n노래, 미니게임 구성으로\n약 [5분간] 짧게 진행돼요`,
    },
    {
      text: `축하를 전하는 것만으로도\n최고의 선물이 될 거예요!`,
    },
    {
      text: `두근두근\n[커튼]을 열어볼까요?`,
      showButton: true,
    },
  ];
}

/** 파티 상태  */
export const LIVE_PARTY_STEP = {
  ENTRY: 'ENTRY', // 주인공 등장
  MUSIC: 'MUSIC', // 노래
  CANDLE: 'CANDLE', // 촛불 불기
  PINATA: 'PINATA', // 박 깨기
  CLOSEABLE: 'CLOSEABLE', // 파티 종료 가능 상태
  END: 'END', // 파티 종료
} as const;

export type PartyStep = keyof typeof LIVE_PARTY_STEP;

export const LIVE_PARTY_STEP_ARRAY: PartyStep[] = [
  LIVE_PARTY_STEP.ENTRY,
  LIVE_PARTY_STEP.MUSIC,
  LIVE_PARTY_STEP.CANDLE,
  LIVE_PARTY_STEP.PINATA,
  LIVE_PARTY_STEP.CLOSEABLE,
  LIVE_PARTY_STEP.END,
];

export const CHAT_CHIPS = ['🎉', '👏', '❤️', '🥳', '생일축하해'];

/** 음악 안내 멘트 */
export const MUSIC_GUIDE_TEXT = [
  '지금부터 생일축하 노래가 나올 예정이에요',
  '무음모드라면 해제해야 노래를 들을 수 있어요',
  '노래가 끝난 후에는\n촛불끄기, 박 터뜨리기 게임도 준비되어 있어요',
];

export const MUSIC_GUIDE_TEXT_DURATION = 4500;

export const MUSIC_LYRICS_START_SECONDS = 17;

export const MUSIC_GUIDE_DURATION = MUSIC_LYRICS_START_SECONDS * 1000;

export function getMusicLyrics(hostName: string): string[] {
  return ['~♬~', '생일축하합니다', '생일축하합니다', `사랑하는 ${hostName}님의`, '생일축하합니다'];
}

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

export const OVERLAY_TRANSITION_STEPS: PartyStep[] = [
  LIVE_PARTY_STEP.ENTRY,
  LIVE_PARTY_STEP.MUSIC,
  LIVE_PARTY_STEP.CANDLE,
];
export const OVERLAY_FADE_DURATION = 500;
export const STEP_DELAY_DURATION = 1000;

export const CONFETTI_COLORS = ['#33E3BD', '#909BFF', '#E3BD33', '#FF73F8'];

export const CHAT_SHEET_MIN_HEIGHT = 283;
export const MUSIC_TEXT_HEIGHT = 84;

export const PARTICIPANT_TOKEN_KEY = 'rt-participant-token';

/** WebSocket 이벤트 이름 */
export const WS_EVENT = {
  ENTERED: 'entered',
  MESSAGE: 'message',
  USER_ENTERED: 'user-entered',
  USER_LEFT: 'user-left',
  CANDLE_BLOW_STARTED: 'candle-blow-started',
  CANDLE_BLOW_PROGRESS: 'candle-blow-progress',
  CANDLE_BLOW_ENDED: 'candle-blow-ended',
  BURST_GAME_STARTED: 'burst-game-started',
  BURST_GAME_PROGRESS: 'burst-game-progress',
  BURST_GAME_ENDED: 'burst-game-ended',
  FIREWORKS: 'fireworks',
  PARTY_PHASE_CHANGED: 'party-phase-changed',
  PARTY_ENDING: 'party-ending',
  PARTY_ENDED: 'party-ended',
} as const;

export type WSEventName = (typeof WS_EVENT)[keyof typeof WS_EVENT];

export const WS_ERROR_MESSAGE = {
  PARSE_FAILED: '[WS] 이벤트 파싱 실패',
  HANDLE_FAILED: '[WS] 이벤트 처리 실패',
  CONNECTION_FAILED: '[WS] 연결 오류',
} as const;

export const characterSizeStyles = {
  lg: 'w-20 h-20',
  sm: 'w-9 h-9',
  xl: 'w-30 h-30',
} as const;

export const GET_PARTICIPANT_INTERVAL = {
  SHORT: 3000,
  LONG: 15000,
} as const;
