import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import characterBlue from '@/assets/images/character/character-blue-full.png';
import characterBrown from '@/assets/images/character/character-brown-full.png';
import characterPink from '@/assets/images/character/character-pink-full.png';
import characterWhite from '@/assets/images/character/character-white-full.png';
import characterYellow from '@/assets/images/character/character-yellow-full.png';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { PageHeader } from '@/components/ui/PageHeader';
import { H1 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';
import { useCharacters } from '@/services/character';
import { useActivateInviteLink, useCreateRealtimeParty } from '@/services/party-create';

// TODO: 캐릭터 조회 API 연결 시 교체
const CHARACTERS = [
  { id: 'character-blue', name: '파란 캐릭터', image: characterBlue },
  { id: 'character-brown', name: '갈색 캐릭터', image: characterBrown },
  { id: 'character-pink', name: '분홍 캐릭터', image: characterPink },
  { id: 'character-white', name: '하얀 캐릭터', image: characterWhite },
  { id: 'character-yellow', name: '노란 캐릭터', image: characterYellow },
];

const CHARACTER_API_IDS = [1, 2, 3, 4, 5] as const;

interface PartyCharacterLocationState {
  hostName?: string;
  partyDate?: string;
  partyTime?: string | null;
  startedDate?: string;
  startTime?: string;
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
  const { mutate: createRealtimeParty, isPending: isCreatingParty } = useCreateRealtimeParty();
  const { mutate: activateInviteLink, isPending: isActivatingInviteLink } = useActivateInviteLink();
  const isPending = isCreatingParty || isActivatingInviteLink;

  const handleSelectCharacter = () => {
    const { hostName, startedDate, startTime } = locationState;
    if (!hostName || !startedDate || !startTime) {
      navigate(ROUTES.createPartyTime, { replace: true });
      return;
    }

    setCreateError(null);
    const characterApiId =
      characterOptions?.[selectedIndex]?.characterId ?? CHARACTER_API_IDS[selectedIndex];

    createRealtimeParty(
      {
        celebrantNickname: hostName,
        startedDate,
        startTime,
        characterId: characterApiId,
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
                  characterId: CHARACTERS[selectedIndex].id,
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
    <div className="bg-gradient-bg flex min-h-screen flex-col overflow-hidden">
      <PageHeader />

      {createError && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/70 px-4 py-3 text-sm text-white">
          {createError}
        </div>
      )}

      <H1 className="mt-12 px-5">
        내 파티날,
        <br />
        나는 어떤 캐릭터로 등장할까요?
      </H1>

      <div className="mt-21">
        <Swiper
          modules={[EffectCoverflow]}
          effect="coverflow"
          slidesPerView="auto"
          centeredSlides
          spaceBetween={0}
          initialSlide={selectedIndex}
          coverflowEffect={{
            rotate: 0,
            stretch: 28,
            depth: 0,
            modifier: 1,
            scale: 0.62,
            slideShadows: false,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => setSelectedIndex(swiper.realIndex)}
          className="w-full overflow-visible"
        >
          {CHARACTERS.map((character, index) => (
            <SwiperSlide
              key={character.id}
              aria-label={character.name}
              style={{ width: 200 }}
              className="flex items-center justify-center"
            >
              <div
                className={`h-50 w-50 rounded-2xl p-3 transition-all duration-200 ${
                  index === selectedIndex
                    ? 'border-2 border-blue-500 bg-white'
                    : 'border-2 border-transparent bg-[#EEEEEE]'
                }`}
              >
                <img
                  src={character.image}
                  alt={character.name}
                  className="h-full w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-13 flex justify-center gap-10">
        <CarouselButton
          label="이전 캐릭터"
          onClick={() => swiperRef.current?.slidePrev()}
          direction="prev"
        />
        <CarouselButton
          label="다음 캐릭터"
          onClick={() => swiperRef.current?.slideNext()}
          direction="next"
        />
      </div>

      <div className="mt-auto px-5 pb-6">
        <Button size="full" disabled={isPending} onClick={handleSelectCharacter}>
          선택하기
        </Button>
      </div>
    </div>
  );
}

interface CarouselButtonProps {
  label: string;
  direction: 'prev' | 'next';
  onClick: () => void;
}

function CarouselButton({ label, direction, onClick }: CarouselButtonProps) {
  const Icon = direction === 'prev' ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-13 w-13 items-center justify-center rounded-full bg-blue-50 text-blue-600"
    >
      <Icon width={20} height={20} />
    </button>
  );
}
