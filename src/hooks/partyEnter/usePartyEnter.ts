import { useState, type ChangeEvent, type FormEvent } from 'react';

import { VALIDATION_MESSAGES } from '@/constants/validation';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

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

  const navigate = useNavigate();

  const title = isHost
    ? '해당 닉네임과 캐릭터로\n입장하시겠어요?'
    : '파티에 등장할\n닉네임과 캐릭터를 골라주세요!';

  const inputValue = isHost ? hostUserName : nickname;
  const isEditableGuest = !isHost && !isAlreadyWrittenMember;
  const inputMessage = isHost ? VALIDATION_MESSAGES.nickname.hostLocked : undefined;

  const handleChangeNickname = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isEditableGuest) return;
    setNickname(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate(ROUTES.liveParty);
  };

  return {
    title,
    isHost,
    isTimeToParty,
    inputValue,
    isEditableGuest,
    inputMessage,
    handleChangeNickname,
    handleSubmit,
  };
}
