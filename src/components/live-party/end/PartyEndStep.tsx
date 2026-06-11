import hapalinPartyCard from '@/assets/images/common/hapalin-party-card.png';
import { PartyEndText } from '@/components/live-party/end/PartyEndText';
import { type PartyUserRole } from '@/constants/live-party';
import { PartyEndButton } from '@/components/live-party/end/PartyEndButton';
import type { RealtimePartyNextActionResult } from '@/services/live-party';

interface PartyEndStepProps {
  role: PartyUserRole;
  action?: RealtimePartyNextActionResult | null;
  hostName?: string;
}

export function PartyEndStep({ role, action, hostName }: PartyEndStepProps) {
  return (
    <div className="party-intro-screen relative flex h-screen w-full flex-col items-center overflow-hidden pt-[20vh]">
      <PartyEndText role={role} />
      <div className="relative z-10 mt-[4vh] w-full">
        <img
          src={hapalinPartyCard}
          alt="파티 케이크"
          className="party-intro-card w-full select-none"
          draggable={false}
        />
      </div>
      <div className="party-intro-overlay pointer-events-none absolute right-0 bottom-0 left-0 h-[50%]" />
      <PartyEndButton role={role} action={action} hostName={hostName} />
    </div>
  );
}
