import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';

import { CloseIcon } from '@/components/ui/icons/CloseIcon';
import { H4, L2 } from '@/components/ui/Typography';

export interface GuideCarouselItem {
  imageSrc: string;
  text: string;
}

interface GuideCarouselDialogProps {
  isOpen: boolean;
  items: GuideCarouselItem[];
  onClose: () => void;
}

export function GuideCarouselDialog({ isOpen, ...props }: GuideCarouselDialogProps) {
  if (!isOpen) return null;
  return <GuideCarouselDialogContent {...props} />;
}

function GuideCarouselDialogContent({ items, onClose }: Omit<GuideCarouselDialogProps, 'isOpen'>) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isLast = activeIndex === items.length - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleNext = () => {
    if (isLast) {
      onClose();
      return;
    }
    swiper?.slideNext();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="guide-carousel-fade-in fixed inset-0 z-120 flex items-center justify-center"
    >
      <button
        type="button"
        aria-label="팝업 닫기"
        className="absolute inset-0 cursor-default bg-black/75"
        onClick={onClose}
      />
      <div className="relative flex flex-col items-end gap-2">
        <button
          type="button"
          aria-label="닫기"
          className="cursor-pointer p-1 text-white"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <div className="flex h-108 w-72.5 flex-col overflow-hidden rounded-2xl bg-[#172454]">
          <Swiper
            slidesPerView={1}
            className="min-h-0 w-full flex-1"
            onSwiper={setSwiper}
            onSlideChange={(instance) => setActiveIndex(instance.activeIndex)}
          >
            {items.map((item, index) => (
              <SwiperSlide key={`guide-slide-${index}`} className="flex! flex-col">
                <img
                  src={item.imageSrc}
                  alt=""
                  draggable={false}
                  className="h-70 w-72.5 object-cover"
                />
                <div className="flex flex-1 items-center justify-center px-5">
                  <H4 className="text-center whitespace-pre-line text-white">{item.text}</H4>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mt-auto flex items-center justify-between px-5 pb-5">
            <button type="button" className="w-12 max-w-12 cursor-pointer" onClick={onClose}>
              <L2 className="text-blue-100">건너뛰기</L2>
            </button>
            <div className="flex items-center gap-1.5">
              {items.map((_, index) => (
                <span
                  key={`guide-dot-${index}`}
                  className={`size-1.5 rounded-full ${
                    index === activeIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
            <button type="button" className="w-10 max-w-10 cursor-pointer" onClick={handleNext}>
              <L2 className="text-blue-100">다음</L2>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
