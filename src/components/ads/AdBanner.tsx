import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useEntitlementStore } from '../../store/useEntitlementStore';
import { colors } from '../../theme/colors';

export function AdBanner() {
  const { t } = useTranslation('ads');
  const isPremium = useEntitlementStore((state) => state.isPremium);

  if (isPremium) return null;

  return (
    <View style={styles.wrap}>
      <View style={styles.banner}>
        <Text style={styles.text}>{t('bannerPlaceholder')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  banner: {
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4EEF9',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(74, 68, 88, 0.14)',
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 2,
  },
});
