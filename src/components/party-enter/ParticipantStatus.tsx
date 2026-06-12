import infoIcon from '@/assets/icons/icon-info.svg';
import { L1 } from '@/components/ui/Typography';
import type { components } from '@/types/api';
import { ParticipantAvatarGroup } from '../live-party/ParticipantAvatarGroup';

type PartyParticipant = components['schemas']['PartyParticipantResponse'];

interface ParticipantStatusProps {
  participants: PartyParticipant[];
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
            <span className="font-semibold">
              {firstParticipantNickname}님
              {restParticipantCount > 0 && (
                <>
                  {' '}
                  외<span className="text-blue-700"> {restParticipantCount}명</span>
                </>
              )}
            </span>
            이 기다리는 중
          </L1>
          <ParticipantAvatarGroup participants={previewParticipants} size="sm" />
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
