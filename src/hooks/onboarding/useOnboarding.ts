import { useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ONBOARDING_CONTENTS, ONBOARDING_SEEN_KEY } from '@/constants/onboarding';
import { ROUTES } from '@/constants/routes';
import type { Swiper } from 'swiper/types';

export function useOnboarding() {
  const swiperRef = useRef<Swiper | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastContent = currentIndex === ONBOARDING_CONTENTS.length - 1;

  const navigate = useNavigate();

  const handleNext = () => {
    if (isLastContent) {
      navigate(ROUTES.home);
      return;
    }

    swiperRef.current?.slideNext();
  };

  const handleStart = () => {
    sessionStorage.setItem(ONBOARDING_SEEN_KEY, '1');
    navigate(ROUTES.home);
  };

  const handleSkip = () => {
    sessionStorage.setItem(ONBOARDING_SEEN_KEY, '1');
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
