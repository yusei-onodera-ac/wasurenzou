import { create } from 'zustand';

interface AddMemoSheetState {
  isVisible: boolean;
  open: () => void;
  close: () => void;
}

export const useAddMemoSheetStore = create<AddMemoSheetState>()((set) => ({
  isVisible: false,
  open: () => set({ isVisible: true }),
  close: () => set({ isVisible: false }),
}));
