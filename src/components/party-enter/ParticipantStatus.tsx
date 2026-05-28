import infoIcon from '@/assets/icons/icon-info.svg';
import { L1 } from '@/components/ui/Typography';
import { type Participant } from '@/services/party-enter';

interface ParticipantStatusProps {
  participants: Participant[];
}

const AVATAR_PREVIEW_COUNT = 3;

export function ParticipantStatus({ participants }: ParticipantStatusProps) {
  const hasParticipants = participants.length > 0;
  const firstParticipantNickname = participants[0]?.nickname ?? '';
  const restParticipantCount = Math.max(participants.length - 1, 0);
  const previewParticipants = participants.slice(0, AVATAR_PREVIEW_COUNT);

  return (
    <section className="rounded-btn-md bg-blue-30 my-3 flex h-12 w-full items-center justify-between px-4 py-2">
      {hasParticipants ? (
        <>
          <L1 as="p" className="text-grey-500">
            {firstParticipantNickname}님 외
            <span className="text-blue-700"> {restParticipantCount}명</span> 참여중
          </L1>
          <ul className="flex h-7 items-center">
            {previewParticipants.map((participant, index) => (
              <li
                key={participant.id}
                className={`h-7 w-7 overflow-hidden rounded-full bg-white ${index > 0 ? '-ml-2' : ''}`}
              >
                <img
                  src={participant.imageUrl}
                  alt={participant.nickname}
                  className="h-full w-full object-cover"
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="flex items-center gap-2">
          <img src={infoIcon} alt="" aria-hidden="true" className="h-5 w-5" />
          <L1 as="p" className="text-blue-700">
            아직 참여중인 사람이 없어요
          </L1>
        </div>
      )}
    </section>
  );
}
