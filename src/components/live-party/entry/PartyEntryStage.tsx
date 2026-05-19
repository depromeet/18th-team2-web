import DefaultHost from '@/assets/images/live-party/default-host.svg?react';
import whiteGradientBig from '@/assets/images/live-party/white-gradient-big.png';

import { Button } from '@/components/ui/Button';
import { T3 } from '@/components/ui/Typography';

interface PartyEntryStageProps {
  onComplete?: () => void;
}

export function PartyEntryStage({ onComplete }: PartyEntryStageProps) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <img
        src={whiteGradientBig}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full"
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-20 px-2">
        <DefaultHost className="party-enter-character w-44" />
        <T3 className="text-center text-white">
          오늘의 주인공
          <br />
          이라님이
          <br />
          등장했어요!
        </T3>
      </div>
      {/** TODO: 디자인 아직 나오지 않음 */}
      <div className="z-1 px-4 pb-8">
        <Button onClick={onComplete} className="">
          파티 시작하기
        </Button>
      </div>
    </div>
  );
}
