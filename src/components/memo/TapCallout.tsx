import { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { colors } from '../../theme/colors';

interface TapCalloutProps {
  text: string;
}

export function TapCallout({ text }: TapCalloutProps) {
  const bounce = useSharedValue(0);

  useEffect(() => {
    bounce.value = withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, true);
  }, [bounce]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -bounce.value * 3 }],
  }));

  return (
    <Animated.View style={[styles.callout, animatedStyle]} pointerEvents="none">
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  callout: {
    position: 'absolute',
    top: -14,
    right: 20,
    backgroundColor: colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
