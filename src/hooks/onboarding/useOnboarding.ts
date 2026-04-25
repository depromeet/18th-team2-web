import { useRef, useState } from 'react';
import { ONBOARDING_CONTENTS } from '@/constants/onboarding';
import type { Swiper } from 'swiper/types';
import { useNavigate } from 'react-router-dom';

export function useOnboarding() {
  const swiperRef = useRef<Swiper | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastContent = currentIndex === ONBOARDING_CONTENTS.length - 1;

  const navigate = useNavigate();

  const handleNext = () => {
    if (isLastContent) {
      navigate('/');
      return;
    }

    swiperRef.current?.slideNext();
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleSlideChange = (swiper: Swiper) => {
    setCurrentIndex(swiper.activeIndex);
  };

  const handleSwiperInit = (swiper: Swiper) => {
    swiperRef.current = swiper;
  };

  return {
    currentIndex,
    isLastContent,
    handleNext,
    handleSkip,
    handleSlideChange,
    handleSwiperInit,
  };
}
