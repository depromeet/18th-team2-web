import { B1, H2 } from '@/components/ui/Typography';
import { formatDotDate, formatKoreanShortDate } from '@/utils/date';

interface CompletedRollingPaperCardProps {
  hostName: string;
  startDate: Date;
  endDate: Date;
  className?: string;
}

export function CompletedRollingPaperCard({
  hostName,
  startDate,
  endDate,
  className,
}: CompletedRollingPaperCardProps) {
  const footerText = `${formatDotDate(startDate)}  ~  ${formatDotDate(endDate)}`;

  return (
    <div
      className={`relative flex min-h-[419px] w-full flex-col gap-6 rounded-lg bg-white px-7.5 pt-7.5 pb-17.5 ${className ?? ''}`}
    >
      <H2 className="text-center tracking-[-0.0001em]">롤링페이퍼 초대장</H2>
      <div className="border-grey-50 border-t" />

      <div className="text-head-1 text-grey-600 flex flex-1 flex-col gap-3 font-normal tracking-[-0.0002em]">
        <div>
          <strong className="text-blue-500">{hostName}</strong>
          <span>의</span>
        </div>
        <span>롤링페이퍼를</span>
        <div>
          <strong className="text-blue-500">{formatKoreanShortDate(startDate)}</strong>
          <span>부터</span>
        </div>
        <div>
          <strong className="text-blue-500">{formatKoreanShortDate(endDate)}</strong>
          <span>까지 받아요</span>
        </div>
      </div>

      <div className="border-grey-50 absolute right-7.5 bottom-20 left-7.5 border-t" />
      <B1 as="span" className="text-grey-200 absolute right-7.5 bottom-10.5 left-7.5 font-medium">
        {footerText}
      </B1>
    </div>
  );
}
