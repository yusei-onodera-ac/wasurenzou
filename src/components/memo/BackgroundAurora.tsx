import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { Circle, Defs, RadialGradient, Stop, Svg } from 'react-native-svg';

import { useThemeColors } from '../../theme/useThemeColors';
import { IllustratedPattern } from './IllustratedPattern';

interface Blob {
  color: string;
  size: number;
  top: number;
  left: number;
  durationMs: number;
}

const BLOB_LAYOUT: Omit<Blob, 'color'>[] = [
  { size: 260, top: 0.04, left: 0.08, durationMs: 22000 },
  { size: 220, top: 0.5, left: 0.58, durationMs: 26000 },
  { size: 200, top: 0.74, left: 0.04, durationMs: 19000 },
];

function AuroraBlob({ color, size, top, left, durationMs }: Blob) {
  const { width, height } = useWindowDimensions();
  const drift = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [drift, durationMs]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * 34 - 17 },
      { translateY: drift.value * 26 - 13 },
    ],
  }));

  const gradientId = `aurora-${color.replace('#', '')}`;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.blob, { top: top * height, left: left * width, width: size, height: size }, animatedStyle]}
    >
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.5} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${gradientId})`} />
      </Svg>
    </Animated.View>
  );
}

export function BackgroundAurora() {
  const colors = useThemeColors();

  if (colors.illustrated) {
    return <IllustratedPattern accent={colors.accent} variant={colors.id === 'elephant-dream' ? 'dream' : 'garden'} />;
  }

  const blobs: Blob[] = BLOB_LAYOUT.map((layout, index) => ({ ...layout, color: colors.blobColors[index] }));

  return (
    <>
      {blobs.map((blob, index) => (
        <AuroraBlob key={index} {...blob} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
  },
});
