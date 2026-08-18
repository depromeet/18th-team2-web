import Lottie from 'lottie-react';

import { Button } from '@/components/ui/Button';
import { B1 } from '@/components/ui/Typography';
import loadingBarAnimation from '@/assets/images/live-party/loading-bar.json';

interface PartyEntryReadyOverlayProps {
  isHost: boolean;
  onStartClick: () => void;
}

export function PartyEntryReadyOverlay({ isHost, onStartClick }: PartyEntryReadyOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-[var(--live-party-chat-min-height)] z-20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_36%,rgba(99,95,255,0.34)_0%,rgba(34,31,120,0.72)_42%,rgba(2,3,47,0.98)_100%)]" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        {isHost ? (
          <div className="flex flex-col items-center gap-8 [@media_(max-height:699px)]:gap-6">
            <B1 className="font-semibold whitespace-pre-line text-white">
              친구들이 다 모였다면{'\n'}파티를 시작해 주세요!
            </B1>
            <Button
              type="button"
              size="md"
              className="pointer-events-auto w-auto"
              onClick={onStartClick}
            >
              파티 시작하기
            </Button>
          </div>
        ) : (
          <>
            <Lottie animationData={loadingBarAnimation} className="mb-7 h-9 w-9" loop />
            <B1 className="font-semibold whitespace-pre-line text-white/60">
              주인공이 파티를 시작하기를{'\n'}기다리고 있어요
            </B1>
          </>
        )}
      </div>
    </div>
  );
}
