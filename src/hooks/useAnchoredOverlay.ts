import { useCallback, useEffect, useRef, useState } from 'react';

interface AnchoredOverlayPosition {
  top: number;
  left: number;
}

export function useAnchoredOverlay<T extends HTMLElement>(isOpen: boolean, offset = 12) {
  const anchorRef = useRef<T>(null);
  const [position, setPosition] = useState<AnchoredOverlayPosition | null>(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    setPosition({
      top: rect.bottom + offset,
      left: rect.left,
    });
  }, [offset]);

  useEffect(() => {
    if (!isOpen) {
      setPosition(null);
      return;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isOpen, updatePosition]);

  return { anchorRef, position };
}
