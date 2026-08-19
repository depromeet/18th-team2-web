import { type PointerEvent } from 'react';
import BottomSheetHeader from '@/assets/images/live-party/bottom-sheet-header.svg';

interface ChatHeaderProps {
  onPointerDown: (e: PointerEvent) => void;
}

export function ChatHeader({ onPointerDown }: ChatHeaderProps) {
  return (
    <button
      type="button"
      onPointerDown={onPointerDown}
      aria-label="채팅창 크기 변경"
      className="flex w-full cursor-grab touch-none justify-center pt-3 pb-2 active:cursor-grabbing"
    >
      <img src={BottomSheetHeader} alt="" className="h-[3px]" draggable={false} />
    </button>
  );
}
