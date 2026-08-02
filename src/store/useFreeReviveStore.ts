import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const FREE_REVIVE_STORAGE_KEY = 'wasureru-memo.freeRevive.v1';

interface FreeReviveState {
  /** Date key (YYYY-MM-DD) the premium no-ad revive was last used, or null. */
  lastUsedDateKey: string | null;
  markUsed: (dateKey: string) => void;
}

export const useFreeReviveStore = create<FreeReviveState>()(
  persist(
    (set) => ({
      lastUsedDateKey: null,
      markUsed: (dateKey) => set({ lastUsedDateKey: dateKey }),
    }),
    {
      name: FREE_REVIVE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
