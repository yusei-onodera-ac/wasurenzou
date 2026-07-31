import { Path, Svg } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function ChevronDownIcon({ size = 14, color = '#8A8296' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 9l7 7 7-7" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
