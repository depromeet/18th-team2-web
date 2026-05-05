import { B1 } from '@/components/ui/Typography';

interface LogoutRowProps {
  onClick: () => void;
}

export function LogoutRow({ onClick }: LogoutRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl px-4 py-3"
    >
      <B1 className="text-grey-400 font-medium">로그아웃</B1>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="text-grey-400"
      >
        <path
          d="M9.5 6L15.5 12L9.5 18"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
