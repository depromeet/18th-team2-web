import { create } from 'zustand';

interface FirecrackerState {
  firecrackerId: number;
  fire: () => void;
}

export const useFirecrackerStore = create<FirecrackerState>((set) => ({
  firecrackerId: 0,

  fire: () =>
    set({
      firecrackerId: Date.now(),
    }),
}));
