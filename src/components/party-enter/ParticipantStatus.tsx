import { L1 } from '@/components/ui/Typography';
import { type Participant } from '@/services/party-enter';

interface ParticipantStatusProps {
  participants: Participant[];
}

export function ParticipantStatus({ participants }: ParticipantStatusProps) {
  const hasParticipants = participants.length > 0;
  const firstParticipantNickname = participants[0]?.nickname ?? '';
  const restParticipantCount = Math.max(participants.length - 1, 0);

  return (
    <section className="rounded-btn-md bg-blue-30 my-3 flex h-12 w-full items-center justify-between px-4 py-2">
      {hasParticipants ? (
        <>
          <L1 as="p" className="text-grey-500">
            {firstParticipantNickname}님 외
            <span className="text-blue-700"> {restParticipantCount}명</span> 참여중
          </L1>
          {/* TODO: 이미지로 변경 */}
          <figure className="h-8 w-[84px] rounded-full bg-blue-100" />
        </>
      ) : (
        <div className="flex items-center gap-2">
          {/* TODO: 아이콘으로 변경 */}
          <span className="h-2 w-2 rounded-full bg-blue-700" />
          <L1 as="p" className="text-blue-700">
            아직 참여중인 사람이 없어요
          </L1>
        </div>
      )}
    </section>
  );
}
