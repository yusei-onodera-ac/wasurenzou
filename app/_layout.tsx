import 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import mobileAds from 'react-native-google-mobile-ads';

import { i18nReadyPromise } from '../src/i18n';
import { useStreakStore } from '../src/store/useStreakStore';
import { useBubbleStore } from '../src/store/useBubbleStore';
import { Toast } from '../src/components/common/Toast';
import { GlobalAddMemoSheet } from '../src/components/add-memo/GlobalAddMemoSheet';

/** How often to re-check for repeat-tasks whose scheduled day has arrived while the app stays open. */
const PENDING_CHECK_INTERVAL_MS = 60_000;

SplashScreen.preventAutoHideAsync().catch(() => {});
mobileAds().initialize().catch(() => {});

export default function RootLayout() {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    i18nReadyPromise.finally(() => setIsI18nReady(true));
  }, []);

  useEffect(() => {
    if (isI18nReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isI18nReady]);

  useEffect(() => {
    const unsubscribe = useStreakStore.persist.onFinishHydration(() => {
      useStreakStore.getState().recordOpen();
    });
    if (useStreakStore.persist.hasHydrated()) {
      useStreakStore.getState().recordOpen();
    }
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = useBubbleStore.persist.onFinishHydration(() => {
      useBubbleStore.getState().activatePending();
    });
    if (useBubbleStore.persist.hasHydrated()) {
      useBubbleStore.getState().activatePending();
    }

    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        useBubbleStore.getState().activatePending();
      }
    });
    const intervalId = setInterval(() => {
      useBubbleStore.getState().activatePending();
    }, PENDING_CHECK_INTERVAL_MS);

    return () => {
      unsubscribe();
      appStateSubscription.remove();
      clearInterval(intervalId);
    };
  }, []);

  if (!isI18nReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="paywall" options={{ headerShown: true, presentation: 'modal' }} />
          <Stack.Screen
            name="forgotten"
            options={{ headerShown: false, presentation: 'modal', gestureEnabled: false }}
          />
          <Stack.Screen name="privacy" options={{ headerShown: true }} />
          <Stack.Screen name="terms" options={{ headerShown: true }} />
          <Stack.Screen name="help" options={{ headerShown: true }} />
        </Stack>
        <Toast />
        <GlobalAddMemoSheet />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
