import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface FirecrackerState {
  firecrackerId: number;
  fire: () => void;
}

export const useFirecrackerStore = create<FirecrackerState>()(
  devtools(
    (set) => ({
      firecrackerId: 0,

      fire: () =>
        set({
          firecrackerId: Date.now(),
        }),
    }),
    { name: 'FirecrackerStore' },
  ),
);
