import { B1 } from '@/components/ui/Typography';

interface MyPaperSectionProps {
  buttonLabel: string;
  onClick: () => void;
  count?: number;
}

export function MyPaperSection({ buttonLabel, onClick, count }: MyPaperSectionProps) {
  return (
    <section className="flex flex-col gap-2 px-4 py-3">
      <div className="flex items-center gap-1">
        <B1 className="font-semibold text-black">롤링페이퍼</B1>
        {typeof count === 'number' && <B1 className="font-semibold text-blue-500">{count}개</B1>}
      </div>
      <button
        type="button"
        onClick={onClick}
        className="flex h-14 w-full cursor-pointer items-center justify-center rounded-[14px] border border-blue-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
      >
        <B1 className="font-semibold text-blue-600">{buttonLabel}</B1>
      </button>
    </section>
  );
}
