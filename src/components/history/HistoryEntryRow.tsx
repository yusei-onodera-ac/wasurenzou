import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { HistoryEntry } from '../../types/history';
import { colors } from '../../theme/colors';
import { lightenColor } from '../../utils/color';
import { MoodIcon } from '../icons/MoodIcon';

interface HistoryEntryRowProps {
  entry: HistoryEntry;
}

export function HistoryEntryRow({ entry }: HistoryEntryRowProps) {
  const { t } = useTranslation('history');

  return (
    <View style={styles.row}>
      <View style={[styles.iconCircle, { backgroundColor: lightenColor(entry.color, 0.7) }]}>
        <MoodIcon mood={entry.mood} size={18} color="#4A4458" />
      </View>
      <Text style={styles.text} numberOfLines={1}>
        {entry.text ?? t('emptyState')}
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{t('outcomeCompleted')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E3F5EB',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3C9A6C',
  },
});
