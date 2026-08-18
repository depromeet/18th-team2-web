import { useEffect, useRef, type CSSProperties } from 'react';

import { ChatItem } from '@/components/live-party/chat/ChatItem';
import { EntryExitNoticeText } from '@/components/live-party/chat/EntryExitNoticeText';

import { type ChatListItem } from '@/hooks/live-party/useChatBottomSheet';

interface ChatListProps {
  messages: ChatListItem[];
}

export function ChatList({ messages }: ChatListProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const listMaskStyle = {
    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 42px, black 100%)',
    maskImage: 'linear-gradient(to bottom, transparent 0, black 42px, black 100%)',
  } as CSSProperties;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div
      className="share-scroll-hide relative mb-5 flex-1 space-y-4 overflow-y-auto pt-4"
      style={listMaskStyle}
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
