import characterBlueHostSrc from '@/assets/images/character/character-blue-host.png';
import whiteGradientBig from '@/assets/images/live-party/white-gradient-big.png';

import { Button } from '@/components/ui/Button';
import { T3 } from '@/components/ui/Typography';

interface PartyEntryStageProps {
  hostName?: string;
  characterImage?: string | null;
  onComplete?: () => void;
}

export function PartyEntryStage({
  hostName,
  characterImage,
  onComplete,
}: PartyEntryStageProps) {
  const hostLabel = hostName ? `${hostName}님이` : '주인공이';

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <img
        src={whiteGradientBig}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full"
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-20 px-2">
        <img
          src={characterImage ?? characterBlueHostSrc}
          alt={hostName ? `${hostName}님 캐릭터` : '주인공 캐릭터'}
          className="party-enter-character h-44 w-44 object-contain"
          draggable={false}
        />
        <T3 className="text-center text-white">
          오늘의 주인공
          <br />
          {hostLabel}
          <br />
          등장했어요!
        </T3>
      </div>
      <div className="z-1 px-4 pb-8">
        <Button onClick={onComplete}>파티 시작하기</Button>
      </div>
    </div>
  );
}
