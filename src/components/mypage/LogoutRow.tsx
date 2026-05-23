import { ChevronRightIcon } from '@/components/ui/icons/ChevronRightIcon';
import { B1 } from '@/components/ui/Typography';

interface LogoutRowProps {
  onClick: () => void;
}

export function LogoutRow({ onClick }: LogoutRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-4 py-3 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
    >
      <B1 className="text-grey-400 font-medium">로그아웃</B1>
      <ChevronRightIcon className="text-grey-400" />
    </button>
  );
}
