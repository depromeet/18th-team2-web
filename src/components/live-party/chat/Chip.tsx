interface ChipProps {
  label: string;
  onClick?: (label: string) => void;
}

export function Chip({ label, onClick }: ChipProps) {
  return (
    <button
      onClick={() => onClick?.(label)}
      className="text-grey-300 h-[36px] shrink-0 cursor-pointer rounded-[200px] bg-white/10 px-3 py-2 text-sm"
    >
      {label}
    </button>
  );
}
