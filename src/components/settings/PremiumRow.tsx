import { Pressable, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { useThemeColors } from '../../theme/useThemeColors';

interface PremiumRowProps {
  isPremium: boolean;
}

export function PremiumRow({ isPremium }: PremiumRowProps) {
  const { t } = useTranslation('settings');
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <Pressable
      accessibilityRole="button"
      style={styles.row}
      onPress={() => {
        if (!isPremium) router.push('/paywall');
      }}
    >
      <Text style={[styles.label, { color: colors.textPrimary }]}>{t('premium.label')}</Text>
      <Text style={[styles.status, { color: isPremium ? colors.textSecondary : colors.accent }]}>
        {isPremium ? t('premium.unlockedStatus') : t('premium.cta')}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#F4EEF9',
    borderRadius: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  status: {
    fontSize: 13,
    fontWeight: '700',
  },
});
