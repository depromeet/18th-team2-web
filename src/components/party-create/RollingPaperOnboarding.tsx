import { useState } from 'react';

import rollingPaperOnboardingFirstImage from '@/assets/images/create-party/rolling-paper-onboarding-01.png';
import rollingPaperOnboardingSecondImage from '@/assets/images/create-party/rolling-paper-onboarding-02.png';
import rollingPaperOnboardingThirdImage from '@/assets/images/create-party/rolling-paper-onboarding-03.png';
import rollingPaperOnboardingFourthImage from '@/assets/images/create-party/rolling-paper-onboarding-04.png';
import { GuideCarouselDialog, type GuideCarouselItem } from '@/components/ui/GuideCarouselDialog';

const ROLLING_PAPER_ONBOARDING_ITEMS: GuideCarouselItem[] = [
  { imageSrc: rollingPaperOnboardingFirstImage, text: '색다른 선물,\n롤링페이퍼를 받아보세요' },
  {
    imageSrc: rollingPaperOnboardingSecondImage,
    text: '7일 간 친구들이 익명으로\n편지를 남겨놔요',
  },
  { imageSrc: rollingPaperOnboardingThirdImage, text: '설정한 날에 맞춰\n롤링페이퍼가 도착해요' },
  {
    imageSrc: rollingPaperOnboardingFourthImage,
    text: 'SNS에 공유하면\n더 많은 사람들에게 받을 수 있어요',
  },
];

export function RollingPaperOnboarding() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <GuideCarouselDialog
      isOpen={isOpen}
      items={ROLLING_PAPER_ONBOARDING_ITEMS}
      onClose={() => setIsOpen(false)}
    />
  );
}
