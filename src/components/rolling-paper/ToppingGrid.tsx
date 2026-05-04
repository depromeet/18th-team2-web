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

// 피그마 기준 375x350 토핑 영역 내 비율 (%)
// 1행 4개, 2행 3개 지그재그 배치
const TOPPING_POSITIONS = [
  { left: '2%', top: '14%' },
  { left: '25%', top: '2%' },
  { left: '48%', top: '18%' },
  { left: '73%', top: '0%' },
  { left: '5%', top: '50%' },
  { left: '34%', top: '56%' },
  { left: '71%', top: '48%' },
] as const;

interface ToppingGridProps {
  messages: RollingPaperMessage[];
  onToppingClick: (messageIndex: number) => void;
}

export function ToppingGrid({ messages, onToppingClick }: ToppingGridProps) {
  const totalPages = Math.ceil(messages.length / TOPPINGS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const showIndicator = messages.length > TOPPINGS_PER_PAGE;

  // 페이지별 토핑 슬라이드 생성
  const pages = Array.from({ length: totalPages }, (_, pageIndex) =>
    messages.slice(pageIndex * TOPPINGS_PER_PAGE, (pageIndex + 1) * TOPPINGS_PER_PAGE),
  );

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  return (
    <div className="relative z-10 flex flex-1 flex-col justify-center">
      <Swiper
        slidesPerView={1}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setCurrentPage(swiper.activeIndex)}
        className="aspect-375/350 w-full"
      >
        {pages.map((pageMessages, pageIndex) => (
          <SwiperSlide key={pageIndex}>
            <div className="relative h-full w-full">
              {/* 토핑 크기: 80/375 ≈ 21.3% */}
              {pageMessages.map((message, index) => {
                const pos = TOPPING_POSITIONS[index];
                const globalIndex = pageIndex * TOPPINGS_PER_PAGE + index;

                return (
                  <button
                    key={message.id}
                    type="button"
                    className="absolute z-10 flex w-[21.3%] cursor-pointer flex-col items-center gap-1"
                    style={{ left: pos.left, top: pos.top }}
                    onClick={() => onToppingClick(globalIndex)}
                  >
                    <img
                      src={TOPPING_IMAGES[message.toppingType]}
                      alt={message.writerName}
                      className="aspect-square w-full"
                      draggable={false}
                    />
                    <L1 className="w-full truncate text-center text-white">{message.writerName}</L1>
                  </button>
                );
              })}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 페이지 인디케이터 — 하단에서 60px */}
      {showIndicator && (
        <div className="absolute bottom-15 left-1/2 z-20 -translate-x-1/2">
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
