import { useEffect, useRef } from 'react';

import { ChatItem } from '@/components/live-party/chat/ChatItem';
import { EntryExitNoticeText } from '@/components/live-party/chat/EntryExitNoticeText';

import { type ChatListItem } from '@/hooks/live-party/useChatBottomSheet';

interface ChatListProps {
  messages: ChatListItem[];
  isExpanded: boolean;
}

export function ChatList({ messages, isExpanded }: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className="share-scroll-hide relative mb-5 flex-1 space-y-4 overflow-y-auto pt-4">
      <div
        className={`pointer-events-none absolute top-0 right-0 left-0 h-10 ${
          isExpanded ? 'bg-none' : 'bg-linear-to-b from-[#26295D] to-transparent'
        }`}
      />

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
