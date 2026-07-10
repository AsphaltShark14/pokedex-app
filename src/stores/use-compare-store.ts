import { create } from 'zustand';

const MAX_COMPARE = 2;

type CompareState = {
  compareIds: number[];
  toggleCompare: (id: number) => void;
  clearCompare: () => void;
};

export const useCompareStore = create<CompareState>((set, get) => ({
  compareIds: [],
  toggleCompare: (id) => {
    const current = get().compareIds;

    if (current.includes(id)) {
      set({ compareIds: current.filter((existingId) => existingId !== id) });
      return;
    }

    const next = [...current, id];
    set({ compareIds: next.slice(-MAX_COMPARE) });
  },
  clearCompare: () => set({ compareIds: [] }),
}));
