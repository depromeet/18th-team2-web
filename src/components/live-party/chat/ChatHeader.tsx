import { type PointerEvent } from 'react';
import BottomSheetHeader from '@/assets/images/live-party/bottom-sheet-header.svg';

interface ChatHeaderProps {
  onPointerDown: (e: PointerEvent) => void;
}

export function ChatHeader({ onPointerDown }: ChatHeaderProps) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="flex cursor-grab touch-none justify-center py-2 active:cursor-grabbing"
    >
      <img src={BottomSheetHeader} alt="drag" className="h-[3px]" draggable={false} />
    </div>
  );
}
