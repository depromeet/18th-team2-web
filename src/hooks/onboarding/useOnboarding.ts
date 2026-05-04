import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ONBOARDING_CONTENTS } from '@/constants/onboarding';
import { ROUTES } from '@/constants/routes';
import type { Swiper } from 'swiper/types';

export function useOnboarding() {
  const swiperRef = useRef<Swiper | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastContent = currentIndex === ONBOARDING_CONTENTS.length - 1;

  const navigate = useNavigate();

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  const handleStart = () => {
    navigate(ROUTES.home);
  };

  const handleSkip = () => {
    navigate(ROUTES.home);
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
    handleStart,
    handleSkip,
    handleSlideChange,
    handleSwiperInit,
  };
}
