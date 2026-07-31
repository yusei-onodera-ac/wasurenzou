import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import i18n from '../../i18n';
import type { Bubble } from '../../types/bubble';
import { computeDecayCompletionTime } from '../../utils/decay';
import { useSettingsStore } from '../../store/useSettingsStore';

const WARNING_TIERS: { minutesBefore: number; tierKey: 'tier1' | 'tier2' | 'tier3' }[] = [
  { minutesBefore: 60, tierKey: 'tier1' },
  { minutesBefore: 30, tierKey: 'tier2' },
  { minutesBefore: 10, tierKey: 'tier3' },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let hasRequestedPermission = false;

async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (hasRequestedPermission) return false;
  hasRequestedPermission = true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

function identifierFor(bubbleId: string, tierKey: string): string {
  return `decay-warning-${bubbleId}-${tierKey}`;
}

export async function cancelDecayWarnings(bubbleId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  await Promise.all(
    WARNING_TIERS.map((tier) =>
      Notifications.cancelScheduledNotificationAsync(identifierFor(bubbleId, tier.tierKey)).catch(() => {})
    )
  );
}

export async function scheduleDecayWarnings(bubble: Bubble): Promise<void> {
  if (Platform.OS === 'web') return;
  if (!useSettingsStore.getState().notificationsEnabled) return;

  const granted = await ensurePermission();
  if (!granted) return;

  await cancelDecayWarnings(bubble.id);

  const decayCompleteAt = computeDecayCompletionTime(bubble.lastReinforcedAt, bubble.dueDate);
  const content = bubble.text ?? i18n.t('untitledTask', { ns: 'common' });

  for (const tier of WARNING_TIERS) {
    const triggerAt = decayCompleteAt - tier.minutesBefore * 60 * 1000;
    if (triggerAt <= Date.now()) continue;

    await Notifications.scheduleNotificationAsync({
      identifier: identifierFor(bubble.id, tier.tierKey),
      content: {
        title: i18n.t('title', { ns: 'notifications' }),
        body: i18n.t(tier.tierKey, { ns: 'notifications', content }),
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(triggerAt) },
    });
  }
}
