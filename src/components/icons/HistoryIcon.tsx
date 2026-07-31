import { Circle, Path, Svg } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function HistoryIcon({ size = 22, color = '#4A4458' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={13} r={8} stroke={color} strokeWidth={1.8} fill="none" />
      <Path d="M12 9 V13 L15 15" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Path d="M8 3 L5 5.5 M16 3 L19 5.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
