import { type MouseEvent } from 'react';

interface ChatHeaderProps {
  onMouseDown: (e: MouseEvent) => void;
}

export function ChatHeader({ onMouseDown }: ChatHeaderProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      className="flex cursor-grab justify-center py-2 active:cursor-grabbing"
    >
      <img
        src="/src/assets/images/icons/bottom-sheet-header.svg"
        alt="drag"
        className="h-[3px]"
        draggable={false}
      />
    </div>
  );
}
