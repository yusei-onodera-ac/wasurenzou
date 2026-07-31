import { Pressable, StyleSheet, Text } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useAddMemoSheetStore } from '../../store/useAddMemoSheetStore';
import { useThemeColors } from '../../theme/useThemeColors';
import { PlusIcon } from '../icons/PlusIcon';

export function AddTaskBar() {
  const { t } = useTranslation('home');
  const colors = useThemeColors();
  const open = useAddMemoSheetStore((state) => state.open);

  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.button, { backgroundColor: colors.accent, shadowColor: colors.accent }]}
      onPress={open}
    >
      <PlusIcon size={18} />
      <Text style={styles.label}>{t('addButton')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
