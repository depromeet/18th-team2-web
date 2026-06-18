import trashIcon from '@/assets/icons/icon-fill-trash.svg';
import { B1 } from '@/components/ui/Typography';
import { formatDateParts, formatKoreanTime } from '@/utils/date';

interface InvitationDateBadgeProps {
  startsAt: Date;
  endsAt?: Date;
  partyOption: 'REALTIME' | 'PAPER_ONLY';
  showDeleteButton?: boolean;
  onDeleteClick?: () => void;
}

export function InvitationDateBadge({
  startsAt,
  endsAt,
  partyOption,
  showDeleteButton = false,
  onDeleteClick,
}: InvitationDateBadgeProps) {
  const { year, month, day } = formatDateParts(startsAt);
  const endDateParts = endsAt ? formatDateParts(endsAt) : null;
  const timeLabel = formatKoreanTime(startsAt);
  const isRollingPaper = partyOption === 'PAPER_ONLY';

  const startDateTime = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const endDateTime = endDateParts
    ? `${endDateParts.year}-${String(endDateParts.month).padStart(2, '0')}-${String(endDateParts.day).padStart(2, '0')}`
    : undefined;

  return (
    <B1 as="div" className="text-grey-200 flex h-6 w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <time dateTime={startDateTime} className="flex items-center gap-1">
          <span>{year}</span>
          <span className="bg-grey-100 h-1 w-1 rounded-full" aria-hidden="true" />
          <span>{month}</span>
          <span className="bg-grey-100 h-1 w-1 rounded-full" aria-hidden="true" />
          <span>{day}</span>
        </time>
        {isRollingPaper && endDateParts ? (
          <>
            <span>~</span>
            <time dateTime={endDateTime} className="flex items-center gap-1">
              <span>{endDateParts.year}</span>
              <span className="bg-grey-100 h-1 w-1 rounded-full" aria-hidden="true" />
              <span>{endDateParts.month}</span>
              <span className="bg-grey-100 h-1 w-1 rounded-full" aria-hidden="true" />
              <span>{endDateParts.day}</span>
            </time>
          </>
        ) : (
          <>
            <div className="bg-grey-100 h-3 w-px" role="separator" />
            <span>{timeLabel}</span>
          </>
        )}
      </div>
      {showDeleteButton && (
        <button
          type="button"
          className="flex h-6 w-6 cursor-pointer items-center justify-center"
          aria-label="파티 삭제"
          onClick={onDeleteClick}
        >
          <img src={trashIcon} alt="" className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
    </B1>
  );
}
