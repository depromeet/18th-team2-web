import { type MouseEvent } from 'react';
import { Button } from '@/components/ui/Button';
import WhiteGradientIconSvg from '@/assets/images/live-party/white-gradient.svg?react';
import { B1 } from '@/components/ui/Typography';

interface PartyEntryFooterProps {
  showButton: boolean;
  onStart: (e: MouseEvent) => void;
}

export function PartyEntryFooter({ showButton, onStart }: PartyEntryFooterProps) {
  return (
    <footer className="absolute right-0 bottom-0 left-0 z-10 flex flex-col items-center pb-[calc(112px+env(safe-area-inset-bottom))] [@media_(max-height:700px)]:pb-[calc(72px+env(safe-area-inset-bottom))]">
      {showButton ? (
        <Button onClick={onStart} className="party-enter-button" size="md">
          커튼열기
        </Button>
      ) : (
        <>
          <WhiteGradientIconSvg className="mb-3" />
          <B1 as="p" className="font-normal text-white/60">
            터치하면 다음으로 넘어가요
          </B1>
        </>
      )}
    </footer>
  );
}
