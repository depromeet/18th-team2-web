import cake from '@/assets/images/live-party/cake.svg';
import partyLight from '@/assets/images/live-party/party-light.png';

import { FloatingCharacter } from '@/components/live-party/main-background/FloatingCharacter';
import { usePartyMainBackground } from '@/hooks/live-party/usePartyMainBackground';

interface PartyMainBackgroundProps {
  isBlurred?: boolean;
}

export function PartyMainBackground({ isBlurred = false }: PartyMainBackgroundProps) {
  const {
    fireworks,
    jumpingParticipantId,
    hostParticipant,
    featuredParticipant,
    remainingParticipants,
    hostInitStyle,
    featuredInitStyle,
    participantInitStyles,
  } = usePartyMainBackground();

  return (
    <div
      className={`pointer-events-none absolute inset-0 transition-[filter] duration-300 ${
        isBlurred ? 'blur-[6px] brightness-[0.55]' : ''
      }`}
    >
      <img
        src={partyLight}
        aria-hidden
        alt=""
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 z-10 overflow-hidden">
        {hostParticipant && (
          <FloatingCharacter
            image={hostParticipant.image}
            name={hostParticipant.name}
            size="xl"
            isHost
            isJumping={jumpingParticipantId === hostParticipant.id}
            initStyle={hostInitStyle}
          />
        )}
        {featuredParticipant && (
          <FloatingCharacter
            key={featuredParticipant.id}
            image={featuredParticipant.image}
            name={featuredParticipant.name}
            size="lg"
            isJumping={jumpingParticipantId === featuredParticipant.id}
            initStyle={featuredInitStyle}
          />
        )}
        {remainingParticipants.map((participant, index) => (
          <FloatingCharacter
            key={participant.id}
            image={participant.image}
            name={participant.name}
            size="sm"
            isJumping={jumpingParticipantId === participant.id}
            initStyle={participantInitStyles[index]}
          />
        ))}
        {fireworks.map((fw) => (
          <img
            key={fw.id}
            src={fw.image}
            aria-hidden
            alt=""
            className="firework-fade pointer-events-none absolute"
            style={{ left: fw.left, top: fw.top }}
          />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 bottom-[320px] z-1 flex items-center justify-center"
      >
        <img src={cake} alt="" className="h-40 w-60" />
      </div>
    </div>
  );
}
