import { resolveImageUrl } from '@/utils/image';
import type { components } from '@/types/api';

type PartyParticipant = components['schemas']['PartyParticipantResponse'];

interface ParticipantAvatarGroupProps {
  participants: PartyParticipant[];
  size?: 'sm' | 'lg';
}

const avatarSizeStyles = {
  sm: 'h-6 w-6',
  lg: 'h-7 w-7',
} as const;

export function ParticipantAvatarGroup({ participants, size = 'sm' }: ParticipantAvatarGroupProps) {
  return (
    <div className="flex -space-x-2">
      {participants.map((participant) => (
        <img
          key={participant.participantId}
          src={resolveImageUrl(participant.thumbnailImageUrl) ?? ''}
          alt={participant.nickname}
          className={`${avatarSizeStyles[size]} rounded-full object-cover ring-1 ring-white`}
        />
      ))}
    </div>
  );
}
