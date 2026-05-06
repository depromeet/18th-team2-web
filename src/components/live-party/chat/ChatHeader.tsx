import { type MouseEvent } from 'react';
import BottomSheetHeader from '@/assets/images/icons/bottom-sheet-header.svg';

interface ChatHeaderProps {
  onMouseDown: (e: MouseEvent) => void;
}

export function ChatHeader({ onMouseDown }: ChatHeaderProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="flex cursor-grab justify-center py-2 active:cursor-grabbing"
    >
      <img src={BottomSheetHeader} alt="drag" className="h-[3px]" draggable={false} />
    </div>
  );
}
