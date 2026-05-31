import { useEffect, useRef, useState } from 'react';

const MIN_HEIGHT = 320;

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
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  const MAX_HEIGHT = window.innerHeight - 160;
  const MID = (MIN_HEIGHT + MAX_HEIGHT) / 2;
  const isExpanded = height > MIN_HEIGHT;

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
    const nextHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeightRef.current - delta));
    setHeight(nextHeight);
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    if (height > MID) setHeight(MAX_HEIGHT);
    else setHeight(MIN_HEIGHT);
  };

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
