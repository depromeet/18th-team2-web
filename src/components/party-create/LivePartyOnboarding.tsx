import livePartyOnboardingFirstImage from '@/assets/images/create-party/live-party-onboarding-01.png';
import livePartyOnboardingSecondImage from '@/assets/images/create-party/live-party-onboarding-02.png';
import livePartyOnboardingThirdImage from '@/assets/images/create-party/live-party-onboarding-03.png';
import livePartyOnboardingFourthImage from '@/assets/images/create-party/live-party-onboarding-04.png';
import { GuideCarouselDialog, type GuideCarouselItem } from '@/components/ui/GuideCarouselDialog';
import { LIVE_PARTY_ONBOARDING_SEEN_KEY } from '@/constants/partyCreate';
import { useGuideSeenOnce } from '@/hooks/useGuideSeenOnce';

const PARTY_ONBOARDING_ITEMS: GuideCarouselItem[] = [
  {
    imageSrc: livePartyOnboardingFirstImage,
    text: '내 생일날 색다른 컨텐츠로 \n5분 이내 파티를 즐겨요',
  },
  { imageSrc: livePartyOnboardingSecondImage, text: '파티는 약 5분 간 \n4단계로 진행돼요' },
  {
    imageSrc: livePartyOnboardingThirdImage,
    text: '실시간으로 친구들과\n축하의 마음을 나눠요',
  },
  {
    imageSrc: livePartyOnboardingFourthImage,
    text: '파티가 끝난 후에도\n친구들이 7일간 편지를 남겨요',
  },
];

export function LivePartyOnboarding() {
  const { isOpen, close } = useGuideSeenOnce(LIVE_PARTY_ONBOARDING_SEEN_KEY);

  return (
    <GuideCarouselDialog
      isOpen={isOpen}
      items={PARTY_ONBOARDING_ITEMS}
      onClose={close}
      ariaLabel="실시간 파티 만들기 가이드"
    />
  );
}
