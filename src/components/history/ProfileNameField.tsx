import { StyleSheet, TextInput } from 'react-native';

import { colors } from '../../theme/colors';

interface ProfileNameFieldProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export function ProfileNameField({ value, onChangeText, placeholder }: ProfileNameFieldProps) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textSecondary}
      maxLength={20}
      textAlign="center"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 14,
    minWidth: 140,
  },
});
