import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';

import type { RollingPaperMessage, ToppingType } from '@/services/rolling-paper';
import toppingCherry from '@/assets/images/topping-cherry.png';
import toppingStrawberry from '@/assets/images/topping-strawberry.png';
import toppingCandle from '@/assets/images/topping-candle.png';
import { L1 } from '@/components/ui/Typography';
import { PageIndicator } from '@/components/rolling-paper/PageIndicator';

const TOPPINGS_PER_PAGE = 7;

const TOPPING_IMAGES: Record<ToppingType, string> = {
  cherry: toppingCherry,
  strawberry: toppingStrawberry,
  candle: toppingCandle,
};

// 피그마 기준 375x350 고정 토핑 무대 내 좌표(px)
// 1행 4개, 2행 3개 지그재그 배치
const TOPPING_POSITIONS = [
  { left: 16, top: 68 },
  { left: 104, top: 20 },
  { left: 192, top: 90 },
  { left: 279, top: 0 },
  { left: 36, top: 186 },
  { left: 148, top: 206 },
  { left: 260, top: 178 },
] as const;

interface ToppingGridProps {
  messages: RollingPaperMessage[];
  onToppingClick: (messageIndex: number) => void;
  initialPage?: number;
}

export function ToppingGrid({ messages, onToppingClick, initialPage = 0 }: ToppingGridProps) {
  const totalPages = Math.ceil(messages.length / TOPPINGS_PER_PAGE);
  const safeInitialPage = Math.min(Math.max(initialPage, 0), Math.max(totalPages - 1, 0));
  const [currentPage, setCurrentPage] = useState(safeInitialPage);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const showIndicator = messages.length > TOPPINGS_PER_PAGE;

  // 페이지별 토핑 슬라이드 생성
  const pages = Array.from({ length: totalPages }, (_, pageIndex) =>
    messages.slice(pageIndex * TOPPINGS_PER_PAGE, (pageIndex + 1) * TOPPINGS_PER_PAGE),
  );

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <div
        className="pointer-events-auto absolute left-0 h-[350px] w-full"
        style={{ top: 'calc(var(--rolling-paper-art-offset) + 240px)' }}
      >
        <Swiper
          slidesPerView={1}
          initialSlide={safeInitialPage}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
          className="h-full w-full"
        >
          {pages.map((pageMessages, pageIndex) => (
            <SwiperSlide key={pageIndex}>
              <div className="relative h-full w-full">
                {pageMessages.map((message, index) => {
                  const pos = TOPPING_POSITIONS[index];
                  const globalIndex = pageIndex * TOPPINGS_PER_PAGE + index;

                  return (
                    <button
                      key={message.id}
                      type="button"
                      className="absolute z-10 flex w-20 cursor-pointer flex-col items-center gap-1"
                      style={{ left: `calc(50% - 187.5px + ${pos.left}px)`, top: `${pos.top}px` }}
                      onClick={() => onToppingClick(globalIndex)}
                    >
                      <img
                        src={TOPPING_IMAGES[message.toppingType]}
                        alt={message.writerNickname}
                        className="aspect-square w-full"
                        draggable={false}
                      />
                      <L1 className="w-full truncate text-center text-white">
                        {message.writerNickname}
                      </L1>
                    </button>
                  );
                })}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showIndicator && (
        <div className="pointer-events-auto absolute bottom-[197px] left-1/2 z-20 -translate-x-1/2">
          <PageIndicator
            current={currentPage + 1}
            total={totalPages}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      )}
    </div>
  );
}
