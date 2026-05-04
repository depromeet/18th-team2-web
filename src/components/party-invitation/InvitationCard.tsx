import { B1, H1, H2 } from '@/components/ui/Typography';
import { formatDateParts, formatKoreanDate, formatKoreanTime } from '@/utils/dateFormat';

import { InvitationChip } from './InvitationChip';

interface InvitationCardProps {
  hostName: string;
  startsAt: string;
}

interface InvitationTemplateProps {
  hostName: string;
  startsAt: string;
}

function InvitationTemplate({ hostName, startsAt }: InvitationTemplateProps) {
  const dateLabel = formatKoreanDate(startsAt);
  const timeLabel = formatKoreanTime(startsAt);
  const rowClassName =
    'flex h-11 w-full items-center gap-0.5 text-left font-medium tracking-[-0.0044px] text-grey-500';

  return (
    <H1 as="p" className="flex w-full flex-col items-start gap-0.5 font-medium">
      <span className={rowClassName}>
        <InvitationChip>{hostName}</InvitationChip>를 위해
      </span>
      <span className={rowClassName}>
        <InvitationChip>{dateLabel}</InvitationChip>에
      </span>
      <span className={rowClassName}>
        <InvitationChip>{timeLabel}</InvitationChip>부터 10분 동안
      </span>
      <span className={rowClassName}>온라인 생일 파티가 열려요</span>
    </H1>
  );
}

interface InvitationDateBadgeProps {
  startsAt: string;
}

function InvitationDateBadge({ startsAt }: InvitationDateBadgeProps) {
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

export function InvitationCard({ hostName, startsAt }: InvitationCardProps) {
  return (
    <article
      className="flex w-full flex-col gap-10 rounded-lg bg-white px-7.5 py-9"
      style={{ boxShadow: '0px 0px 8px 0px #5892FF4D' }}
    >
      {/* 카드 상단: 타이틀 + 구분선 + 템플릿 */}
      <div className="flex flex-col items-center gap-6">
        <H2>파티 초대장</H2>
        <hr className="w-full border-blue-50" />
        <InvitationTemplate hostName={hostName} startsAt={startsAt} />
      </div>

      {/* 카드 하단: 구분선 + 날짜 뱃지 */}
      <div className="flex flex-col gap-6">
        <hr className="w-full border-blue-50" />
        <InvitationDateBadge startsAt={startsAt} />
      </div>
    </article>
  );
}
