import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';

import { MessageCardBox } from '@/components/message/MessageCardBox';
import { MessageCloseButton } from '@/components/message/MessageCloseButton';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { B1, H2, L1 } from '@/components/ui/Typography';
import { useRollingPaperDetail, type RollingPaperMessage } from '@/services/rolling-paper';

interface MessageCardProps {
  partyId: string;
  messages: RollingPaperMessage[];
  initialIndex: number;
  onClose: () => void;
}

export function MessageCard({ partyId, messages, initialIndex, onClose }: MessageCardProps) {
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
                <MessageSlide partyId={partyId} message={msg} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* 인디케이터 — 메시지가 2개 이상일 때만 노출(N=1이면 prev/next 모두 비활성이라 무의미) */}
        {messages.length > 1 && (
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
        )}
      </div>
    </div>
  );
}

// 슬라이드 본체 — content는 모달이 열린 뒤 detail 엔드포인트로 lazy fetch.
// 작성자명(writerNickname)은 list에서 받은 값을 사용해 로딩 중에도 노출.
function MessageSlide({ partyId, message }: { partyId: string; message: RollingPaperMessage }) {
  const { data: detail, isLoading, isError } = useRollingPaperDetail(partyId, message.id);

  let body: string;
  if (isLoading) body = '메시지를 불러오는 중...';
  else if (isError) body = '메시지를 불러올 수 없어요';
  else body = detail?.content ?? '';

  return (
    <MessageCardBox>
      <H2 className="min-h-0 flex-1 overflow-y-auto font-semibold tracking-tight text-blue-600 opacity-90">
        {body}
      </H2>
      <B1 className="text-grey-700 text-right font-semibold">- {message.writerNickname}</B1>
    </MessageCardBox>
  );
}
