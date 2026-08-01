import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Path, Svg } from 'react-native-svg';

import { ElephantMascot } from '../icons/ElephantMascot';

interface ElephantSpot {
  top: number;
  left: number;
  size: number;
  rotate: string;
}

interface StarSpot {
  top: number;
  left: number;
  size: number;
}

interface DotSpot {
  top: number;
  left: number;
  size: number;
}

const GARDEN_ELEPHANTS: ElephantSpot[] = [
  { top: 0.04, left: 0.06, size: 46, rotate: '-8deg' },
  { top: 0.13, left: 0.64, size: 36, rotate: '10deg' },
  { top: 0.28, left: 0.3, size: 52, rotate: '-4deg' },
  { top: 0.44, left: 0.74, size: 40, rotate: '7deg' },
  { top: 0.58, left: 0.08, size: 42, rotate: '-11deg' },
  { top: 0.72, left: 0.5, size: 48, rotate: '5deg' },
  { top: 0.86, left: 0.18, size: 38, rotate: '-6deg' },
  { top: 0.92, left: 0.68, size: 34, rotate: '9deg' },
];

const GARDEN_STARS: StarSpot[] = [
  { top: 0.09, left: 0.42, size: 14 },
  { top: 0.21, left: 0.87, size: 10 },
  { top: 0.36, left: 0.1, size: 12 },
  { top: 0.52, left: 0.88, size: 11 },
  { top: 0.66, left: 0.3, size: 13 },
  { top: 0.8, left: 0.72, size: 10 },
  { top: 0.95, left: 0.4, size: 12 },
];

const DREAM_ELEPHANTS: ElephantSpot[] = [
  { top: 0.08, left: 0.14, size: 44, rotate: '-6deg' },
  { top: 0.24, left: 0.66, size: 34, rotate: '8deg' },
  { top: 0.42, left: 0.36, size: 58, rotate: '0deg' },
  { top: 0.62, left: 0.7, size: 38, rotate: '-9deg' },
  { top: 0.78, left: 0.12, size: 40, rotate: '6deg' },
  { top: 0.94, left: 0.56, size: 36, rotate: '-4deg' },
];

const DREAM_DOTS: DotSpot[] = [
  { top: 0.03, left: 0.6, size: 10 },
  { top: 0.16, left: 0.85, size: 16 },
  { top: 0.32, left: 0.08, size: 8 },
  { top: 0.5, left: 0.9, size: 12 },
  { top: 0.58, left: 0.3, size: 8 },
  { top: 0.7, left: 0.86, size: 18 },
  { top: 0.86, left: 0.4, size: 10 },
  { top: 0.98, left: 0.82, size: 8 },
];

const STAR_PATH = 'M12 1.5 L14.7 8.8 L22.5 9.3 L16.3 14 L18.6 21.5 L12 17 L5.4 21.5 L7.7 14 L1.5 9.3 L9.3 8.8 Z';

function Star({ size, color }: { size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={STAR_PATH} fill={color} />
    </Svg>
  );
}

function Dot({ size, color }: { size: number; color: string }) {
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color }} />;
}

export type IllustratedVariant = 'garden' | 'dream';

interface IllustratedPatternProps {
  accent: string;
  variant: IllustratedVariant;
}

/** Scattered elephant doodle pattern used behind content for illustrated premium themes. */
export function IllustratedPattern({ accent, variant }: IllustratedPatternProps) {
  const { width, height } = useWindowDimensions();
  const elephants = variant === 'dream' ? DREAM_ELEPHANTS : GARDEN_ELEPHANTS;

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.wrap]}>
      {elephants.map((spot, index) => (
        <View
          key={`elephant-${index}`}
          style={[
            styles.item,
            { top: spot.top * height, left: spot.left * width, transform: [{ rotate: spot.rotate }] },
          ]}
        >
          <ElephantMascot size={spot.size} />
        </View>
      ))}
      {variant === 'dream'
        ? DREAM_DOTS.map((spot, index) => (
            <View key={`dot-${index}`} style={[styles.item, { top: spot.top * height, left: spot.left * width }]}>
              <Dot size={spot.size} color={accent} />
            </View>
          ))
        : GARDEN_STARS.map((spot, index) => (
            <View key={`star-${index}`} style={[styles.item, { top: spot.top * height, left: spot.left * width }]}>
              <Star size={spot.size} color={accent} />
            </View>
          ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    opacity: 0.4,
  },
  item: {
    position: 'absolute',
  },
});
