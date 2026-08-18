import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import fireworkBig from '@/assets/images/live-party/firework-big.svg';
import fireworkSmall from '@/assets/images/live-party/firework-small.svg';
import defaultCharacterSrc from '@/assets/images/character/character-blue-full.png';

import { PARTY_USER } from '@/constants/live-party';
import { useGetPartyParticipants } from '@/services/live-party';
import { useFirecrackerStore } from '@/stores/useFirecrackerStore';
import { usePartyUserRole } from '@/hooks/live-party/usePartyUserRole';
import { resolveImageUrl } from '@/utils/image';

interface Firework {
  id: number;
  image: string;
  left: string;
  top: string;
}

const FIREWORK_DURATION = 1400;
const PARTICIPANT_POSITIONS = [
  { left: '6%', top: '217px', shortTop: '172px' },
  { left: '10%', top: '147px', shortTop: '116px' },
  { left: '24%', top: '182px', shortTop: '144px' },
  { left: '76%', top: '147px', shortTop: '116px' },
  { left: '83%', top: '217px', shortTop: '172px' },
  { left: '81%', top: '344px', shortTop: '266px' },
  { left: '12%', top: '344px', shortTop: '266px' },
  { left: '23%', top: '402px', shortTop: '318px' },
  { left: '71%', top: '402px', shortTop: '318px' },
];

export function usePartyMainBackground() {
  const { partyId } = useParams<{ partyId: string }>();
  const userRole = usePartyUserRole();
  const isHost = userRole === PARTY_USER.HOST;
  const { data: participantsData } = useGetPartyParticipants(partyId);

  const firecrackerId = useFirecrackerStore((s) => s.firecrackerId);
  const firingParticipantId = useFirecrackerStore((s) => s.firingParticipantId);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [jumpingParticipantId, setJumpingParticipantId] = useState<number | null>(null);
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
    setJumpingParticipantId(firingParticipantId);

    const fireworkTimer = window.setTimeout(() => {
      setFireworks((prev) => prev.filter((fw) => !newFireworks.some((nfw) => nfw.id === fw.id)));
    }, FIREWORK_DURATION);

    const jumpTimer = window.setTimeout(() => {
      setJumpingParticipantId(null);
    }, 700);

    return () => {
      clearTimeout(fireworkTimer);
      clearTimeout(jumpTimer);
    };
  }, [firecrackerId, firingParticipantId]);

  const rawParticipants = useMemo(() => participantsData?.participants ?? [], [participantsData]);

  const hostParticipant = useMemo(() => {
    const host = rawParticipants.find((p) => p.isCelebrant);
    if (!host) return null;
    return {
      id: host.participantId ?? 0,
      name: host.nickname ?? '',
      image: resolveImageUrl(host.characterImageUrl) ?? defaultCharacterSrc,
    };
  }, [rawParticipants]);

  const allParticipants = useMemo(
    () =>
      rawParticipants
        .filter((p) => !p.isCelebrant)
        .map((p, index) => ({
          id: p.participantId ?? index,
          name: p.nickname ?? '',
          image: resolveImageUrl(p.characterImageUrl) ?? defaultCharacterSrc,
          isCurrentUser: p.isMe ?? false,
        })),
    [rawParticipants],
  );

  const featuredParticipant = useMemo(
    () => (isHost ? allParticipants[0] : allParticipants.find((p) => p.isCurrentUser)),
    [isHost, allParticipants],
  );

  const remainingParticipants = useMemo(
    () => allParticipants.filter((p) => p.id !== featuredParticipant?.id),
    [allParticipants, featuredParticipant?.id],
  );

  const hostInitStyle = useMemo(
    () => ({
      left: 'calc(50% - 63px)',
      top: 'calc((100svh - var(--live-party-chat-min-height, 283px)) / 2 + 20px)',
      shortTop: '174px',
      animationDuration: '3s',
      animationDelay: '0s',
    }),
    [],
  );

  const featuredInitStyle = useMemo(
    () => ({
      left: 'calc(50% - 49px)',
      bottom: 'calc((100svh + var(--live-party-chat-min-height, 283px)) / 2 + 96px)',
      animationDuration: '3s',
      animationDelay: '0s',
    }),
    [],
  );

  const participantInitStyles = useMemo(
    () =>
      remainingParticipants.map((_, index) => {
        const position = PARTICIPANT_POSITIONS[index % PARTICIPANT_POSITIONS.length];

        return {
          ...position,
          animationDuration: `${2.5 + (index % 3) * 0.25}s`,
          animationDelay: `${(index % 4) * 0.3}s`,
        };
      }),
    [remainingParticipants],
  );

  return {
    fireworks,
    jumpingParticipantId,
    hostParticipant,
    featuredParticipant,
    remainingParticipants,
    hostInitStyle,
    featuredInitStyle,
    participantInitStyles,
  };
}
