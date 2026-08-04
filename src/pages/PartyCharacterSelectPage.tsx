import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import characterBlue from '@/assets/images/character/character-blue-full.png';
import characterGreen from '@/assets/images/character/character-green-full.png';
import characterPink from '@/assets/images/character/character-pink-full.png';
import characterPurple from '@/assets/images/character/character-purple-full.png';
import characterYellow from '@/assets/images/character/character-yellow-full.png';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { H1 } from '@/components/ui/Typography';
import { CHARACTER_LABEL_MAP } from '@/constants/character';
import { ROUTES } from '@/constants/routes';
import type { CharacterResult } from '@/services/character';
import { useCharacters } from '@/services/character';
import { useActivateInviteLink, useCreateRealtimeParty } from '@/services/party-create';
import { resolveImageUrl } from '@/utils/image';

const FALLBACK_CHARACTERS = [
  { id: 1, name: CHARACTER_LABEL_MAP[1], image: characterBlue },
  { id: 2, name: CHARACTER_LABEL_MAP[2], image: characterGreen },
  { id: 3, name: CHARACTER_LABEL_MAP[3], image: characterPink },
  { id: 4, name: CHARACTER_LABEL_MAP[4], image: characterPurple },
  { id: 5, name: CHARACTER_LABEL_MAP[5], image: characterYellow },
];

interface PartyCharacterLocationState {
  hostName?: string;
  partyDate?: string;
  partyTime?: string | null;
  startedDate?: string;
  startTime?: string;
}

interface CharacterOption {
  id: number;
  name: string;
  image: string;
}

type ClickableSwiper = SwiperType & {
  allowClick?: boolean;
};

function mapCharacterOption(character: CharacterResult, index: number): CharacterOption | null {
  const id = character.characterId;
  if (id == null) return null;

  return {
    id,
    name: CHARACTER_LABEL_MAP[id] ?? FALLBACK_CHARACTERS[index]?.name ?? '캐릭터',
    image:
      resolveImageUrl(character.characterImageUrl) ??
      resolveImageUrl(character.characterThumbnailImageUrl) ??
      FALLBACK_CHARACTERS[index % FALLBACK_CHARACTERS.length].image,
  };
}

export default function PartyCharacterSelectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState =
    typeof location.state === 'object' && location.state
      ? (location.state as PartyCharacterLocationState)
      : {};
  const swiperRef = useRef<SwiperType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [createError, setCreateError] = useState<string | null>(null);
  const { data: characterOptions } = useCharacters();
  const visibleCharacters = useMemo(() => {
    const mapped = (characterOptions ?? [])
      .map((c, i) => mapCharacterOption(c, i))
      .filter((c): c is CharacterOption => c !== null);
    return mapped.length > 0 ? mapped : FALLBACK_CHARACTERS;
  }, [characterOptions]);
  const { mutate: createRealtimeParty, isPending: isCreatingParty } = useCreateRealtimeParty();
  const { mutate: activateInviteLink, isPending: isActivatingInviteLink } = useActivateInviteLink();
  const isPending = isCreatingParty || isActivatingInviteLink;

  const handleSelectIndex = (index: number) => {
    swiperRef.current?.slideTo(index);
    setSelectedIndex(index);
  };

  const handleClickCharacter = (index: number) => {
    const swiper = swiperRef.current as ClickableSwiper | null;
    if (swiper?.allowClick === false) return;

    handleSelectIndex(index);
  };

  const handleSelectCharacter = () => {
    const { hostName, startedDate, startTime } = locationState;
    if (!hostName || !startedDate || !startTime) {
      navigate(ROUTES.createPartyTime, { replace: true });
      return;
    }

    setCreateError(null);
    const selectedCharacter = visibleCharacters[selectedIndex];
    if (!selectedCharacter) {
      setCreateError('캐릭터를 선택할 수 없어요.');
      return;
    }

    createRealtimeParty(
      {
        celebrantNickname: hostName,
        startedDate,
        startTime,
        characterId: selectedCharacter.id,
      },
      {
        onSuccess: (createRes) => {
          const partyId = createRes.data?.partyId;
          if (partyId == null) {
            setCreateError('파티 생성 응답을 확인할 수 없어요.');
            return;
          }

          activateInviteLink(partyId, {
            onSuccess: (inviteRes) => {
              const inviteToken = inviteRes.data?.token;
              if (!inviteToken) {
                setCreateError('초대장 링크 응답을 확인할 수 없어요.');
                return;
              }

              navigate(ROUTES.createPartyComplete, {
                state: {
                  ...locationState,
                  characterId: String(selectedCharacter.id),
                  partyId,
                  inviteToken,
                },
              });
            },
            onError: () => setCreateError('초대장 링크를 생성하지 못했어요.'),
          });
        },
        onError: () => setCreateError('파티를 생성하지 못했어요.'),
      },
    );
  };

  return (
    <div className="bg-gradient-bg flex min-h-dvh flex-col overflow-hidden">
      <PageHeader />

      {createError && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-3 text-sm text-white">
          {createError}
        </div>
      )}

      <H1 className="mt-[clamp(32px,7svh,48px)] px-5">
        내 파티날,
        <br />
        나는 어떤 캐릭터로 등장할까요?
      </H1>

      <div className="mt-[clamp(72px,20svh,184px)] flex h-[clamp(190px,30svh,230px)] w-full items-center">
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          slidesPerView="auto"
          centeredSlides
          spaceBetween={24}
          initialSlide={selectedIndex}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            scale: 1,
            slideShadows: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setSelectedIndex(swiper.realIndex)}
          className="h-full w-full overflow-visible"
        >
          {visibleCharacters.map((character, index) => (
            <SwiperSlide
              key={character.id}
              className="!flex !w-[clamp(176px,32svh,200px)] items-center justify-center"
            >
              <button
                type="button"
                aria-label={`${character.name} 선택`}
                aria-current={index === selectedIndex}
                className="flex h-[clamp(176px,28svh,200px)] w-[clamp(176px,28svh,200px)] cursor-pointer items-center justify-center"
                onClick={() => handleClickCharacter(index)}
              >
                <img
                  src={character.image}
                  alt=""
                  aria-hidden="true"
                  className={`h-[clamp(176px,28svh,200px)] w-[clamp(176px,28svh,200px)] object-contain transition-opacity duration-200 ${
                    index === selectedIndex ? 'opacity-100' : 'opacity-45'
                  }`}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-[clamp(16px,3svh,24px)] flex justify-center gap-2">
        {visibleCharacters.map((character, index) => (
          <button
            key={character.id}
            type="button"
            aria-label={`${character.name} 선택`}
            aria-current={index === selectedIndex}
            onClick={() => handleSelectIndex(index)}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              index === selectedIndex ? 'w-3 bg-blue-500' : 'bg-grey-200 w-1.5'
            }`}
          />
        ))}
      </div>

      <div className="mt-auto px-5 pb-[calc(24px+env(safe-area-inset-bottom))]">
        <Button size="full" disabled={isPending} onClick={handleSelectCharacter}>
          선택하기
        </Button>
      </div>
    </div>
  );
}
