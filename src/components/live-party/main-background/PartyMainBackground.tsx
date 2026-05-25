import { useEffect, useMemo, useRef, useState } from 'react';

import cake from '@/assets/images/live-party/cake.svg';
import fireworkBig from '@/assets/images/live-party/firework-big.svg';
import fireworkSmall from '@/assets/images/live-party/firework-small.svg';
import partyLight from '@/assets/images/live-party/party-light.png';

import { FloatingCharacter } from '@/components/live-party/main-background/FloatingCharacter';

import { PARTY_USER, type PartyUserRole } from '@/constants/live-party';
import { MOCK_PARTY_PARTICIPANTS } from '@/services/live-party';
import { useFirecrackerStore } from '@/stores/useFirecrackerStore';

interface PartyMainBackgroundProps {
  userRole: PartyUserRole;
  isBlurred?: boolean;
}

interface Firework {
  id: number;
  image: string;
  left: string;
  top: string;
}

const FIREWORK_DURATION = 1400;

export function PartyMainBackground({ userRole, isBlurred = false }: PartyMainBackgroundProps) {
  const isHost = userRole === PARTY_USER.HOST;

  const firecrackerId = useFirecrackerStore((s) => s.firecrackerId);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [isJumping, setIsJumping] = useState(false);
  const prevFirecrackerIdRef = useRef(firecrackerId);

  useEffect(() => {
    if (!firecrackerId || firecrackerId === prevFirecrackerIdRef.current) {
      prevFirecrackerIdRef.current = firecrackerId;
      return;
    }
    prevFirecrackerIdRef.current = firecrackerId;

    const count = 3 + Math.floor(Math.random() * 3);
    const newFireworks: Firework[] = Array.from({ length: count }, (_, i) => ({
      id: firecrackerId + i,
      image: Math.random() > 0.5 ? fireworkBig : fireworkSmall,
      left: `${10 + Math.random() * 75}%`,
      top: `${10 + Math.random() * 60}%`,
    }));

    setFireworks((prev) => [...prev, ...newFireworks]);
    setIsJumping(true);

    const fireworkTimer = window.setTimeout(() => {
      setFireworks((prev) => prev.filter((fw) => !newFireworks.some((nfw) => nfw.id === fw.id)));
    }, FIREWORK_DURATION);

    const jumpTimer = window.setTimeout(() => {
      setIsJumping(false);
    }, 700);

    return () => {
      clearTimeout(fireworkTimer);
      clearTimeout(jumpTimer);
    };
  }, [firecrackerId]);

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
    <div
      className={`absolute inset-0 transition-[filter] duration-300 ${
        isBlurred ? 'pointer-events-none blur-[6px] brightness-[0.55]' : ''
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
            isJumping={isJumping}
            initStyle={hostInitStyle}
          />
        )}
        {featuredParticipant && (
          <FloatingCharacter
            key={featuredParticipant.id}
            image={featuredParticipant.image}
            name={featuredParticipant.name}
            size="lg"
            isJumping={isJumping}
            initStyle={featuredInitStyle}
          />
        )}
        {remainingParticipants.map((participant, index) => (
          <FloatingCharacter
            key={participant.id}
            image={participant.image}
            name={participant.name}
            size="sm"
            isJumping={isJumping}
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
