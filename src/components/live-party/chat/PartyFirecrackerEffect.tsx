import ReactCanvasConfetti from 'react-canvas-confetti';
import { useEffect, useRef } from 'react';

import { CONFETTI_COLORS } from '@/constants/live-party';
import { useFirecrackerStore } from '@/stores/useFirecrackerStore';

export function PartyFirecrackerEffect() {
  const confettiRef = useRef<((options: Record<string, unknown>) => void) | null>(null);

  const firecrackerId = useFirecrackerStore((state) => state.firecrackerId);
  const lastHandledIdRef = useRef(firecrackerId);

  useEffect(() => {
    if (!confettiRef.current) {
      return;
    }

    if (firecrackerId === 0 || firecrackerId === lastHandledIdRef.current) {
      return;
    }

    lastHandledIdRef.current = firecrackerId;

    const firework = () => {
      const x = 0.15 + Math.random() * 0.7;
      const y = 0.1 + Math.random() * 0.35;

      confettiRef.current?.({
        particleCount: 50,
        angle: 360,
        spread: 360,
        startVelocity: 20,
        gravity: 0.9,
        decay: 0.94,
        ticks: 220,
        scalar: 1.2,
        origin: { x, y },
        colors: CONFETTI_COLORS,
      });
    };

    firework();
    const timer = window.setTimeout(firework, 400);

    return () => clearTimeout(timer);
  }, [firecrackerId]);

  return (
    <ReactCanvasConfetti
      onInit={({ confetti }) => {
        confettiRef.current = confetti;
      }}
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    />
  );
}
