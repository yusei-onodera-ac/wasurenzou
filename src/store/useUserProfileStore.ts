import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const USER_PROFILE_STORAGE_KEY = 'wasureru-memo.profile.v1';

interface UserProfileState {
  displayName: string;
  setDisplayName: (name: string) => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      displayName: '',
      setDisplayName: (name) => set({ displayName: name.slice(0, 20) }),
    }),
    {
      name: USER_PROFILE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
