import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useBubbleStore } from '../../store/useBubbleStore';
import { useThemeColors } from '../../theme/useThemeColors';
import { useElapsedTicker } from '../../hooks/useElapsedTicker';
import { AdBanner } from '../ads/AdBanner';
import { BackgroundAurora } from './BackgroundAurora';
import { AddTaskBar } from './AddTaskBar';
import { MemoListItemAnimated } from './MemoListItem';

const ADD_BAR_HEIGHT = 52;

export function MemoList() {
  const { t } = useTranslation('home');
  const colors = useThemeColors();
  const bubbles = useBubbleStore((state) => state.bubbles);
  const insets = useSafeAreaInsets();
  const now = useElapsedTicker();

  return (
    <View style={styles.container}>
      <BackgroundAurora />
      <View style={{ paddingTop: insets.top }}>
        <AdBanner />
      </View>
      {bubbles.length === 0 ? (
        <View style={styles.emptyState} pointerEvents="none">
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>{t('emptyState.title')}</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>{t('emptyState.subtitle')}</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + ADD_BAR_HEIGHT + 28 }]}
          showsVerticalScrollIndicator={false}
        >
          {bubbles.map((bubble, index) => (
            <MemoListItemAnimated key={bubble.id} bubble={bubble} now={now} showSwipeHint={index === 0} />
          ))}
        </ScrollView>
      )}
      <View style={[styles.addBarDock, { paddingBottom: insets.bottom + 12 }]}>
        <AddTaskBar />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  emptyState: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  addBarDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});
