import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../../theme/colors';
import { ElephantMascot } from '../icons/ElephantMascot';

interface MascotGreetingProps {
  greeting: string;
  message: string;
}

export function MascotGreeting({ greeting, message }: MascotGreetingProps) {
  const bob = useSharedValue(0);

  useEffect(() => {
    bob.value = withRepeat(withSequence(withTiming(1, { duration: 1400 }), withTiming(0, { duration: 1400 })), -1, true);
  }, [bob]);

  const mascotStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -bob.value * 6 }, { rotate: `${(bob.value - 0.5) * 4}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(500).springify()} style={mascotStyle}>
        <ElephantMascot size={96} />
      </Animated.View>
      <Animated.View entering={FadeInDown.duration(500).delay(120).springify()} style={styles.bubble}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.bubbleTail} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
  },
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    maxWidth: '86%',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleTail: {
    position: 'absolute',
    top: -8,
    alignSelf: 'center',
    width: 16,
    height: 16,
    backgroundColor: colors.surface,
    transform: [{ rotate: '45deg' }],
  },
  greeting: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  message: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
});
