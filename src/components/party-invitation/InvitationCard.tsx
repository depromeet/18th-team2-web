import { H2 } from '@/components/ui/Typography';

import { InvitationDateBadge } from './InvitationDateBadge';
import { InvitationTemplate } from './InvitationTemplate';

interface InvitationCardProps {
  hostName: string;
  startsAt: Date;
  isHost?: boolean;
  onDeleteClick?: () => void;
}

export function InvitationCard({
  hostName,
  startsAt,
  isHost = false,
  onDeleteClick,
}: InvitationCardProps) {
  const canDelete = isHost && startsAt.getTime() > Date.now();

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
        <InvitationDateBadge
          startsAt={startsAt}
          showDeleteButton={canDelete}
          onDeleteClick={onDeleteClick}
        />
      </div>
    </article>
  );
}
