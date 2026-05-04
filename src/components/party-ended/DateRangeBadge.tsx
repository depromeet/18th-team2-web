import { B1 } from '@/components/ui/Typography';
import { formatDateParts } from '@/utils/date';

interface DateRangeBadgeProps {
  from: Date;
  to: Date;
  /** 마감 시 red-500, 작성 가능 시 grey-200 */
  isExpired: boolean;
}

export function DateRangeBadge({ from, to, isExpired }: DateRangeBadgeProps) {
  const fromParts = formatDateParts(from);
  const toParts = formatDateParts(to);
  const colorClass = isExpired ? 'text-red-500' : 'text-grey-200';

  return (
    <B1 as="div" className={`flex h-6 w-full items-center gap-1 ${colorClass}`}>
      <DatePartsView parts={fromParts} />
      <span>~</span>
      <DatePartsView parts={toParts} />
    </B1>
  );
}

function DatePartsView({ parts }: { parts: { year: number; month: number; day: number } }) {
  const { year, month, day } = parts;
  return (
    <time
      dateTime={`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
      className="flex items-center gap-0.5"
    >
      <span>{year}</span>
      <span>·</span>
      <span>{String(month).padStart(2, '0')}</span>
      <span>·</span>
      <span>{String(day).padStart(2, '0')}</span>
    </time>
  );
}
