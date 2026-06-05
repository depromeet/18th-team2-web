import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { PARTICIPANT_TOKEN_KEY } from '@/constants/live-party';

interface ParticipantState {
  participantToken: string | null;
  setParticipantToken: (token: string) => void;
  clearParticipantToken: () => void;
}

export const useParticipantStore = create<ParticipantState>()(
  devtools(
    (set) => ({
      participantToken: sessionStorage.getItem(PARTICIPANT_TOKEN_KEY),
      setParticipantToken: (token) => {
        sessionStorage.setItem(PARTICIPANT_TOKEN_KEY, token);
        set({ participantToken: token });
      },
      clearParticipantToken: () => {
        sessionStorage.removeItem(PARTICIPANT_TOKEN_KEY);
        set({ participantToken: null });
      },
    }),
    { name: 'ParticipantStore' },
  ),
);
