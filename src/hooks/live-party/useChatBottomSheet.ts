import { useEffect, useRef, useState } from 'react';

const DEFAULT_MIN_HEIGHT = 320;
const COMPACT_MIN_HEIGHT = 280;
const MAX_HEIGHT_TOP_OFFSET = 160;

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function getSheetBounds() {
  const viewportHeight = getViewportHeight();
  const minHeight = viewportHeight < 700 ? COMPACT_MIN_HEIGHT : DEFAULT_MIN_HEIGHT;
  const maxHeight = Math.max(minHeight, viewportHeight - MAX_HEIGHT_TOP_OFFSET);

  return { minHeight, maxHeight };
}

export interface ChatMessage {
  id: number;
  user: {
    name: string;
    profileImage: string | null;
    senderRole: 'PARTICIPANT' | 'CELEBRANT';
  };
  text: string;
}

export type ChatListItem =
  | {
      type: 'message';
      id: number;
      user: {
        name: string;
        profileImage: string | null;
        senderRole: 'PARTICIPANT' | 'CELEBRANT';
      };
      text: string;
    }
  | {
      type: 'entry';
      id: number;
      userName: string;
    }
  | {
      type: 'exit';
      id: number;
      userName: string;
    };

export function useChatBottomSheet() {
  const [bounds, setBounds] = useState(getSheetBounds);
  const [height, setHeight] = useState(bounds.minHeight);
  const [isDragging, setIsDragging] = useState(false);

  const midHeight = (bounds.minHeight + bounds.maxHeight) / 2;
  const isExpanded = height > bounds.minHeight + 1;

  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return;
    const delta = e.clientY - startYRef.current;
    const nextHeight = Math.max(
      bounds.minHeight,
      Math.min(bounds.maxHeight, startHeightRef.current - delta),
    );
    setHeight(nextHeight);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (height > midHeight) setHeight(bounds.maxHeight);
    else setHeight(bounds.minHeight);
  };

  useEffect(() => {
    const viewport = window.visualViewport;

    function syncBounds() {
      const nextBounds = getSheetBounds();
      setBounds(nextBounds);
      setHeight((currentHeight) => {
        const isCollapsed = currentHeight <= bounds.minHeight + 1;
        if (isCollapsed) return nextBounds.minHeight;

        return Math.max(nextBounds.minHeight, Math.min(nextBounds.maxHeight, currentHeight));
      });
    }

    syncBounds();
    window.addEventListener('resize', syncBounds);
    viewport?.addEventListener('resize', syncBounds);
    viewport?.addEventListener('scroll', syncBounds);

    return () => {
      window.removeEventListener('resize', syncBounds);
      viewport?.removeEventListener('resize', syncBounds);
      viewport?.removeEventListener('scroll', syncBounds);
    };
  }, [bounds.minHeight]);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  return {
    height,
    isExpanded,
    isDragging,
    handlePointerDown,
  };
}
