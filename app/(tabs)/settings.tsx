import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

import { useThemeColors } from '../../src/theme/useThemeColors';
import { LanguageDropdown } from '../../src/components/settings/LanguageDropdown';
import { PremiumRow } from '../../src/components/settings/PremiumRow';
import { ThemeSection } from '../../src/components/settings/ThemeSection';
import { SettingsSection } from '../../src/components/settings/SettingsSection';
import { SettingsRow } from '../../src/components/settings/SettingsRow';
import { SwipeTabWrapper } from '../../src/components/navigation/SwipeTabWrapper';
import { useEntitlementStore } from '../../src/store/useEntitlementStore';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { useBubbleStore } from '../../src/store/useBubbleStore';
import { scheduleDecayWarnings } from '../../src/services/notifications/notificationService';

export default function SettingsScreen() {
  const { t } = useTranslation('settings');
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const isPremium = useEntitlementStore((state) => state.isPremium);
  const soundEnabled = useSettingsStore((state) => state.soundEnabled);
  const setSoundEnabled = useSettingsStore((state) => state.setSoundEnabled);
  const notificationsEnabled = useSettingsStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((state) => state.setNotificationsEnabled);

  const handleNotificationsToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      await Promise.all(useBubbleStore.getState().bubbles.map((bubble) => scheduleDecayWarnings(bubble)));
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync().catch(() => {});
    }
  };

  return (
    <SwipeTabWrapper onSwipeRight={() => router.push('/')}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      >
        <Text style={[styles.screenTitle, { color: colors.textPrimary }]}>{t('title')}</Text>

        <PremiumRow isPremium={isPremium} />

        <SettingsSection title={t('preferences.label')}>
          <SettingsRow label={t('preferences.sound')} switchValue={soundEnabled} onSwitchChange={setSoundEnabled} />
          <SettingsRow
            label={t('preferences.notifications')}
            switchValue={notificationsEnabled}
            onSwitchChange={handleNotificationsToggle}
          />
        </SettingsSection>

        <SettingsSection title={t('language.label')}>
          <LanguageDropdown />
        </SettingsSection>

        <SettingsSection title={t('design.label')}>
          <ThemeSection />
        </SettingsSection>

        <SettingsSection>
          <SettingsRow label={t('help.label')} onPress={() => router.push('/help')} />
        </SettingsSection>

        <SettingsSection title={t('legal.label')}>
          <SettingsRow label={t('legal.privacy')} onPress={() => router.push('/privacy')} />
          <SettingsRow label={t('legal.terms')} onPress={() => router.push('/terms')} />
        </SettingsSection>
      </ScrollView>
    </SwipeTabWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    gap: 20,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
});
