import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { changeLanguagePreference } from '../../i18n';
import { SUPPORTED_LOCALES } from '../../i18n/locales';
import { useSettingsStore, type LanguageOverride } from '../../store/useSettingsStore';
import { useThemeColors } from '../../theme/useThemeColors';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

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
      <Pressable accessibilityRole="button" style={styles.trigger} onPress={() => setOpen(true)}>
        <Text style={[styles.triggerText, { color: colors.textPrimary }]}>{t(`language.${languageOverride}`)}</Text>
        <ChevronDownIcon size={14} color={colors.textSecondary} />
      </Pressable>
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
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F4EEF9',
    borderRadius: 14,
  },
  triggerText: {
    fontSize: 14,
    fontWeight: '600',
  },
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
