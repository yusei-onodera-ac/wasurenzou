import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { HistoryEntry, NewHistoryEntry } from '../types/history';
import { generateId } from '../utils/id';

export const TASK_HISTORY_STORAGE_KEY = 'wasureru-memo.history.v1';

interface TaskHistoryState {
  entries: HistoryEntry[];
  addEntry: (entry: NewHistoryEntry) => void;
}

export const useTaskHistoryStore = create<TaskHistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => {
        const historyEntry: HistoryEntry = { id: generateId(), ...entry };
        set({ entries: [...get().entries, historyEntry] });
      },
    }),
    {
      name: TASK_HISTORY_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
