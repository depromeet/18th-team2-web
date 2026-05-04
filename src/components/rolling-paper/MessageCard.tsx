import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';

import type { RollingPaperMessage } from '@/services/rolling-paper';
import { H2, B1, L1 } from '@/components/ui/Typography';

interface MessageCardProps {
  messages: RollingPaperMessage[];
  initialIndex: number;
  onClose: () => void;
}

export function MessageCard({ messages, initialIndex, onClose }: MessageCardProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      {/* 컨텐츠 — 수직 중앙 */}
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
        style={{ width: '100%', maxWidth: 430, gap: 60 }}
      >
        {/* 닫기 + 카드 영역 */}
        <div className="flex w-full flex-col items-end" style={{ gap: 12, paddingRight: 4 }}>
          {/* 닫기 버튼 */}
          <button
            type="button"
            aria-label="메시지 닫기"
            className="flex items-center justify-center"
            style={{ width: 48, height: 48, padding: 10 }}
            onClick={onClose}
          >
            <CloseIcon />
          </button>

          {/* 카드 캐러셀 */}
          <Swiper
            slidesPerView="auto"
            centeredSlides
            spaceBetween={12}
            initialSlide={initialIndex}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            className="w-full overflow-visible"
          >
            {messages.map((msg) => (
              <SwiperSlide key={msg.id} style={{ width: 'calc(100% - 60px)', maxWidth: 343 }}>
                <div
                  className="flex flex-col bg-white"
                  style={{ height: 252, borderRadius: 20, padding: 24, gap: 12 }}
                >
                  <H2
                    className="flex-1 overflow-y-auto font-semibold text-blue-600 opacity-90"
                    style={{ letterSpacing: '-0.0001em' }}
                  >
                    {msg.content}
                  </H2>
                  <B1 className="text-right font-semibold text-grey-700">- {msg.writerName}</B1>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 인디케이터 */}
        <div
          className="flex items-center justify-center bg-black"
          style={{ height: 32, borderRadius: 35, padding: '6px 8px', gap: 4 }}
        >
          <button
            type="button"
            aria-label="이전 메시지"
            className="flex items-center justify-center"
            style={{ width: 16, height: 16 }}
            onClick={handlePrev}
            disabled={currentIndex <= 0}
          >
            <ChevronIcon direction="left" />
          </button>
          <L1 className="text-center font-medium text-white" style={{ minWidth: 33 }}>
            {currentIndex + 1} / {messages.length}
          </L1>
          <button
            type="button"
            aria-label="다음 메시지"
            className="flex items-center justify-center"
            style={{ width: 16, height: 16 }}
            onClick={handleNext}
            disabled={currentIndex >= messages.length - 1}
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.6 4.6L19.4 19.4M19.4 4.6L4.6 19.4"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  const d =
    direction === 'left'
      ? 'M9.33 3.07L4.67 7.73 9.33 12.4'
      : 'M6.67 3.07L11.33 7.73 6.67 12.4';

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={d}
        stroke="#BEBEBF"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
