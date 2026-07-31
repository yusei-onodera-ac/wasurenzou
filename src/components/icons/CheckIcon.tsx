import { Path, Svg } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function CheckIcon({ size = 18, color = '#8A8296' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12.5 9.5 18 20 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
