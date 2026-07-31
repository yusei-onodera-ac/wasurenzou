import { Circle, Ellipse, Path, Svg } from 'react-native-svg';

interface ElephantMascotProps {
  size?: number;
}

export function ElephantMascot({ size = 96 }: ElephantMascotProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {/* ears */}
      <Ellipse cx={22} cy={46} rx={14} ry={17} fill="#E4D9F5" stroke="#D3C2ED" strokeWidth={1.5} />
      <Ellipse cx={78} cy={46} rx={14} ry={17} fill="#E4D9F5" stroke="#D3C2ED" strokeWidth={1.5} />
      <Ellipse cx={22} cy={46} rx={7} ry={10} fill="#F3ECFB" />
      <Ellipse cx={78} cy={46} rx={7} ry={10} fill="#F3ECFB" />
      {/* legs */}
      <Path d="M38 78 L36 92 M50 80 L50 93 M62 78 L64 92" stroke="#C9B8E8" strokeWidth={6} strokeLinecap="round" />
      {/* body */}
      <Ellipse cx={50} cy={62} rx={26} ry={22} fill="#EDE4FA" stroke="#D3C2ED" strokeWidth={1.5} />
      {/* head */}
      <Circle cx={50} cy={34} r={22} fill="#EDE4FA" stroke="#D3C2ED" strokeWidth={1.5} />
      {/* trunk */}
      <Path
        d="M46 42 Q42 58 46 68 Q48 74 54 72 Q58 70 55 65"
        stroke="#D3C2ED"
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
      />
      {/* cheeks */}
      <Circle cx={38} cy={40} r={4} fill="#FBD7E4" opacity={0.8} />
      <Circle cx={62} cy={40} r={4} fill="#FBD7E4" opacity={0.8} />
      {/* eyes */}
      <Circle cx={41} cy={30} r={3.4} fill="#4A4458" />
      <Circle cx={59} cy={30} r={3.4} fill="#4A4458" />
      <Circle cx={42} cy={28.6} r={1.1} fill="#FFFFFF" />
      <Circle cx={60} cy={28.6} r={1.1} fill="#FFFFFF" />
      {/* tusks */}
      <Path d="M40 48 Q37 52 39 55" stroke="#FFF7EC" strokeWidth={3} strokeLinecap="round" fill="none" />
      <Path d="M60 48 Q63 52 61 55" stroke="#FFF7EC" strokeWidth={3} strokeLinecap="round" fill="none" />
    </Svg>
  );
}
