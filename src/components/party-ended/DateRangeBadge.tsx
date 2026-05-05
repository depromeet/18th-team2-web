import { B1 } from '@/components/ui/Typography';
import { formatDateParts, formatIsoDate } from '@/utils/date';

interface DateRangeBadgeProps {
  from: Date;
  to: Date;
  /** 마감 시 red-500, 작성 가능 시 grey-200 */
  isExpired: boolean;
}

export function DateRangeBadge({ from, to, isExpired }: DateRangeBadgeProps) {
  const colorClass = isExpired ? 'text-red-500' : 'text-grey-200';

  return (
    <B1 as="div" className={`flex h-6 w-full items-center gap-1 ${colorClass}`}>
      <DatePartsView date={from} />
      <span>~</span>
      <DatePartsView date={to} />
    </B1>
  );
}

function DatePartsView({ date }: { date: Date }) {
  const { year, month, day } = formatDateParts(date);
  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');

  return (
    <time dateTime={formatIsoDate(date)} className="flex items-center gap-0.5">
      <span>{year}</span>
      <span>·</span>
      <span>{mm}</span>
      <span>·</span>
      <span>{dd}</span>
    </time>
  );
}
