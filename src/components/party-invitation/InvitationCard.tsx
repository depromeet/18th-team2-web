import { B1, H2 } from '@/components/ui/Typography';
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

  return (
    <H2 as="p" className="flex flex-col gap-0.5 text-grey-500">
      <span className="flex items-center gap-0.5">
        <InvitationChip>{hostName}</InvitationChip>를 위해
      </span>
      <span className="flex items-center gap-0.5">
        <InvitationChip>{dateLabel}</InvitationChip>에
      </span>
      <span className="flex items-center gap-0.5">
        <InvitationChip>{timeLabel}</InvitationChip>부터 10분 동안
      </span>
      온라인 생일 파티가 열려요
    </H2>
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
    <article className="w-full rounded-lg bg-white px-7.5 py-9">
      <header className="mb-6 flex justify-center">
        <H2>파티 초대장</H2>
      </header>

      <hr className="border-blue-50" />

      <section className="my-6">
        <InvitationTemplate hostName={hostName} startsAt={startsAt} />
      </section>

      <hr className="border-blue-50" />

      <footer className="mt-6">
        <InvitationDateBadge startsAt={startsAt} />
      </footer>
    </article>
  );
}
