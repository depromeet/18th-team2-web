import { useEffect } from 'react';

import { ChatFooter } from '@/components/live-party/chat/ChatFooter';
import { ChatHeader } from '@/components/live-party/chat/ChatHeader';
import { ChipList } from '@/components/live-party/chat/ChipList';
import { ChatList } from '@/components/live-party/chat/ChatList';
import { useViewportBottomOffset } from '@/hooks/useViewportBottomOffset';
import { useChatBottomSheet } from '@/hooks/live-party/useChatBottomSheet';
import { useLivePartyChatStore } from '@/stores/useLivePartyChatStore';

export interface ChatBottomSheetMetrics {
  height: number;
  bottomOffset: number;
  isExpanded: boolean;
}

interface ChatBottomSheetProps {
  onSend: (text: string) => void;
  isBlurred?: boolean;
  isEntryWaiting?: boolean;
  hasTopOverlayContent?: boolean;
  onMetricsChange?: (metrics: ChatBottomSheetMetrics) => void;
  participantCount?: number;
  maxParticipantCount?: number;
}

export function ChatBottomSheet({
  onSend,
  isBlurred = false,
  isEntryWaiting = false,
  hasTopOverlayContent = false,
  onMetricsChange,
  participantCount,
  maxParticipantCount,
}: ChatBottomSheetProps) {
  const messages = useLivePartyChatStore((s) => s.messages);
  const { height, isExpanded, handlePointerDown, toggle } = useChatBottomSheet({
    hasTopOverlayContent,
  });
  const bottomOffset = useViewportBottomOffset();
  const showParticipantCount =
    typeof participantCount === 'number' &&
    typeof maxParticipantCount === 'number' &&
    maxParticipantCount > 0;
  const sheetBackgroundClass = isExpanded
    ? 'bg-white/15'
    : isEntryWaiting
      ? 'bg-[#050640]/85'
      : 'bg-[#000341]/92';

  useEffect(() => {
    onMetricsChange?.({ height, bottomOffset, isExpanded });
  }, [bottomOffset, height, isExpanded, onMetricsChange]);

  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-50 mx-auto w-full max-w-[600px] px-4 transition-[height,filter,background-color,backdrop-filter] duration-300 ${
        sheetBackgroundClass
      } border-t-0 ${
        isExpanded ? 'overflow-hidden rounded-t-[20px] backdrop-blur-[50px]' : 'overflow-visible'
      } ${isBlurred ? 'pointer-events-none blur-[6px] brightness-[0.55]' : ''}`}
      style={{ height, bottom: bottomOffset }}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 -top-20 h-20 bg-linear-to-b from-transparent via-[#000341]/30 to-[#000341]/90 transition-opacity duration-300 ${
          isExpanded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {showParticipantCount && (
        <div className="absolute top-3 right-4 z-10 flex items-center gap-1 rounded-[20px] bg-[#000341]/90 px-2 py-1.5 text-[11px] leading-4 font-bold text-white backdrop-blur-[10px]">
          <svg
            aria-hidden
            className="text-blue-400"
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
        {isExpanded && <ChatHeader onPointerDown={handlePointerDown} />}
        <ChatList messages={messages} onClick={toggle} />
        <ChipList onChipClick={onSend} />
        <ChatFooter onSend={onSend} />
      </div>
    </div>
  );
}
