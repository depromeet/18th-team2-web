import { useEffect, useRef } from 'react';
import { ChatItem } from '@/components/live-party/chat/ChatItem';
import { EntryNoticeText } from '@/components/live-party/chat/EntryNoticeText';
import { type ChatListItem } from '@/hooks/live-party/useChatBottomSheet';

interface ChatListProps {
  messages: ChatListItem[];
}

export function ChatList({ messages }: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="share-scroll-hide relative mb-5 flex-1 space-y-4 overflow-y-auto pt-4">
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-10 bg-linear-to-b from-[#26295D] to-transparent" />
      {messages.map((item) =>
        item.type === 'entry' ? (
          <EntryNoticeText key={item.id} userName={item.userName} />
        ) : (
          <ChatItem
            key={item.id}
            name={item.user.name}
            profileImage={item.user.profileImage}
            text={item.text}
          />
        ),
      )}
      <div ref={bottomRef} />
    </div>
  );
}
