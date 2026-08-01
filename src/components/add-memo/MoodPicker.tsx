import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { MOOD_IDS, PREMIUM_MOOD_IDS, MoodIcon, type MoodId } from '../icons/MoodIcon';
import { useEntitlementStore } from '../../store/useEntitlementStore';
import { colors } from '../../theme/colors';

interface MoodPickerProps {
  value: MoodId;
  onChange: (mood: MoodId) => void;
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  const router = useRouter();
  const isPremium = useEntitlementStore((state) => state.isPremium);

  return (
    <View style={styles.row}>
      {MOOD_IDS.map((mood) => {
        const locked = PREMIUM_MOOD_IDS.includes(mood) && !isPremium;
        return (
          <Pressable
            key={mood}
            accessibilityRole="button"
            style={[styles.option, mood === value && styles.optionSelected, locked && styles.optionLocked]}
            onPress={() => (locked ? router.push('/paywall') : onChange(mood))}
          >
            <MoodIcon mood={mood} size={20} color={mood === value ? colors.accent : colors.textPrimary} />
            {locked ? <View style={styles.lockBadge} /> : null}
          </Pressable>
        );
      })}
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
  optionLocked: {
    opacity: 0.55,
  },
  lockBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.textSecondary,
  },
});
