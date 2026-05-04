import { H1 } from '@/components/ui/Typography';
import { getObjectParticle } from '@/utils/koreanPostposition';
import { formatKoreanDate, formatKoreanTime } from '@/utils/date';

import { InvitationHighlightText } from './InvitationHighlightText';

interface InvitationTemplateProps {
  hostName: string;
  startsAt: string;
}

export function InvitationTemplate({ hostName, startsAt }: InvitationTemplateProps) {
  const dateLabel = formatKoreanDate(startsAt);
  const timeLabel = formatKoreanTime(startsAt);
  const hostNameObjectParticle = getObjectParticle(hostName);
  const rowClassName =
    'flex h-11 w-full items-center gap-0.5 font-medium tracking-[-0.0044px] text-grey-500';

  return (
    <H1 as="p" className="flex w-full flex-col items-start gap-0.5 font-medium">
      <span className={rowClassName}>
        <InvitationHighlightText>{hostName}</InvitationHighlightText>
        {`${hostNameObjectParticle} 위해`}
      </span>
      <span className={rowClassName}>
        <InvitationHighlightText>{dateLabel}</InvitationHighlightText>에
      </span>
      <span className={rowClassName}>
        <InvitationHighlightText>{timeLabel}</InvitationHighlightText>부터 10분 동안
      </span>
      <span className={rowClassName}>온라인 생일 파티가 열려요</span>
    </H1>
  );
}
