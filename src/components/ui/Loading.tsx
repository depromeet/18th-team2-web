import Lottie from 'lottie-react';

import loadingAnimation from '@/assets/images/common/loading-character.json';
import { B1 } from './Typography';

interface LoadingProps {
  variant?: 'overlay' | 'white';
}

export function Loading({ variant = 'overlay' }: LoadingProps) {
  if (variant === 'white') {
    return (
      <div className="flex h-full min-h-screen flex-col items-center justify-center gap-2 bg-white">
        <Lottie animationData={loadingAnimation} className="h-38.75 w-38.75" loop />
        <B1 as="p" className="text-grey-400">
          로딩중이에요
        </B1>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-200 flex flex-col items-center justify-center gap-2 bg-black/50">
      <Lottie animationData={loadingAnimation} className="h-38.75 w-38.75" loop />
      <B1 as="p" className="text-grey-30">
        로딩중이에요
      </B1>
    </div>
  );
}
