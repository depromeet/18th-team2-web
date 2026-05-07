import { ChatFooter } from '@/components/live-party/chat/ChatFooter';
import { ChipList } from '@/components/live-party/chat/ChipList';
import { ChatHeader } from '@/components/live-party/chat/ChatHeader';
import { ChatList } from '@/components/live-party/chat/ChatList';
import { useChatBottomSheet } from '@/hooks/live-party/useChatBottomSheet';

export function ChatBottomSheet() {
  const { height, handlePointerDown, messages, addMessage } = useChatBottomSheet();

  return (
    <div
      className="fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-[598px] rounded-t-2xl border-t border-white/10 bg-[#26295D] px-4"
      style={{ height }}
    >
      <div className="flex h-full flex-col">
        <ChatHeader onPointerDown={handlePointerDown} />
        <ChatList messages={messages} />
        <ChipList onChipClick={addMessage} />
        <ChatFooter onSend={addMessage} />
      </div>
    </div>
  );
}
