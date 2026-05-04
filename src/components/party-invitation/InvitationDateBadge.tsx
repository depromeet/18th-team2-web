import { B1 } from '@/components/ui/Typography';
import { formatDateParts, formatKoreanTime } from '@/utils/dateFormat';

interface InvitationDateBadgeProps {
  startsAt: string;
}

export function InvitationDateBadge({ startsAt }: InvitationDateBadgeProps) {
  const { year, month, day } = formatDateParts(startsAt);
  const timeLabel = formatKoreanTime(startsAt);

  return (
    <B1 as="div" className="flex items-center gap-2 text-grey-200">
      <time
        dateTime={`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
        className="flex items-center gap-1"
      >
        <span>{year}</span>
        <span className="h-1 w-1 rounded-full bg-grey-100" aria-hidden="true" />
        <span>{month}</span>
        <span className="h-1 w-1 rounded-full bg-grey-100" aria-hidden="true" />
        <span>{day}</span>
      </time>
      <div className="h-3 w-px bg-grey-100" role="separator" />
      <span>{timeLabel}</span>
    </B1>
  );
}
