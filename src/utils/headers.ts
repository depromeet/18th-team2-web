import { PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';
import { useAuthStore } from '@/stores/useAuthStore';

export function getParticipantOptions() {
  const isLoggedIn = Boolean(useAuthStore.getState().accessToken);
  const participantToken = sessionStorage.getItem(PARTICIPANT_TOKEN_KEY);
  return !isLoggedIn && participantToken
    ? { headers: { 'X-Participant-Token': participantToken } }
    : undefined;
}
