import { useEffect, useRef } from 'react';
import { ChatItem } from '@/components/live-party/chat/ChatItem';
import { type ChatMessage } from '@/hooks/live-party/useChatBottomSheet';

interface ChatListProps {
  messages: ChatMessage[];
}

export function ChatList({ messages }: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="share-scroll-hide relative mb-5 flex-1 space-y-4 overflow-y-auto pt-4">
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-10 bg-linear-to-b from-[#26295D] to-transparent" />
      {messages.map((msg) => (
        <ChatItem
          key={msg.id}
          name={msg.user.name}
          profileImage={msg.user.profileImage}
          text={msg.text}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
