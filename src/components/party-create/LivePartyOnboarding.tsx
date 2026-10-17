import { useState } from 'react';

import livePartyOnboardingFirstImage from '@/assets/images/create-party/live-party-onboarding-01.png';
import livePartyOnboardingSecondImage from '@/assets/images/create-party/live-party-onboarding-02.png';
import livePartyOnboardingThirdImage from '@/assets/images/create-party/live-party-onboarding-03.png';
import livePartyOnboardingFourthImage from '@/assets/images/create-party/live-party-onboarding-04.png';
import { GuideCarouselDialog, type GuideCarouselItem } from '@/components/ui/GuideCarouselDialog';

const PARTY_ONBOARDING_ITEMS: GuideCarouselItem[] = [
  {
    imageSrc: livePartyOnboardingFirstImage,
    text: '내 생일날 실시간으로 \n5분 이내 파티를 즐겨요',
  },
  { imageSrc: livePartyOnboardingSecondImage, text: '파티는 약 5분 간 \n4단계로 진행돼요' },
  {
    imageSrc: livePartyOnboardingThirdImage,
    text: '촛불 불기, 박터뜨리기는\n친구들과 같이 할 수 있어요',
  },
  {
    imageSrc: livePartyOnboardingFourthImage,
    text: '파티가 끝난 후에도 7일 더\n롤링페이퍼를 받을 수 있어요',
  },
];

export function LivePartyOnboarding() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <GuideCarouselDialog
      isOpen={isOpen}
      items={PARTY_ONBOARDING_ITEMS}
      onClose={() => setIsOpen(false)}
    />
  );
}
