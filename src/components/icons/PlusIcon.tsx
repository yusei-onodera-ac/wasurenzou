import { Rect, Svg } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function PlusIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={10.5} y={4} width={3} height={16} rx={1.5} fill={color} />
      <Rect x={4} y={10.5} width={16} height={3} rx={1.5} fill={color} />
    </Svg>
  );
}
