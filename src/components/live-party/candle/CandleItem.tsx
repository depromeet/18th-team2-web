interface CandleItemProps {
  src: string;
  alt: string;
  disabled: boolean;
  onClick: () => void;
}

export function CandleItem({ src, alt, disabled, onClick }: CandleItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer transition-transform duration-200 active:scale-90 disabled:cursor-default"
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-auto w-[clamp(72px,24vw,96px)] transition-all duration-500 ease-out select-none"
      />
    </button>
  );
}
