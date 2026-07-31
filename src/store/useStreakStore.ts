import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { formatDateKey } from '../utils/date';

export const STREAK_STORAGE_KEY = 'wasureru-memo.streak.v1';

const DAY_MS = 24 * 60 * 60 * 1000;

interface StreakState {
  lastOpenDateKey: string | null;
  currentStreak: number;
  recordOpen: () => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      lastOpenDateKey: null,
      currentStreak: 0,
      recordOpen: () => {
        const now = Date.now();
        const todayKey = formatDateKey(now);
        const { lastOpenDateKey, currentStreak } = get();

        if (lastOpenDateKey === todayKey) return;

        const yesterdayKey = formatDateKey(now - DAY_MS);
        const nextStreak = lastOpenDateKey === yesterdayKey ? currentStreak + 1 : 1;

        set({ lastOpenDateKey: todayKey, currentStreak: nextStreak });
      },
    }),
    {
      name: STREAK_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
