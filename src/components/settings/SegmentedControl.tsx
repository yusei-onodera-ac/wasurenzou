import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

interface SegmentedControlProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  labelFor: (value: T) => string;
}

export function SegmentedControl<T extends string>({ options, value, onChange, labelFor }: SegmentedControlProps<T>) {
  return (
    <View style={styles.row}>
      {options.map((option) => (
        <Pressable
          key={option}
          accessibilityRole="button"
          style={[styles.segment, value === option && styles.segmentSelected]}
          onPress={() => onChange(option)}
        >
          <Text style={[styles.segmentText, value === option && styles.segmentTextSelected]}>{labelFor(option)}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#F4EEF9',
    borderRadius: 14,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  segmentSelected: {
    backgroundColor: colors.surface,
  },
  segmentText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  segmentTextSelected: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
