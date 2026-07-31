import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';

import { useThemeColors } from '../../src/theme/useThemeColors';
import { LanguageDropdown } from '../../src/components/settings/LanguageDropdown';
import { PremiumRow } from '../../src/components/settings/PremiumRow';
import { ThemeSection } from '../../src/components/settings/ThemeSection';
import { SwipeTabWrapper } from '../../src/components/navigation/SwipeTabWrapper';
import { useEntitlementStore } from '../../src/store/useEntitlementStore';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { useBubbleStore } from '../../src/store/useBubbleStore';
import { scheduleDecayWarnings } from '../../src/services/notifications/notificationService';

function Section({ title, children }: { title: string; children: ReactNode }) {
  const colors = useThemeColors();
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const { t } = useTranslation('settings');
  const colors = useThemeColors();
  const router = useRouter();
  const isPremium = useEntitlementStore((state) => state.isPremium);
  const setPremium = useEntitlementStore((state) => state.setPremium);
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Section title={t('language.label')}>
        <LanguageDropdown />
      </Section>
      <Section title={t('design.label')}>
        <ThemeSection />
      </Section>
      <View style={styles.section}>
        <PremiumRow isPremium={isPremium} />
      </View>
      <Section title={t('preferences.label')}>
        <View style={styles.toggleRow}>
          <Text style={[styles.legalText, { color: colors.textPrimary }]}>{t('preferences.sound')}</Text>
          <Switch value={soundEnabled} onValueChange={setSoundEnabled} trackColor={{ true: colors.accent, false: '#E0D6E8' }} thumbColor="#FFFFFF" />
        </View>
        <View style={styles.toggleRow}>
          <Text style={[styles.legalText, { color: colors.textPrimary }]}>{t('preferences.notifications')}</Text>
          <Switch value={notificationsEnabled} onValueChange={handleNotificationsToggle} trackColor={{ true: colors.accent, false: '#E0D6E8' }} thumbColor="#FFFFFF" />
        </View>
      </Section>
      <View style={styles.section}>
        <Pressable accessibilityRole="button" style={styles.legalRow} onPress={() => router.push('/help')}>
          <Text style={[styles.legalText, { color: colors.textPrimary }]}>{t('help.label')}</Text>
        </Pressable>
      </View>
      <Section title={t('legal.label')}>
        <Pressable accessibilityRole="button" style={styles.legalRow} onPress={() => router.push('/privacy')}>
          <Text style={[styles.legalText, { color: colors.textPrimary }]}>{t('legal.privacy')}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" style={styles.legalRow} onPress={() => router.push('/terms')}>
          <Text style={[styles.legalText, { color: colors.textPrimary }]}>{t('legal.terms')}</Text>
        </Pressable>
      </Section>
      {__DEV__ ? (
        <Section title="__DEV__">
          <View style={styles.devRow}>
            <Text style={[styles.legalText, { color: colors.textPrimary }]}>Mock isPremium</Text>
            <Switch value={isPremium} onValueChange={setPremium} />
          </View>
        </Section>
      ) : null}
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
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  legalRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F4EEF9',
    borderRadius: 14,
  },
  legalText: {
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F4EEF9',
    borderRadius: 14,
  },
  devRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#F4EEF9',
    borderRadius: 14,
  },
});
