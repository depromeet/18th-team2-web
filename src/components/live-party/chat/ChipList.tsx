import { CHAT_CHIPS } from '@/constants/live-party';
import { Chip } from '@/components/live-party/chat/Chip';

interface ChipListProps {
  onChipClick?: (value: string) => void;
}

export function ChipList({ onChipClick }: ChipListProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2">
      {CHAT_CHIPS.map((chip) => (
        <Chip key={chip} label={chip} onClick={(v) => onChipClick?.(v)} />
      ))}
    </div>
  );
}
