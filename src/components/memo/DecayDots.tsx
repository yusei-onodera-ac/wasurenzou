import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';

const DOT_COUNT = 4;
const DOT_SIZE = 6;

interface DotProps {
  decayProgress: SharedValue<number>;
  index: number;
}

function Dot({ decayProgress, index }: DotProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const segmentStart = index / DOT_COUNT;
    const segmentEnd = (index + 1) / DOT_COUNT;
    const local = Math.min(Math.max((decayProgress.value - segmentStart) / (segmentEnd - segmentStart), 0), 1);
    return {
      opacity: 1 - local * 0.85,
      backgroundColor: interpolateColor(decayProgress.value, [0, 0.7, 1], ['#FF8FC7', '#F5A65B', '#D14343']),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

interface DecayDotsProps {
  decayProgress: SharedValue<number>;
}

export function DecayDots({ decayProgress }: DecayDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: DOT_COUNT }, (_, index) => (
        <Dot key={index} decayProgress={decayProgress} index={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});
