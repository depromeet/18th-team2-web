import { useLocation, useParams } from 'react-router-dom';

import characterBlueHostSrc from '@/assets/images/character/character-blue-host.png';
import whiteGradientBig from '@/assets/images/live-party/white-gradient-big.png';
import { T3 } from '@/components/ui/Typography';
import { useGetPartyParticipants } from '@/services/live-party';
import { resolveImageUrl } from '@/utils/image';

export function PartyEntryStage() {
  const location = useLocation();
  const hostName = (location.state as { hostName?: string } | null)?.hostName;

  const { partyId } = useParams<{ partyId: string }>();
  const { data: participantsData } = useGetPartyParticipants(partyId);
  const celebrant = participantsData?.participants.find((p) => p.isCelebrant);
  const characterImage = resolveImageUrl(celebrant?.characterImageUrl ?? null);

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
          className="party-enter-character h-40.5 w-40.5 object-contain"
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
    </div>
  );
}
