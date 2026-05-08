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

// TODO: 캐릭터 조회 API 연결 시 교체
const CHARACTERS = [
  { id: 'character-blue', name: '파란 캐릭터', image: characterBlue },
  { id: 'character-brown', name: '갈색 캐릭터', image: characterBrown },
  { id: 'character-pink', name: '분홍 캐릭터', image: characterPink },
  { id: 'character-white', name: '하얀 캐릭터', image: characterWhite },
  { id: 'character-yellow', name: '노란 캐릭터', image: characterYellow },
];

export default function PartyCharacterSelectPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const swiperRef = useRef<SwiperType | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelectCharacter = () => {
    // TODO: 캐릭터 선택 API/다음 단계 연결
    navigate(ROUTES.createPartyComplete, {
      state: {
        ...(typeof location.state === 'object' && location.state ? location.state : {}),
        characterId: CHARACTERS[selectedIndex].id,
      },
    });
  };

  return (
    <div className="bg-gradient-bg flex min-h-screen flex-col overflow-hidden">
      <PageHeader />

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
        <Button size="full" onClick={handleSelectCharacter}>
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
