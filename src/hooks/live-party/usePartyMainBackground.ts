import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import fireworkBig from '@/assets/images/live-party/firework-big.svg';
import fireworkSmall from '@/assets/images/live-party/firework-small.svg';
import defaultCharacterSrc from '@/assets/images/character/character-brown-full.png';

import { PARTY_USER } from '@/constants/live-party';
import { config } from '@/config/env';
import { useGetPartyParticipants } from '@/services/live-party';
import { useFirecrackerStore } from '@/stores/useFirecrackerStore';
import { usePartyUserRole } from '@/hooks/live-party/usePartyUserRole';

interface Firework {
  id: number;
  image: string;
  left: string;
  top: string;
}

const FIREWORK_DURATION = 1400;

function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${config.apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export function usePartyMainBackground() {
  const { partyId } = useParams<{ partyId: string }>();
  const userRole = usePartyUserRole();
  const isHost = userRole === PARTY_USER.HOST;
  const { data: participantsData } = useGetPartyParticipants(partyId);

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

  const rawParticipants = useMemo(
    () => participantsData?.data?.participants ?? [],
    [participantsData],
  );

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

  const featuredParticipant = useMemo(() => {
    if (isHost) {
      return allParticipants[Math.floor(Math.random() * allParticipants.length)];
    }
    return allParticipants.find((p) => p.isCurrentUser) ?? allParticipants[0];
  }, [isHost, allParticipants]);

  const remainingParticipants = useMemo(
    () => allParticipants.filter((p) => p.id !== featuredParticipant?.id),
    [allParticipants, featuredParticipant?.id],
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

  return {
    fireworks,
    isJumping,
    hostParticipant,
    featuredParticipant,
    remainingParticipants,
    hostInitStyle,
    featuredInitStyle,
    participantInitStyles,
  };
}
