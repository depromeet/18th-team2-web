import ArrowUpIconSvg from '@/assets/images/icons/arrow-up.svg?react';

interface SendButtonProps {
  onClick: () => void;
}

export function SendButton({ onClick }: SendButtonProps) {
  return (
    <button
      type="button"
      aria-label="메시지 전송"
      onClick={onClick}
      className="flex h-11 w-12.5 shrink-0 items-center justify-center rounded-full bg-blue-600"
    >
      <ArrowUpIconSvg className="h-6 w-6" />
    </button>
  );
}
