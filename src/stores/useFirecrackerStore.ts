import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FirecrackerState {
  firecrackerId: number;
  firingParticipantId: number | null;
  fire: (participantId?: number) => void;
}

export const useFirecrackerStore = create<FirecrackerState>()(
  devtools(
    (set) => ({
      firecrackerId: 0,
      firingParticipantId: null,

      fire: (participantId?: number) =>
        set({
          firecrackerId: Date.now(),
          firingParticipantId: participantId ?? null,
        }),
    }),
    { name: 'FirecrackerStore' },
  ),
);
