import { ScrollView, StyleSheet, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';

import { colors } from '../src/theme/colors';

export default function TermsScreen() {
  const { t } = useTranslation('legal');

  return (
    <>
      <Stack.Screen options={{ title: t('termsTitle') }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.updated}>{t('lastUpdated')}</Text>
        <Text style={styles.body}>{t('termsBody')}</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  updated: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textPrimary,
  },
});
