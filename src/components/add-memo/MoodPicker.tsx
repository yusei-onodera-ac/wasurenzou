import { Pressable, StyleSheet, View } from 'react-native';

import { MOOD_IDS, MoodIcon, type MoodId } from '../icons/MoodIcon';
import { colors } from '../../theme/colors';

interface MoodPickerProps {
  value: MoodId;
  onChange: (mood: MoodId) => void;
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <View style={styles.row}>
      {MOOD_IDS.map((mood) => (
        <Pressable
          key={mood}
          accessibilityRole="button"
          style={[styles.option, mood === value && styles.optionSelected]}
          onPress={() => onChange(mood)}
        >
          <MoodIcon mood={mood} size={20} color={mood === value ? colors.accent : colors.textPrimary} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4EEF9',
  },
  optionSelected: {
    backgroundColor: '#FFD6EC',
  },
});
