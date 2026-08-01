import { Children, isValidElement, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/useThemeColors';

interface SettingsSectionProps {
  title?: string;
  children: ReactNode;
}

/** Groups rows into a single rounded card with dividers, iOS-Settings style. */
export function SettingsSection({ title, children }: SettingsSectionProps) {
  const colors = useThemeColors();
  const items = Children.toArray(children).filter(isValidElement);

  return (
    <View style={styles.wrap}>
      {title ? <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text> : null}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        {items.map((child, index) => (
          <View key={index} style={index < items.length - 1 ? styles.divider : undefined}>
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginLeft: 6,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4A4458',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(74, 68, 88, 0.08)',
  },
});
