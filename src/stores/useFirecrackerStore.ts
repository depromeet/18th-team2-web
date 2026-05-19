import { create } from 'zustand';

interface FirecrackerState {
  triggerCount: number;
  fire: () => void;
}

export const useFirecrackerStore = create<FirecrackerState>((set) => ({
  triggerCount: 0,

  fire: () =>
    set((state) => ({
      triggerCount: state.triggerCount + 1,
    })),
}));
