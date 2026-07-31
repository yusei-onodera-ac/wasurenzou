import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const ENTITLEMENT_STORAGE_KEY = 'wasureru-memo.entitlement.v1';

interface EntitlementState {
  isPremium: boolean;
  lastVerifiedAt: number | null;
  setPremium: (isPremium: boolean) => void;
}

export const useEntitlementStore = create<EntitlementState>()(
  persist(
    (set) => ({
      isPremium: false,
      lastVerifiedAt: null,
      setPremium: (isPremium) => set({ isPremium, lastVerifiedAt: Date.now() }),
    }),
    {
      name: ENTITLEMENT_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
