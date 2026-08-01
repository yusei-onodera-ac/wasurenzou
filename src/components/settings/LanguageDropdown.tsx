import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { changeLanguagePreference } from '../../i18n';
import { SUPPORTED_LOCALES } from '../../i18n/locales';
import { useSettingsStore, type LanguageOverride } from '../../store/useSettingsStore';
import { useThemeColors } from '../../theme/useThemeColors';
import { SettingsRow } from './SettingsRow';

const OPTIONS: LanguageOverride[] = ['system', ...SUPPORTED_LOCALES.map((locale) => locale.code)];

export function LanguageDropdown() {
  const { t } = useTranslation('settings');
  const colors = useThemeColors();
  const languageOverride = useSettingsStore((state) => state.languageOverride);
  const [open, setOpen] = useState(false);

  const handleSelect = (option: LanguageOverride) => {
    changeLanguagePreference(option);
    setOpen(false);
  };

  return (
    <>
      <SettingsRow label={t('language.label')} value={t(`language.${languageOverride}`)} onPress={() => setOpen(true)} />
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.menu}>
            {OPTIONS.map((option, index) => {
              const selected = option === languageOverride;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  style={[
                    styles.menuRow,
                    index > 0 && styles.menuRowDivider,
                    selected && { backgroundColor: '#FFD6EC' },
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={[styles.menuRowText, selected && styles.menuRowTextSelected, { color: colors.textPrimary }]}>
                    {t(`language.${option}`)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(74, 68, 88, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  menu: {
    width: '100%',
    maxWidth: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuRow: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  menuRowDivider: {
    borderTopWidth: 1,
    borderTopColor: '#EADCF2',
  },
  menuRowText: {
    fontSize: 14,
  },
  menuRowTextSelected: {
    fontWeight: '700',
  },
});
