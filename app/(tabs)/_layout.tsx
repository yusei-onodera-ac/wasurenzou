import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIcon } from '../../src/components/icons/HomeIcon';
import { HistoryIcon } from '../../src/components/icons/HistoryIcon';
import { GearIcon } from '../../src/components/icons/GearIcon';
import { useThemeColors } from '../../src/theme/useThemeColors';

export default function TabsLayout() {
  const { t } = useTranslation(['home', 'history', 'settings']);
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: 'rgba(74, 68, 88, 0.08)',
          backgroundColor: colors.surface,
          height: 64 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="history"
        options={{
          title: t('history:tabLabel'),
          tabBarIcon: ({ color, size }) => <HistoryIcon color={String(color)} size={size} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: t('home:tabLabel'),
          tabBarIcon: ({ color, size }) => <HomeIcon color={String(color)} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings:title'),
          tabBarIcon: ({ color, size }) => <GearIcon color={String(color)} size={size} />,
        }}
      />
    </Tabs>
  );
}
