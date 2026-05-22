import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';

import { VALIDATION_MESSAGES } from '@/constants/validation';
import { ROUTES } from '@/constants/routes';
import { generatePath, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useGetMyRealtimeProfile, useUpsertMyRealtimeProfile } from '@/services/party-enter';

export function usePartyEnter() {
  const { partyId } = useParams<{ partyId: string }>();
  const location = useLocation();
  const inviteToken = (location.state as { inviteToken?: string } | null)?.inviteToken ?? '';

  const navigate = useNavigate();

  const { data: profile } = useGetMyRealtimeProfile(inviteToken);
  const { mutate: upsertProfile, isPending } = useUpsertMyRealtimeProfile();

  const isHost = profile?.isHost ?? false;
  const isNicknameEditable = profile?.nicknameEditable ?? true;

  const [nickname, setNickname] = useState('');
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);

  useEffect(() => {
    if (!profile) return;
    if (profile.nickname) {
      setNickname(profile.nickname);
    }
    if (profile.character?.characterId != null) {
      setSelectedCharacterId(profile.character.characterId);
    }
  }, [profile]);

  const title = isHost
    ? '해당 닉네임과 캐릭터로\n입장하시겠어요?'
    : '파티에 등장할\n닉네임과 캐릭터를 골라주세요!';

  const inputMessage = isHost ? VALIDATION_MESSAGES.nickname.hostLocked : undefined;

  const handleChangeNickname = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isNicknameEditable) return;
    setNickname(event.target.value);
  };

  const handleSelectCharacter = (characterId: number) => {
    setSelectedCharacterId(characterId);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!partyId || !inviteToken) return;

    upsertProfile(
      {
        inviteToken,
        body: { nickname, characterId: selectedCharacterId },
      },
      {
        onSuccess: () => navigate(generatePath(ROUTES.liveParty, { partyId })),
      },
    );
  };

  return {
    title,
    isHost,
    isPending,
    isTimeToParty: true,
    inputValue: nickname,
    isNicknameEditable,
    inputMessage,
    selectedCharacterId,
    handleChangeNickname,
    handleSelectCharacter,
    handleSubmit,
  };
}
