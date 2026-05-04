import { InvitationHighlightText } from '@/components/party-invitation/InvitationHighlightText';
import { H1, H2 } from '@/components/ui/Typography';
import { formatKoreanMonthDay } from '@/utils/date';

import { DateRangeBadge } from './DateRangeBadge';

interface RollingPaperInvitationCardProps {
  hostName: string;
  writableFrom: Date;
  writableUntil: Date;
  /** 마감 여부에 따라 카드 본문/날짜 색상 분기 */
  isExpired: boolean;
}

export function RollingPaperInvitationCard({
  hostName,
  writableFrom,
  writableUntil,
  isExpired,
}: RollingPaperInvitationCardProps) {
  const rowClassName =
    'flex h-11 w-full items-center gap-0.5 font-medium tracking-[-0.0044px] text-grey-600';

  return (
    <article
      className="flex w-full flex-col gap-10 rounded-lg bg-white px-7.5 py-9"
      style={{ boxShadow: '0px 0px 8px 0px #5892FF4D' }}
    >
      <div className="flex flex-col items-center gap-6">
        <H2>롤링페이퍼 초대장</H2>
        <hr className="w-full border-blue-50" />

        <H1 as="p" className="flex w-full flex-col items-start gap-0.5 font-medium">
          <span className={rowClassName}>
            <InvitationHighlightText>{hostName}</InvitationHighlightText>의
          </span>
          {isExpired ? (
            <>
              <span className={rowClassName}>롤링페이퍼가</span>
              <span className={rowClassName}>
                <InvitationHighlightText>
                  {formatKoreanMonthDay(writableUntil)}
                </InvitationHighlightText>
                에 마감되었어요
              </span>
            </>
          ) : (
            <>
              <span className={rowClassName}>롤링페이퍼를</span>
              <span className={rowClassName}>
                <InvitationHighlightText>
                  {formatKoreanMonthDay(writableFrom)}
                </InvitationHighlightText>
                부터
              </span>
              <span className={rowClassName}>
                <InvitationHighlightText>
                  {formatKoreanMonthDay(writableUntil)}
                </InvitationHighlightText>
                까지 받아요
              </span>
            </>
          )}
        </H1>
      </div>

      <div className="flex flex-col gap-6">
        <hr className="w-full border-blue-50" />
        <DateRangeBadge from={writableFrom} to={writableUntil} isExpired={isExpired} />
      </div>
    </article>
  );
}
