import Lottie from 'lottie-react';

import characterLoadingAnimation from '@/assets/images/common/loading-character.json';
import { ThreeDotsIcon } from '@/components/ui/icons/ThreeDotsIcon';
import { B1 } from '@/components/ui/Typography';

interface LoadingProps {
  variant?: 'overlay' | 'black';
}

export function Loading({ variant = 'overlay' }: LoadingProps) {
  if (variant === 'black') {
    return (
      <div className="flex h-full min-h-dvh flex-col items-center justify-center gap-2 bg-black/70">
        <Lottie animationData={characterLoadingAnimation} className="h-38.75 w-38.75" loop />
        <B1 as="p" className="text-grey-400">
          로딩중이에요
        </B1>
        <ThreeDotsIcon />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-2 bg-black/50">
      <Lottie animationData={characterLoadingAnimation} className="h-38.75 w-38.75" loop />
      <B1 as="p" className="text-grey-30">
        로딩중이에요
      </B1>
      <ThreeDotsIcon />
    </div>
  );
}
