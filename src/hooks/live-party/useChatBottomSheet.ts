// useChatBottomSheet.ts
import { useEffect, useRef, useState } from 'react';

const MIN_HEIGHT = 320;

export interface ChatMessage {
  id: number;
  user: {
    name: string;
    profileImage: string;
  };
  text: string;
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    user: { name: '하파린', profileImage: '/profile1.png' },
    text: '생일 축하해!! 🎉',
  },
];

export function useChatBottomSheet() {
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);

  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const MAX_HEIGHT = window.innerHeight - 160;
  const MID = (MIN_HEIGHT + MAX_HEIGHT) / 2;

  const addMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        user: {
          name: '사용자', // 임시
          profileImage: '/profile1.png',
        },
        text,
      },
    ]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    setIsDragging(true);

    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;

    const delta = e.clientY - startYRef.current;
    let nextHeight = startHeightRef.current - delta;

    nextHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, nextHeight));
    setHeight(nextHeight);
  };

  const handleMouseUp = () => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    setIsDragging(false);

    if (height > MID) setHeight(MAX_HEIGHT);
    else setHeight(MIN_HEIGHT);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  return {
    height,
    isDragging,
    handleMouseDown,
    messages,
    addMessage,
  };
}
