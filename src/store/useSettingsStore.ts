import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type LanguageOverride = 'system' | 'ja' | 'en' | 'ko' | 'zh';

export const SETTINGS_STORAGE_KEY = 'wasureru-memo.settings.v1';

interface SettingsState {
  languageOverride: LanguageOverride;
  setLanguageOverride: (value: LanguageOverride) => void;
  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      languageOverride: 'system',
      setLanguageOverride: (value) => set({ languageOverride: value }),
      soundEnabled: true,
      setSoundEnabled: (value) => set({ soundEnabled: value }),
      notificationsEnabled: true,
      setNotificationsEnabled: (value) => set({ notificationsEnabled: value }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
