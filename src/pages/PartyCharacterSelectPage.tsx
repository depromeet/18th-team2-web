import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { EffectCoverflow } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper/types';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/Button';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { H1 } from '@/components/ui/Typography';
import { ROUTES } from '@/constants/routes';

// TODO: 캐릭터 조회 API 연결 시 제거
const TEMP_CHARACTERS = [
  { id: 'character-1', name: '임시 캐릭터 1' },
  { id: 'character-2', name: '임시 캐릭터 2' },
  { id: 'character-3', name: '임시 캐릭터 3' },
  { id: 'character-4', name: '임시 캐릭터 4' },
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
        characterId: TEMP_CHARACTERS[selectedIndex].id,
      },
    });
  };

  return (
    <MobileLayout>
      <div className="bg-gradient-bg flex min-h-screen flex-col overflow-hidden">
        <header className="px-5 pt-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.createPartyTime)}
            aria-label="뒤로가기"
            className="text-grey-800 -ml-2 flex h-10 w-10 items-center justify-center"
          >
            <ChevronLeftIcon />
          </button>
        </header>

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
            {TEMP_CHARACTERS.map((character, index) => (
              <SwiperSlide
                key={character.id}
                aria-label={character.name}
                style={{ width: 200 }}
                className="flex items-center justify-center"
              >
                {/* TODO: 캐릭터 에셋 연결 시 더미 체크무늬 교체 */}
                <div
                  className={`h-50 w-50 border border-black transition-opacity duration-200 ${
                    index === selectedIndex ? 'opacity-100' : 'opacity-25'
                  }`}
                  style={{
                    backgroundColor: '#fff',
                    backgroundImage:
                      'linear-gradient(45deg, #eeeeee 25%, transparent 25%), linear-gradient(-45deg, #eeeeee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eeeeee 75%), linear-gradient(-45deg, transparent 75%, #eeeeee 75%)',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                    backgroundSize: '20px 20px',
                  }}
                />
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
    </MobileLayout>
  );
}

interface CarouselButtonProps {
  label: string;
  direction: 'prev' | 'next';
  onClick: () => void;
}

function CarouselButton({ label, direction, onClick }: CarouselButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="bg-blue-50 text-blue-600 flex h-13 w-13 items-center justify-center rounded-full"
    >
      <ChevronIcon direction={direction} />
    </button>
  );
}

function ChevronIcon({ direction }: { direction: 'prev' | 'next' }) {
  const path = direction === 'prev' ? 'M11.9 8.2L4.1 16L11.9 23.8' : 'M4.1 8.2L11.9 16L4.1 23.8';

  return (
    <svg width="16" height="32" viewBox="0 0 16 32" fill="none" aria-hidden>
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
