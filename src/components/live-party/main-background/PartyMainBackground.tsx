import { useMemo } from 'react';

import cake from '@/assets/images/live-party/cake.svg';
import partyLight from '@/assets/images/live-party/party-light.png';

import { FloatingCharacter } from '@/components/live-party/main-background/FloatingCharacter';

import { PARTY_USER, type PartyUserRole } from '@/constants/live-party';
import { MOCK_PARTY_PARTICIPANTS } from '@/services/live-party';

interface PartyMainBackgroundProps {
  userRole: PartyUserRole;
}

export function PartyMainBackground({ userRole }: PartyMainBackgroundProps) {
  const isHost = userRole === PARTY_USER.HOST;

  const hostParticipant = useMemo(() => MOCK_PARTY_PARTICIPANTS.find((p) => p.role === 'host'), []);

  const allParticipants = useMemo(
    () => MOCK_PARTY_PARTICIPANTS.filter((p) => p.role !== 'host'),
    [],
  );

  // 참여자 뷰: 본인 캐릭터 / 주최자 뷰: 랜덤 참여자 1명
  const featuredParticipant = useMemo(() => {
    if (isHost) {
      return allParticipants[Math.floor(Math.random() * allParticipants.length)];
    }
    return allParticipants.find((p) => p.isCurrentUser) ?? allParticipants[0];
  }, [isHost, allParticipants]);

  const remainingParticipants = useMemo(
    () => allParticipants.filter((p) => p.id !== featuredParticipant?.id),
    [allParticipants, featuredParticipant],
  );

  const hostInitStyle = useMemo(
    () => ({
      left: 'calc(50% - 63px)',
      top: 'calc((100svh - 320px) / 2 + 20px)',
      animationDuration: '3s',
      animationDelay: '0s',
    }),
    [],
  );

  const featuredInitStyle = useMemo(
    () => ({
      left: 'calc(50% - 49px)',
      bottom: 'calc((100svh + 320px) / 2 + 70px)',
      animationDuration: '3s',
      animationDelay: '0s',
    }),
    [],
  );

  const participantInitStyles = useMemo(
    () =>
      remainingParticipants.map((_, index) => {
        const isLeftSide = index % 2 === 0;

        const left = isLeftSide ? `${4 + Math.random() * 24}%` : `${72 + Math.random() * 20}%`;

        return {
          left,
          top: `calc(80px + ${Math.random().toFixed(3)} * (100svh - 620px))`,
          animationDuration: `${(2.5 + Math.random()).toFixed(2)}s`,
          animationDelay: `${(Math.random() * 2).toFixed(2)}s`,
        };
      }),
    [remainingParticipants],
  );

  return (
    <>
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
            initStyle={hostInitStyle}
          />
        )}
        {featuredParticipant && (
          <FloatingCharacter
            key={featuredParticipant.id}
            image={featuredParticipant.image}
            name={featuredParticipant.name}
            size="lg"
            initStyle={featuredInitStyle}
          />
        )}
        {remainingParticipants.map((participant, index) => (
          <FloatingCharacter
            key={participant.id}
            image={participant.image}
            name={participant.name}
            size="sm"
            initStyle={participantInitStyles[index]}
          />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 bottom-[320px] z-1 flex items-center justify-center"
      >
        <img src={cake} alt="" className="h-40 w-60" />
      </div>
    </>
  );
}
