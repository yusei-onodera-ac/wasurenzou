import { Path, Svg } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export function EditIcon({ size = 18, color = '#8A8296' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15.5 4.5 19.5 8.5 8.5 19.5 4 20l0.5-4.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M13.5 6.5 17.5 10.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}
