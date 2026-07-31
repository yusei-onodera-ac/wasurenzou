import { create } from 'zustand';

import type { Bubble } from '../types/bubble';

interface ForgottenQueueState {
  queue: Bubble[];
  enqueue: (bubble: Bubble) => void;
  dequeue: () => void;
}

export const useForgottenQueueStore = create<ForgottenQueueState>()((set, get) => ({
  queue: [],
  enqueue: (bubble) => set({ queue: [...get().queue, bubble] }),
  dequeue: () => set({ queue: get().queue.slice(1) }),
}));
