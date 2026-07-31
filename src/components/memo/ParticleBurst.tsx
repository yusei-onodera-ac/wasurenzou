import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ParticleBurstProps {
  x: number | `${number}%`;
  y: number | `${number}%`;
  color: string;
}

const PARTICLE_COUNT = 7;
const BURST_RADIUS = 34;
const PARTICLE_SIZE = 5;

function Particle({ angle, color }: { angle: number; color: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const distance = progress.value * BURST_RADIUS;
    return {
      transform: [
        { translateX: Math.cos(angle) * distance },
        { translateY: Math.sin(angle) * distance },
        { scale: 1 - progress.value },
      ],
      opacity: 1 - progress.value,
    };
  });

  return <Animated.View style={[styles.particle, { backgroundColor: color }, animatedStyle]} />;
}

export function ParticleBurst({ x, y, color }: ParticleBurstProps) {
  const angles = Array.from({ length: PARTICLE_COUNT }, (_, i) => (i / PARTICLE_COUNT) * Math.PI * 2);

  return (
    <View pointerEvents="none" style={[styles.container, { left: x, top: y }]}>
      {angles.map((angle) => (
        <Particle key={angle} angle={angle} color={color} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  particle: {
    position: 'absolute',
    width: PARTICLE_SIZE,
    height: PARTICLE_SIZE,
    borderRadius: PARTICLE_SIZE / 2,
  },
});
