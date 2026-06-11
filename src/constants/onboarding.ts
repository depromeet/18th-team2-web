import onboardingFirstImage from '@/assets/images/onboarding/onboarding-first.svg';
import onboardingSecondImage from '@/assets/images/onboarding/onboarding-second.svg';
import onboardingThirdImage from '@/assets/images/onboarding/onboarding-third.svg';

export const ONBOARDING_CONTENTS = [
  //TODO: 2,3번째 이미지 추후 디자인팀에서 추가 예정
  {
    imageSrc: onboardingFirstImage,
    text: {
      bigText: '생일, 그냥 넘기기 아쉬웠다면',
      smallText: '온라인으로 모여 짧게 축하받아보세요',
    },
  },
  {
    imageSrc: onboardingSecondImage,
    text: {
      bigText: '빠르고 가볍게, 생일답게',
      smallText: '함께 입장해 축하를 나눌 수 있어요',
    },
  },
  {
    imageSrc: onboardingThirdImage,
    text: {
      bigText: '함께 못 모여도 마음은 남길 수 있어요',
      smallText: '롤링페이퍼로 마음을 받고 남길 수 있어요',
    },
  },
];

export const ONBOARDING_SEEN_KEY = 'onboarding_seen';
