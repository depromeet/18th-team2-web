export const NICKNAME_MAX_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 100;

export const VALIDATION_MESSAGES = {
  nickname: {
    required: '닉네임을 입력해주세요',
    maxLength: `닉네임은 ${NICKNAME_MAX_LENGTH}자 이하로 입력해주세요`,
    invalidFormat: '닉네임 형식이 올바르지 않아요',
    maxHint: `최대 ${NICKNAME_MAX_LENGTH}자까지 입력 가능해요.`,
    hostLocked: '기존에 설정한 닉네임은 변경할 수 없어요',
    duplicate: '이미 사용중인 닉네임이에요',
    emptyOnEnter: '닉네임을 입력해야 입장할 수 있어요',
  },
  message: {
    required: '메시지를 입력해주세요',
    maxLength: `${MESSAGE_MAX_LENGTH}자 이하로 입력해주세요`,
  },
} as const;
