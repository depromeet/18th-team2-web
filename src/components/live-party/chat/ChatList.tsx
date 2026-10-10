import { useEffect, useRef, useState, type CSSProperties } from 'react';

import { ChatItem } from '@/components/live-party/chat/ChatItem';
import { EntryExitNoticeText } from '@/components/live-party/chat/EntryExitNoticeText';

import { type ChatListItem } from '@/hooks/live-party/useChatBottomSheet';

interface ChatListProps {
  messages: ChatListItem[];
  onClick?: () => void;
}

const LIST_MASK_STYLE = {
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 42px, black 100%)',
  maskImage: 'linear-gradient(to bottom, transparent 0, black 42px, black 100%)',
} as CSSProperties;

export function ChatList({ messages, onClick }: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  // 맨 위에 있을 때는 첫 요소가 가려지지 않도록, 스크롤된 경우에만 상단 페이드 적용
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div
      onClick={onClick}
      onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0)}
      className={`share-scroll-hide relative mb-5 flex-1 space-y-4 overflow-y-auto pt-4 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={isScrolled ? LIST_MASK_STYLE : undefined}
    >
      {messages.map((item) => {
        if (item.type === 'entry' || item.type === 'exit') {
          return <EntryExitNoticeText key={item.id} userName={item.userName} type={item.type} />;
        }

        return (
          <ChatItem
            key={item.id}
            name={item.user.name}
            profileImage={item.user.profileImage}
            text={item.text}
            senderRole={item.user.senderRole}
          />
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
}
