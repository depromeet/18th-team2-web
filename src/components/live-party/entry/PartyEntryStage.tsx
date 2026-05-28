import { useParams } from 'react-router-dom';

import defaultCharacterSrc from '@/assets/images/character/character-brown-full.png';
import whiteGradientBig from '@/assets/images/live-party/white-gradient-big.png';

import { Button } from '@/components/ui/Button';
import { T3 } from '@/components/ui/Typography';
import { useGetPartyParticipants } from '@/services/live-party';
import { usePartyStore } from '@/stores/usePartyStore';
import { resolveImageUrl } from '@/utils/image';

interface PartyEntryStageProps {
  onComplete?: () => void;
}

export function PartyEntryStage({ onComplete }: PartyEntryStageProps) {
  const { partyId } = useParams<{ partyId: string }>();
  const { data: participantsData } = useGetPartyParticipants(partyId);
  const hostName = usePartyStore((s) => s.hostName);

  const host = participantsData?.data?.participants?.find((p) => p.isCelebrant);
  const hostImageSrc = resolveImageUrl(host?.characterImageUrl) ?? defaultCharacterSrc;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <img
        src={whiteGradientBig}
        alt=""
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full"
      />

      <div className="flex flex-1 flex-col items-center justify-center gap-20 px-2">
        <img src={hostImageSrc} alt={hostName} className="party-enter-character w-44" />
        <T3 className="text-center text-white">
          오늘의 주인공
          <br />
          {hostName}님이
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
