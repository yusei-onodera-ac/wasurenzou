import { create } from 'zustand';

interface ToastState {
  message: string | null;
  token: number;
  show: (message: string) => void;
}

export const useToastStore = create<ToastState>()((set, get) => ({
  message: null,
  token: 0,
  show: (message) => set({ message, token: get().token + 1 }),
}));
