import { Circle, Rect, Svg } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

const TOOTH_ANGLES = [0, 60, 120, 180, 240, 300];

export function GearIcon({ size = 24, color = '#4A4458' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {TOOTH_ANGLES.map((angle) => (
        <Rect key={angle} x={11} y={1} width={2} height={4} rx={1} fill={color} transform={`rotate(${angle} 12 12)`} />
      ))}
      <Circle cx={12} cy={12} r={7} stroke={color} strokeWidth={1.8} fill="none" />
      <Circle cx={12} cy={12} r={2.4} stroke={color} strokeWidth={1.8} fill="none" />
    </Svg>
  );
}
