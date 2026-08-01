import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { useThemeStore } from '../../store/useThemeStore';
import { useEntitlementStore } from '../../store/useEntitlementStore';
import { THEMES } from '../../theme/themes';
import { useThemeColors } from '../../theme/useThemeColors';
import { ElephantMascot } from '../icons/ElephantMascot';

export function ThemeSection() {
  const { t } = useTranslation('settings');
  const colors = useThemeColors();
  const router = useRouter();
  const selectedThemeId = useThemeStore((state) => state.selectedThemeId);
  const setTheme = useThemeStore((state) => state.setTheme);
  const isPremium = useEntitlementStore((state) => state.isPremium);
  const [previewId, setPreviewId] = useState<string | null>(null);

  const handlePress = (themeId: string, themeIsPremium: boolean) => {
    if (themeIsPremium && !isPremium) {
      setPreviewId(themeId === previewId ? null : themeId);
      return;
    }
    setPreviewId(null);
    setTheme(themeId);
  };

  const previewTheme = previewId ? THEMES.find((theme) => theme.id === previewId) : null;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {THEMES.map((theme) => {
          const isSelected = theme.id === selectedThemeId && (!theme.isPremium || isPremium);
          const isLocked = theme.isPremium && !isPremium;
          return (
            <Pressable
              key={theme.id}
              accessibilityRole="button"
              style={[styles.swatch, isSelected && { borderColor: colors.accent }]}
              onPress={() => handlePress(theme.id, theme.isPremium)}
            >
              {theme.illustrated ? (
                <>
                  <ElephantMascot size={20} />
                  <View style={[styles.swatchDot, { backgroundColor: theme.accent }]} />
                </>
              ) : (
                <>
                  <View style={[styles.swatchDot, { backgroundColor: theme.swatchPreview[0] }]} />
                  <View style={[styles.swatchDot, { backgroundColor: theme.swatchPreview[1] }]} />
                  <View style={[styles.swatchDot, { backgroundColor: theme.swatchPreview[2] }]} />
                </>
              )}
              {isLocked ? <View style={[styles.lockBadge, { backgroundColor: colors.textSecondary }]} /> : null}
            </Pressable>
          );
        })}
      </View>
      {previewTheme ? (
        <View style={[styles.previewCard, { backgroundColor: previewTheme.background }]}>
          {previewTheme.illustrated ? <ElephantMascot size={48} /> : null}
          <Text style={[styles.previewText, { color: previewTheme.textPrimary }]}>{t('design.locked')}</Text>
          <Pressable
            accessibilityRole="button"
            style={[styles.unlockButton, { backgroundColor: previewTheme.accent }]}
            onPress={() => router.push('/paywall')}
          >
            <Text style={styles.unlockText}>{t('design.unlock')}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  swatch: {
    flexDirection: 'row',
    gap: 3,
    padding: 8,
    borderRadius: 14,
    backgroundColor: '#F4EEF9',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  lockBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  previewCard: {
    marginTop: 10,
    padding: 14,
    borderRadius: 14,
    gap: 10,
    alignItems: 'flex-start',
  },
  previewText: {
    fontSize: 12,
    fontWeight: '600',
  },
  unlockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  unlockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
