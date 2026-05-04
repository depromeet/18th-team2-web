import trashIcon from '@/assets/icons/icon-fill-trash.svg';
import { B1 } from '@/components/ui/Typography';
import { formatDateParts, formatKoreanTime } from '@/utils/dateFormat';

interface InvitationDateBadgeProps {
  startsAt: string;
  showDeleteButton?: boolean;
}

export function InvitationDateBadge({
  startsAt,
  showDeleteButton = false,
}: InvitationDateBadgeProps) {
  const { year, month, day } = formatDateParts(startsAt);
  const timeLabel = formatKoreanTime(startsAt);

  function handleDeleteClick() {
    // TODO: 삭제 아이콘 클릭 시 초대장 삭제 확인 모달 노출
  }

  return (
    <B1 as="div" className="text-grey-200 flex h-6 w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <time
          dateTime={`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
          className="flex items-center gap-1"
        >
          <span>{year}</span>
          <span className="bg-grey-100 h-1 w-1 rounded-full" aria-hidden="true" />
          <span>{month}</span>
          <span className="bg-grey-100 h-1 w-1 rounded-full" aria-hidden="true" />
          <span>{day}</span>
        </time>
        <div className="bg-grey-100 h-3 w-px" role="separator" />
        <span>{timeLabel}</span>
      </div>
      {showDeleteButton && (
        <button
          type="button"
          className="flex h-6 w-6 cursor-pointer items-center justify-center"
          aria-label="파티 삭제"
          onClick={handleDeleteClick}
        >
          <img src={trashIcon} alt="" className="h-6 w-6" aria-hidden="true" />
        </button>
      )}
    </B1>
  );
}
