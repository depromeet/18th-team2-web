import { OnboardingContent } from '@/components/onboarding/OnboardingContent';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { B1 } from '@/components/ui/Typography';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import '@/styles/onboarding-swiper.css';
import { useOnboarding } from '@/hooks/onboarding/useOnboarding';
import { ONBOARDING_CONTENTS } from '@/constants/onboarding';
import { Button } from '@/components/ui/Button';

export default function OnboardingPage() {
  const {
    isLastContent,
    handleNext,
    handleStart,
    handleSkip,
    handleSlideChange,
    handleSwiperInit,
  } = useOnboarding();

  return (
    <MobileLayout>
      <main className="flex flex-1 flex-col items-center justify-between bg-linear-to-b from-[#3F00B5] to-[#5892FF] px-4 py-4">
        <header className="flex h-11 w-full justify-end">
          <button className="cursor-pointer p-3" onClick={handleSkip}>
            <B1 className="text-white/50">건너뛰기</B1>
          </button>
        </header>
        <div className="flex w-full flex-col gap-9">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            className="onboarding-swiper w-full"
            onSwiper={handleSwiperInit}
            onSlideChange={handleSlideChange}
            pagination={{
              clickable: true,
              el: '.onboarding-pagination',
            }}
          >
            {ONBOARDING_CONTENTS.map((content, index) => (
              <SwiperSlide key={`onboarding-slide-${index}`}>
                <OnboardingContent imageSrc={content.imageSrc} text={content.text} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="onboarding-pagination flex items-center justify-center gap-2" />
        </div>

        {isLastContent ? (
          <Button variant="white" onClick={handleStart}>
            시작하기
          </Button>
        ) : (
          <Button variant="ghost" onClick={handleNext}>
            다음
          </Button>
        )}
      </main>
    </MobileLayout>
  );
}
