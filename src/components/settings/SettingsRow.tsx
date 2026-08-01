import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/useThemeColors';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface SettingsRowProps {
  label: string;
  onPress?: () => void;
  value?: string;
  valueColor?: string;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  showChevron?: boolean;
  right?: ReactNode;
}

const ROW_MIN_HEIGHT = 52;

export function SettingsRow({
  label,
  onPress,
  value,
  valueColor,
  switchValue,
  onSwitchChange,
  showChevron,
  right,
}: SettingsRowProps) {
  const colors = useThemeColors();
  const isToggle = typeof switchValue === 'boolean' && Boolean(onSwitchChange);
  const shouldShowChevron = showChevron ?? (Boolean(onPress) && !isToggle);

  const content = (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.textPrimary }]} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.right}>
        {value ? (
          <Text style={[styles.value, { color: valueColor ?? colors.textSecondary }]} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
        {right}
        {isToggle ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ true: colors.accent, false: '#E0D6E8' }}
            thumbColor="#FFFFFF"
          />
        ) : null}
        {shouldShowChevron ? (
          <View style={styles.chevron}>
            <ChevronDownIcon size={13} color={colors.textSecondary} />
          </View>
        ) : null}
      </View>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]} hitSlop={4}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: ROW_MIN_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    flexShrink: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  chevron: {
    transform: [{ rotate: '-90deg' }],
  },
});
