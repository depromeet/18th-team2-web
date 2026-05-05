import { CloseIcon } from '@/components/ui/icons/CloseIcon';

interface Props {
  onClick: () => void;
}

export function MessageCloseButton({ onClick }: Props) {
  return (
    <button
      type="button"
      aria-label="메시지 닫기"
      className="flex h-12 w-12 cursor-pointer items-center justify-center p-2.5"
      onClick={onClick}
    >
      <CloseIcon className="text-white" />
    </button>
  );
}
