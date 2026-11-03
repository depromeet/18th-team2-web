import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';

import lockIcon from '@/assets/images/icons/rolling-paper-lock.svg';
import { MessageCardBox } from '@/components/message/MessageCardBox';
import { MessageCloseButton } from '@/components/message/MessageCloseButton';
import { ChevronLeftIcon } from '@/components/ui/icons/ChevronLeftIcon';
import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { B1, H2, L1 } from '@/components/ui/Typography';
import type { RollingPaperMessage } from '@/services/rolling-paper';
import { parseKstDateTime } from '@/utils/date';

interface LockedMessageCardProps {
  messages: RollingPaperMessage[];
  initialIndex: number;
  viewableAt?: string;
  onClose: () => void;
  onViewable?: () => void;
}

const PLACEHOLDER_MESSAGE = '생일 축하해! 오늘 하루 누구보다 행복하고 즐거운 일만 가득하기를 바라.';

function formatRemainingTime(remainingMs: number) {
  if (remainingMs <= 0) return '곧 공개돼요';

  const totalMinutes = Math.max(1, Math.ceil(remainingMs / 60_000));
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  const parts = [
    days > 0 ? `${days}일` : '',
    hours > 0 ? `${hours}시간` : '',
    minutes > 0 ? `${minutes}분` : '',
  ].filter(Boolean);

  return `${parts.join(' ')} 남았어요`;
}

export function LockedMessageCard({
  messages,
  initialIndex,
  viewableAt,
  onClose,
  onViewable,
}: LockedMessageCardProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [openedAt] = useState(() => Date.now());
  const [now, setNow] = useState(openedAt);
  const onViewableRef = useRef(onViewable);
  const hasNotifiedViewableRef = useRef(false);
  const viewableAtMs = viewableAt ? parseKstDateTime(viewableAt).valueOf() : Number.NaN;
  const hasValidViewableAt = Number.isFinite(viewableAtMs);
  const remainingMs = hasValidViewableAt ? Math.max(viewableAtMs - now, 0) : 0;
  const totalMs = hasValidViewableAt ? Math.max(viewableAtMs - openedAt, 1) : 1;
  const progress = hasValidViewableAt
    ? Math.min(100, Math.max(0, ((now - openedAt) / totalMs) * 100))
    : 0;

  useEffect(() => {
    onViewableRef.current = onViewable;
  }, [onViewable]);

  useEffect(() => {
    if (!hasValidViewableAt) return;

    function notifyViewable() {
      if (hasNotifiedViewableRef.current) return;
      hasNotifiedViewableRef.current = true;
      onViewableRef.current?.();
    }

    if (viewableAtMs <= Date.now()) {
      notifyViewable();
      return;
    }

    const timer = window.setInterval(() => {
      const nextNow = Date.now();
      setNow(nextNow);
      if (nextNow >= viewableAtMs) {
        window.clearInterval(timer);
        notifyViewable();
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [hasValidViewableAt, viewableAtMs]);

  const handlePrev = () => swiperInstance?.slidePrev();
  const handleNext = () => swiperInstance?.slideNext();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="롤링페이퍼 공개 안내"
      className="fixed inset-0 z-50 bg-black/70"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="absolute top-1/2 left-1/2 flex w-full max-w-150 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-15">
        <div className="flex w-full flex-col items-end gap-3 pr-1">
          <MessageCloseButton onClick={onClose} />

          <Swiper
            slidesPerView="auto"
            centeredSlides
            spaceBetween={12}
            initialSlide={initialIndex}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
            className="w-full overflow-visible"
          >
            {messages.map((message) => (
              <SwiperSlide
                key={message.id}
                className="max-w-85.75"
                style={{ width: 'calc(100% - 60px)' }}
              >
                <div className="relative overflow-hidden rounded-[20px]">
                  <div className="blur-[3px]" aria-hidden="true">
                    <MessageCardBox>
                      <H2 className="min-h-0 flex-1 overflow-hidden font-semibold tracking-tight text-blue-600 opacity-60">
                        {PLACEHOLDER_MESSAGE}
                      </H2>
                      <B1 className="text-grey-700 text-right font-semibold opacity-60">
                        - {message.writerNickname}
                      </B1>
                    </MessageCardBox>
                  </div>

                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/65 via-white/90 to-white px-6">
                    <img src={lockIcon} alt="" />
                    <p className="mt-3 text-base font-medium text-black/70">롤링페이퍼 공개까지</p>
                    <p
                      className="mt-1 text-[22px] leading-8 font-bold text-blue-800"
                      aria-live="polite"
                    >
                      {hasValidViewableAt
                        ? formatRemainingTime(remainingMs)
                        : '공개 시간을 확인 중이에요'}
                    </p>
                    <div
                      role="progressbar"
                      aria-label="롤링페이퍼 공개 진행률"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress)}
                      className="rolling-paper-lock-progress mt-5 h-2.25 w-full overflow-hidden rounded-[20px] bg-blue-50"
                    >
                      <div
                        className="h-full rounded-[20px] bg-gradient-to-r from-blue-600 to-blue-300 transition-[width] duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

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
