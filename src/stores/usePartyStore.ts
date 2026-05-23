import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface PartyState {
  hostName: string;
  setHostName: (name: string) => void;
}

export const usePartyStore = create<PartyState>()(
  devtools(
    persist(
      (set) => ({
        hostName: '',
        setHostName: (name) => set({ hostName: name }, false, 'setHostName'),
      }),
      { name: 'party-storage' },
    ),
    { name: 'PartyStore' },
  ),
);
