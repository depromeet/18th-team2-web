import { useState, type ChangeEvent, type FormEvent } from 'react';

import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_REGEX,
  VALIDATION_MESSAGES,
} from '@/constants/validation';
import { useAuthStore } from '@/stores/useAuthStore';

const MOCK_HOST_USER_NAME = '하파린호스트';
const MOCK_WRITTEN_MEMBER_NICKNAME = '이미쓴참여자';

export function usePartyEnter() {
  // TODO: API 연결 후 제거
  const isHost = false;
  const isAlreadyWrittenMember = false;
  const isTimeToParty = true;

  const user = useAuthStore((state) => state.user);
  const hostUserName = user?.name ?? MOCK_HOST_USER_NAME;

  const [nickname, setNickname] = useState(() =>
    isAlreadyWrittenMember ? MOCK_WRITTEN_MEMBER_NICKNAME : '',
  );
  const [isInputFocused, setIsInputFocused] = useState(false);

  const title = isHost
    ? '해당 닉네임과 캐릭터로\n입장하시겠어요?'
    : '파티에 등장할\n닉네임과 캐릭터를 골라주세요!';

  const inputValue = isHost ? hostUserName : nickname;
  const isInputDisabled = isHost;
  const isEditableGuest = !isHost && !isAlreadyWrittenMember;

  const inputMessage = (() => {
    if (isHost) {
      return VALIDATION_MESSAGES.nickname.hostLocked;
    }
    if (!!inputValue && !NICKNAME_REGEX.test(inputValue)) {
      return VALIDATION_MESSAGES.nickname.invalidFormat;
    }
    if (isEditableGuest && isInputFocused) {
      return VALIDATION_MESSAGES.nickname.maxHint;
    }
    return undefined;
  })();

  const inputMaxLength = isEditableGuest ? NICKNAME_MAX_LENGTH : undefined;

  const handleChangeNickname = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isEditableGuest) return;
    setNickname(event.target.value);
  };

  const handleFocusNickname = () => {
    if (!isEditableGuest) return;
    setIsInputFocused(true);
  };

  const handleBlurNickname = () => {
    setIsInputFocused(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: 파티 입장 API 연결
  };

  return {
    title,
    isHost,
    isTimeToParty,
    inputValue,
    isInputDisabled,
    inputMessage,
    inputMaxLength,
    handleChangeNickname,
    handleFocusNickname,
    handleBlurNickname,
    handleSubmit,
  };
}
