import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import type { MoodId } from '../icons/MoodIcon';
import { MoodIcon } from '../icons/MoodIcon';
import { colors } from '../../theme/colors';

interface AnalysisSectionProps {
  totalTasks: number;
  topMood: MoodId | null;
}

export function AnalysisSection({ totalTasks, topMood }: AnalysisSectionProps) {
  const { t } = useTranslation('history');

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(260).springify()} style={styles.card}>
      <Text style={styles.title}>{t('analysis.title')}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>{t('analysis.totalTasks')}</Text>
        <Text style={styles.value}>{totalTasks}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>{t('analysis.mostUsedMood')}</Text>
        {topMood ? (
          <View style={styles.moodBadge}>
            <MoodIcon mood={topMood} size={18} color={colors.accent} />
          </View>
        ) : (
          <Text style={styles.value}>{t('analysis.noMoodData')}</Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(74, 68, 88, 0.12)',
  },
  moodBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0F8',
  },
});
