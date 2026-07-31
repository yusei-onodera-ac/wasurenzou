import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Stack } from 'expo-router';

import { useThemeColors } from '../src/theme/useThemeColors';

interface HelpSection {
  heading: string;
  body: string;
}

export default function HelpScreen() {
  const { t } = useTranslation('help');
  const colors = useThemeColors();
  const sections = t('sections', { returnObjects: true }) as HelpSection[];

  return (
    <>
      <Stack.Screen options={{ title: t('title') }} />
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
        {sections.map((section) => (
          <View key={section.heading} style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.heading, { color: colors.textPrimary }]}>{section.heading}</Text>
            <Text style={[styles.body, { color: colors.textSecondary }]}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  heading: {
    fontSize: 14,
    fontWeight: '700',
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
  },
});
