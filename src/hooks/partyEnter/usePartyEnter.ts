import { useState, type ChangeEvent, type FormEvent } from 'react';

import { useAuthStore } from '@/stores/useAuthStore';

export const NICKNAME_MAX_LENGTH = 10;
export const NICKNAME_REGEX = /^.{1,10}$/u;

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
  const [isNicknameOverflow, setIsNicknameOverflow] = useState(false);

  const title = isHost
    ? '해당 닉네임과 캐릭터로\n입장하시겠어요?'
    : '파티에 등장할\n닉네임과 캐릭터를 골라주세요!';

  const inputValue = isHost ? hostUserName : nickname;
  const isInputDisabled = isHost;
  const isEditableGuest = !isHost && !isAlreadyWrittenMember;

  const inputMessage = (() => {
    if (isHost) {
      return '기존에 설정한 닉네임은 변경할 수 없어요';
    }
    if (isNicknameOverflow) {
      return '닉네임은 최대 10글자까지 입력할 수 있어요.';
    }
    if (!!inputValue && !NICKNAME_REGEX.test(inputValue)) {
      return '닉네임 형식이 올바르지 않아요';
    }
    if (isEditableGuest && isInputFocused) {
      return '최대 10자까지 입력 가능해요.';
    }
    return undefined;
  })();

  const inputMaxLength = isEditableGuest ? NICKNAME_MAX_LENGTH : undefined;

  const handleChangeNickname = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isEditableGuest) return;

    const nextValue = event.target.value;
    if (nextValue.length > NICKNAME_MAX_LENGTH) {
      setIsNicknameOverflow(true);
      return;
    }

    setIsNicknameOverflow(false);
    setNickname(nextValue);
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
