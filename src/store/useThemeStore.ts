import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { DEFAULT_THEME_ID } from '../theme/themes';

export const THEME_STORAGE_KEY = 'wasureru-memo.theme.v1';

interface ThemeState {
  selectedThemeId: string;
  setTheme: (id: string) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      selectedThemeId: DEFAULT_THEME_ID,
      setTheme: (id) => set({ selectedThemeId: id }),
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
