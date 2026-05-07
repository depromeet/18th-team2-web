import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';

import { MessageCardBox } from '@/components/message/MessageCardBox';
import { MessageCloseButton } from '@/components/message/MessageCloseButton';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { B1, H2, L1 } from '@/components/ui/Typography';
import type { RollingPaperMessage } from '@/services/rolling-paper';

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
      className="fixed inset-0 z-50 bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* 컨텐츠 — 수직 중앙 */}
      <div className="absolute top-1/2 left-1/2 flex w-full max-w-150 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-15">
        {/* 닫기 + 카드 영역 */}
        <div className="flex w-full flex-col items-end gap-3 pr-1">
          {/* 닫기 버튼 */}
          <MessageCloseButton onClick={onClose} />

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
              <SwiperSlide
                key={msg.id}
                className="max-w-85.75"
                style={{ width: 'calc(100% - 60px)' }}
              >
                <MessageCardBox>
                  <H2 className="min-h-0 flex-1 overflow-y-auto font-semibold tracking-tight text-blue-600 opacity-90">
                    {msg.content}
                  </H2>
                  <B1 className="text-grey-700 text-right font-semibold">- {msg.writerName}</B1>
                </MessageCardBox>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 인디케이터 */}
        <div className="flex h-8 items-center justify-center gap-1 rounded-full bg-black px-2 py-1.5">
          <button
            type="button"
            aria-label="이전 메시지"
            className="flex h-4 w-4 cursor-pointer items-center justify-center"
            onClick={handlePrev}
            disabled={currentIndex <= 0}
          >
            <ChevronLeftIcon width={16} height={16} className="text-grey-200" />
          </button>
          <L1 className="min-w-8 text-center font-medium text-white">
            {currentIndex + 1} / {messages.length}
          </L1>
          <button
            type="button"
            aria-label="다음 메시지"
            className="flex h-4 w-4 cursor-pointer items-center justify-center"
            onClick={handleNext}
            disabled={currentIndex >= messages.length - 1}
          >
            <ChevronRightIcon width={16} height={16} className="text-grey-200" />
          </button>
        </div>
      </div>
    </div>
  );
}
