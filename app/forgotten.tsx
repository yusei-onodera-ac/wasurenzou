import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { colors } from '../src/theme/colors';
import { useBubbleStore } from '../src/store/useBubbleStore';
import { useForgottenQueueStore } from '../src/store/useForgottenQueueStore';
import { useEntitlementStore } from '../src/store/useEntitlementStore';
import { useFreeReviveStore } from '../src/store/useFreeReviveStore';
import { adService } from '../src/services/ads';
import { playSound } from '../src/services/sound/soundService';
import { formatDateKey } from '../src/utils/date';
import { ElephantMascot } from '../src/components/icons/ElephantMascot';
import { MoodIcon } from '../src/components/icons/MoodIcon';

export default function ForgottenScreen() {
  const { t } = useTranslation(['forgotten', 'ads', 'common']);
  const router = useRouter();
  const queue = useForgottenQueueStore((state) => state.queue);
  const dequeue = useForgottenQueueStore((state) => state.dequeue);
  const isPremium = useEntitlementStore((state) => state.isPremium);
  const lastFreeReviveDateKey = useFreeReviveStore((state) => state.lastUsedDateKey);
  const [isReviving, setIsReviving] = useState(false);

  const current = queue[0] ?? null;
  const canFreeRevive = isPremium && lastFreeReviveDateKey !== formatDateKey(Date.now());

  useEffect(() => {
    if (!current) {
      router.replace('/');
      return;
    }
    playSound('forgotten');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  if (!current) {
    return null;
  }

  const advance = () => {
    dequeue();
    const remaining = useForgottenQueueStore.getState().queue.length;
    if (remaining === 0) {
      router.replace('/');
    }
  };

  const handleWatchAd = async () => {
    if (isReviving) return;
    setIsReviving(true);
    try {
      const result = await adService.showRewardedAd();
      if (result.earnedReward) {
        useBubbleStore.getState().reviveStashed(current);
      }
      advance();
    } finally {
      setIsReviving(false);
    }
  };

  const handleDontRevive = () => {
    useBubbleStore.getState().commitForgotten(current);
    advance();
  };

  const handleFreeRevive = () => {
    if (isReviving) return;
    const items = useForgottenQueueStore.getState().queue;
    items.forEach((item) => useBubbleStore.getState().reviveStashed(item));
    useForgottenQueueStore.getState().clearAll();
    useFreeReviveStore.getState().markUsed(formatDateKey(Date.now()));
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Animated.View key={current.id} entering={FadeIn.duration(300)} style={styles.content}>
        <ElephantMascot size={110} />
        <Text style={styles.title}>{t('forgotten:title')}</Text>
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={styles.taskCard}>
          <View style={[styles.iconCircle, { backgroundColor: current.color }]}>
            <MoodIcon mood={current.mood} size={20} color="#4A4458" />
          </View>
          <Text style={styles.taskText} numberOfLines={2}>
            {current.text ?? t('untitledTask', { ns: 'common' })}
          </Text>
        </Animated.View>
        <Text style={styles.message}>{t('forgotten:message')}</Text>

        <Pressable
          accessibilityRole="button"
          style={styles.reviveButton}
          onPress={handleWatchAd}
          disabled={isReviving}
        >
          {isReviving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.reviveText}>{t('watchAdToRevive', { ns: 'ads' })}</Text>
          )}
        </Pressable>

        {canFreeRevive ? (
          <Pressable
            accessibilityRole="button"
            style={styles.freeReviveButton}
            onPress={handleFreeRevive}
            disabled={isReviving}
          >
            <Text style={styles.freeReviveText}>{t('forgotten:freeRevive')}</Text>
          </Pressable>
        ) : null}

        <Pressable accessibilityRole="button" onPress={handleDontRevive} disabled={isReviving}>
          <Text style={styles.dontReviveText}>{t('forgotten:dontRevive')}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 340,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
    marginTop: 8,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  message: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
  },
  reviveButton: {
    width: '100%',
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviveText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  freeReviveButton: {
    width: '100%',
    height: 48,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -4,
  },
  freeReviveText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  dontReviveText: {
    fontSize: 13,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
    marginTop: 4,
    padding: 8,
  },
});
