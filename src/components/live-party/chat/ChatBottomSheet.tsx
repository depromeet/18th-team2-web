import { ChatFooter } from '@/components/live-party/chat/ChatFooter';
import { ChipList } from '@/components/live-party/chat/ChipList';
import { ChatHeader } from '@/components/live-party/chat/ChatHeader';
import { ChatList } from '@/components/live-party/chat/ChatList';
import { useViewportBottomOffset } from '@/hooks/useViewportBottomOffset';
import { useChatBottomSheet, type ChatListItem } from '@/hooks/live-party/useChatBottomSheet';

interface ChatBottomSheetProps {
  messages: ChatListItem[];
  onSend: (text: string) => void;
  isBlurred?: boolean;
  isEntryWaiting?: boolean;
  participantCount?: number;
  maxParticipantCount?: number;
}

export function ChatBottomSheet({
  messages,
  onSend,
  isBlurred = false,
  isEntryWaiting = false,
  participantCount,
  maxParticipantCount,
}: ChatBottomSheetProps) {
  const { height, isExpanded, handlePointerDown } = useChatBottomSheet();
  const bottomOffset = useViewportBottomOffset();
  const showParticipantCount =
    isEntryWaiting &&
    typeof participantCount === 'number' &&
    typeof maxParticipantCount === 'number' &&
    maxParticipantCount > 0;

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-[600px] px-4 transition-[filter] duration-300 ${
        isEntryWaiting
          ? 'border-t-0 bg-[#050640]/85'
          : 'rounded-t-2xl border-t border-white/10 bg-[#26295D]'
      } ${isExpanded ? 'bg-transparent backdrop-blur-2xl' : ''} ${
        isBlurred ? 'pointer-events-none blur-[6px] brightness-[0.55]' : ''
      }`}
      style={{ height, bottom: bottomOffset }}
    >
      {isEntryWaiting && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-20 h-20 bg-linear-to-b from-transparent via-[#050640]/30 to-[#050640]/85"
        />
      )}
      {showParticipantCount && (
        <div className="absolute top-12 right-5 z-10 flex items-center gap-1 text-sm font-bold text-blue-400">
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z"
              fill="currentColor"
            />
            <path
              d="M1.75 12.25C1.75 9.89903 3.64903 8 6 8H8C10.351 8 12.25 9.89903 12.25 12.25C12.25 12.6642 11.9142 13 11.5 13H2.5C2.08579 13 1.75 12.6642 1.75 12.25Z"
              fill="currentColor"
            />
          </svg>
          <span>
            {participantCount}/{maxParticipantCount}
          </span>
        </div>
      )}
      <div className="flex h-full flex-col">
        <ChatHeader onPointerDown={handlePointerDown} />
        <ChatList messages={messages} />
        <ChipList onChipClick={onSend} />
        <ChatFooter onSend={onSend} />
      </div>
    </div>
  );
}
