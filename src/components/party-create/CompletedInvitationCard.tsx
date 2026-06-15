import { B1, H2 } from '@/components/ui/Typography';
import { formatDotDate, formatKoreanDate } from '@/utils/date';
import { getObjectParticle } from '@/utils/koreanPostposition';

interface CompletedInvitationCardProps {
  title: string;
  hostName: string;
  partyDate: Date;
  partyTime: string;
  durationMinutes: number;
  className?: string;
}

export function CompletedInvitationCard({
  title,
  hostName,
  partyDate,
  partyTime,
  durationMinutes,
  className,
}: CompletedInvitationCardProps) {
  const footerText = `${formatDotDate(partyDate)}  |  ${partyTime}`;
  const hostNameParticle = getObjectParticle(hostName);

  return (
    <div className={`rounded-lg bg-white px-9 pt-10 pb-9 ${className ?? ''}`}>
      <H2 className="text-center">{title}</H2>
      <div className="border-grey-50 mt-7 border-t" />

      <div className="text-head-1 text-grey-600 mt-8 flex flex-col gap-3 font-normal tracking-[-0.0002em]">
        <div>
          <strong className="text-blue-500">{hostName}</strong>
          <span>{hostNameParticle} 위해</span>
        </div>
        <div>
          <strong className="text-blue-500">{formatKoreanDate(partyDate)}</strong>
          <span>에</span>
        </div>
        <div>
          <strong className="text-blue-500">{partyTime}</strong>
          <span>부터 {durationMinutes}분 동안</span>
        </div>
        <span>온라인 생일 파티가 열려요</span>
      </div>

      <div className="border-grey-50 mt-12 border-t" />
      <B1 className="text-grey-200 mt-7 font-medium">{footerText}</B1>
    </div>
  );
}
