import { useEffect, useRef, useState } from 'react';

import characterBlue from '@/assets/images/character/character-blue-circle-thumbnail.png';
import characterBrown from '@/assets/images/character/character-brown-circle-thumbnail.png';
import characterPink from '@/assets/images/character/character-pink-circle-thumbnail.png';
import characterWhite from '@/assets/images/character/character-white-circle-thumbnail.png';
import characterYellow from '@/assets/images/character/character-yellow-circle-thumbnail.png';

const CHARACTER_THUMBNAILS = [
  characterBlue,
  characterBrown,
  characterPink,
  characterWhite,
  characterYellow,
];

const randomThumbnail = () =>
  CHARACTER_THUMBNAILS[Math.floor(Math.random() * CHARACTER_THUMBNAILS.length)];

const MIN_HEIGHT = 320;

export interface ChatMessage {
  id: number;
  user: {
    name: string;
    profileImage: string;
    senderRole: 'PARTICIPANT' | 'CELEBRANT'; //스웨거 참고
  };
  text: string;
}

export type ChatListItem =
  | {
      type: 'message';
      id: number;
      user: { name: string; profileImage: string; senderRole: 'PARTICIPANT' | 'CELEBRANT' };
      text: string;
    }
  | { type: 'entry'; id: number; userName: string };

const MOCK_MESSAGES: ChatListItem[] = [
  {
    type: 'message',
    id: 1,
    user: { name: '하파린', profileImage: randomThumbnail(), senderRole: 'CELEBRANT' },
    text: '다들 고마워~~',
  },
  {
    type: 'entry',
    id: 2,
    userName: '소다',
  },
  {
    type: 'message',
    id: 3,
    user: { name: '소다', profileImage: randomThumbnail(), senderRole: 'PARTICIPANT' },
    text: '같이 축하해요 🥳',
  },
];

export function useChatBottomSheet() {
  const [height, setHeight] = useState(MIN_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  const [messages, setMessages] = useState<ChatListItem[]>(MOCK_MESSAGES);

  const draggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const MAX_HEIGHT = window.innerHeight - 160;
  const MID = (MIN_HEIGHT + MAX_HEIGHT) / 2;

  const isExpanded = height > MIN_HEIGHT;

  const addMessage = (text: string) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        type: 'message' as const,
        id: Date.now(),
        user: {
          name: '사용자', // 임시
          profileImage: randomThumbnail(),
          senderRole: 'CELEBRANT',
        },
        text,
      },
    ]);
  };

  const addEntryNotice = (userName: string) => {
    setMessages((prev) => [
      ...prev,
      {
        type: 'entry' as const,
        id: Date.now(),
        userName,
      },
    ]);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true;
    setIsDragging(true);

    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return;

    const delta = e.clientY - startYRef.current;
    let nextHeight = startHeightRef.current - delta;

    nextHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, nextHeight));
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
    messages,
    addMessage,
    addEntryNotice,
  };
}
