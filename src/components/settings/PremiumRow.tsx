import { Pressable, StyleSheet, Text, View } from 'react-native';
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
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: isPremium ? colors.surface : colors.accent, opacity: pressed ? 0.85 : 1 },
      ]}
      onPress={() => {
        if (!isPremium) router.push('/paywall');
      }}
    >
      <View style={styles.textWrap}>
        <Text style={[styles.label, { color: isPremium ? colors.textPrimary : '#FFFFFF' }]}>{t('premium.label')}</Text>
        <Text style={[styles.status, { color: isPremium ? colors.textSecondary : 'rgba(255,255,255,0.9)' }]}>
          {isPremium ? t('premium.unlockedStatus') : t('premium.cta')}
        </Text>
      </View>
      {isPremium ? (
        <View style={styles.unlockedBadge}>
          <Text style={styles.unlockedBadgeText}>✓</Text>
        </View>
      ) : (
        <View style={styles.arrowBadge}>
          <Text style={styles.arrowBadgeText}>→</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 18,
    shadowColor: '#4A4458',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  textWrap: {
    gap: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
  unlockedBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F5EB',
  },
  unlockedBadgeText: {
    color: '#3C9A6C',
    fontSize: 13,
    fontWeight: '700',
  },
  arrowBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  arrowBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
