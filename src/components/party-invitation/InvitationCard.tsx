import { H2 } from '@/components/ui/Typography';

import { InvitationDateBadge } from './InvitationDateBadge';
import { InvitationTemplate } from './InvitationTemplate';

interface InvitationCardProps {
  hostName: string;
  startsAt: Date;
  endsAt?: Date;
  partyOption: 'REALTIME' | 'PAPER_ONLY';
  isHost?: boolean;
  onDeleteClick?: () => void;
}

export function InvitationCard({
  hostName,
  startsAt,
  endsAt,
  partyOption,
  isHost = false,
  onDeleteClick,
}: InvitationCardProps) {
  const canDelete = isHost && startsAt.getTime() > Date.now();
  const isRollingPaper = partyOption === 'PAPER_ONLY';

  return (
    <article
      className="flex w-full flex-col gap-10 rounded-lg bg-white px-7.5 py-9 [@media_(max-height:700px)]:gap-6 [@media_(max-height:700px)]:px-6 [@media_(max-height:700px)]:py-7"
      style={{ boxShadow: '0px 0px 8px 0px #5892FF4D' }}
    >
      {/* 카드 상단: 타이틀 + 구분선 + 템플릿 */}
      <div className="flex flex-col items-center gap-6 [@media_(max-height:700px)]:gap-4">
        <H2>{isRollingPaper ? '롤링페이퍼 초대장' : '파티 초대장'}</H2>
        <hr className="w-full border-blue-50" />
        <InvitationTemplate
          hostName={hostName}
          startsAt={startsAt}
          endsAt={endsAt}
          partyOption={partyOption}
        />
      </div>

      {/* 카드 하단: 구분선 + 날짜 뱃지 */}
      <div className="flex flex-col gap-6 [@media_(max-height:700px)]:gap-4">
        <hr className="w-full border-blue-50" />
        <InvitationDateBadge
          startsAt={startsAt}
          endsAt={endsAt}
          partyOption={partyOption}
          showDeleteButton={canDelete}
          onDeleteClick={onDeleteClick}
        />
      </div>
    </article>
  );
}
