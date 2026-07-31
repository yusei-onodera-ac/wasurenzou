import { Pressable, StyleSheet, View } from 'react-native';

import { BUBBLE_COLORS } from '../../theme/colors';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <View style={styles.row}>
      {BUBBLE_COLORS.map((color) => (
        <Pressable
          key={color}
          accessibilityRole="button"
          style={[styles.swatch, { backgroundColor: color }, color === value && styles.swatchSelected]}
          onPress={() => onChange(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  swatch: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  swatchSelected: {
    borderColor: '#4A4458',
  },
});
