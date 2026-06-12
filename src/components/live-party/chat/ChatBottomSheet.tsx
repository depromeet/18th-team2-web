import { ChatFooter } from '@/components/live-party/chat/ChatFooter';
import { ChipList } from '@/components/live-party/chat/ChipList';
import { ChatHeader } from '@/components/live-party/chat/ChatHeader';
import { ChatList } from '@/components/live-party/chat/ChatList';
import { useChatBottomSheet, type ChatListItem } from '@/hooks/live-party/useChatBottomSheet';

interface ChatBottomSheetProps {
  messages: ChatListItem[];
  onSend: (text: string) => void;
  isBlurred?: boolean;
}

export function ChatBottomSheet({ messages, onSend, isBlurred = false }: ChatBottomSheetProps) {
  const { height, isExpanded, handlePointerDown } = useChatBottomSheet();

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-[600px] rounded-t-2xl border-t border-white/10 bg-[#26295D] px-4 transition-[filter] duration-300 ${isExpanded ? 'bg-transparent backdrop-blur-2xl' : ''} ${isBlurred ? 'pointer-events-none blur-[6px] brightness-[0.55]' : ''}`}
      style={{ height }}
    >
      <div className="flex h-full flex-col">
        <ChatHeader onPointerDown={handlePointerDown} />
        <ChatList messages={messages} />
        <ChipList onChipClick={onSend} />
        <ChatFooter onSend={onSend} />
      </div>
    </div>
  );
}
