import ArrowUpIconSvg from '@/assets/images/icons/arrow-up.svg?react';

interface SendButtonProps {
  onClick: () => void;
}

export function SendButton({ onClick }: SendButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-blue-600 flex h-11 w-12.5 shrink-0 items-center justify-center rounded-full"
    >
      <ArrowUpIconSvg className="h-6 w-6" />
    </button>
  );
}
