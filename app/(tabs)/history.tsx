import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useTaskHistoryStore } from '../../src/store/useTaskHistoryStore';
import { useStreakStore } from '../../src/store/useStreakStore';
import { useUserProfileStore } from '../../src/store/useUserProfileStore';
import { useThemeColors } from '../../src/theme/useThemeColors';
import { formatDateKey } from '../../src/utils/date';
import { useCountUp } from '../../src/hooks/useCountUp';
import { StatTile } from '../../src/components/history/StatTile';
import { HistoryEntryRow } from '../../src/components/history/HistoryEntryRow';
import { MascotGreeting } from '../../src/components/history/MascotGreeting';
import { ProfileNameField } from '../../src/components/history/ProfileNameField';
import { AnalysisSection } from '../../src/components/history/AnalysisSection';
import { pickMascotMessageKey } from '../../src/components/history/pickMascotMessage';
import { BackgroundAurora } from '../../src/components/memo/BackgroundAurora';
import { SwipeTabWrapper } from '../../src/components/navigation/SwipeTabWrapper';
import type { MoodId } from '../../src/components/icons/MoodIcon';

export default function HistoryScreen() {
  const { t } = useTranslation('history');
  const colors = useThemeColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const entries = useTaskHistoryStore((state) => state.entries);
  const currentStreak = useStreakStore((state) => state.currentStreak);
  const displayName = useUserProfileStore((state) => state.displayName);
  const setDisplayName = useUserProfileStore((state) => state.setDisplayName);

  const { completedCount, forgottenCount, achievementRate, groups, topMood } = useMemo(() => {
    let completed = 0;
    let forgotten = 0;
    const byDate = new Map<string, typeof entries>();
    const moodCounts = new Map<MoodId, number>();

    const sorted = [...entries].sort((a, b) => b.resolvedAt - a.resolvedAt);
    for (const entry of sorted) {
      moodCounts.set(entry.mood, (moodCounts.get(entry.mood) ?? 0) + 1);

      if (entry.outcome === 'completed') {
        completed += 1;
        const key = formatDateKey(entry.resolvedAt);
        const bucket = byDate.get(key);
        if (bucket) {
          bucket.push(entry);
        } else {
          byDate.set(key, [entry]);
        }
      } else {
        forgotten += 1;
      }
    }

    const total = completed + forgotten;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    let bestMood: MoodId | null = null;
    let bestCount = 0;
    for (const [mood, count] of moodCounts) {
      if (count > bestCount) {
        bestMood = mood;
        bestCount = count;
      }
    }

    return {
      completedCount: completed,
      forgottenCount: forgotten,
      achievementRate: rate,
      groups: Array.from(byDate.entries()),
      topMood: bestMood,
    };
  }, [entries]);

  const mascotKey = pickMascotMessageKey({
    displayName,
    currentStreak,
    achievementRate,
    completedCount,
    forgottenCount,
  });

  const greeting = displayName ? t('profile.greeting', { name: displayName }) : t('profile.greetingNoName');
  const mascotMessage = t(`mascot.${mascotKey}`, { count: currentStreak, rate: achievementRate });

  const animatedRate = useCountUp(achievementRate);
  const animatedStreak = useCountUp(currentStreak);
  const animatedCompleted = useCountUp(completedCount);
  const animatedForgotten = useCountUp(forgottenCount);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <BackgroundAurora />
      <SwipeTabWrapper onSwipeLeft={() => router.push('/')}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <MascotGreeting greeting={greeting} message={mascotMessage} />

        <Animated.View entering={FadeInDown.duration(500).delay(80).springify()} style={styles.nameFieldWrap}>
          <ProfileNameField value={displayName} onChangeText={setDisplayName} placeholder={t('profile.namePlaceholder')} />
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(500).delay(180).springify()} style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatTile value={`${animatedRate}%`} label={t('achievementRate')} accent="#4CAF7D" />
            <StatTile value={String(animatedStreak)} label={t('streak')} accent={colors.accent} />
          </View>
          <View style={styles.statsRow}>
            <StatTile value={String(animatedCompleted)} label={t('completedCount')} accent="#4CAF7D" />
            <StatTile value={String(animatedForgotten)} label={t('forgottenCount')} accent="#D14343" />
          </View>
        </Animated.View>

        <AnalysisSection totalTasks={completedCount + forgottenCount} topMood={topMood} />

        {groups.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('emptyState')}</Text>
        ) : (
          groups.map(([dateKey, dateEntries], index) => (
            <Animated.View
              key={dateKey}
              entering={FadeInDown.duration(400).delay(320 + index * 60).springify()}
              style={styles.dateGroup}
            >
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>{dateKey}</Text>
              {dateEntries.map((entry) => (
                <HistoryEntryRow key={entry.id} entry={entry} />
              ))}
            </Animated.View>
          ))
        )}
      </ScrollView>
      </SwipeTabWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    gap: 20,
  },
  nameFieldWrap: {
    alignItems: 'center',
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateGroup: {
    gap: 4,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 20,
  },
});
