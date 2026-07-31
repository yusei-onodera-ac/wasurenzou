import { Circle, Line, Path, Svg } from 'react-native-svg';

export type MoodId =
  | 'thought'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'sleepy'
  | 'idea'
  | 'done'
  | 'love'
  | 'anxious'
  | 'celebrate'
  | 'frustrated'
  | 'loved';

export const MOOD_IDS: MoodId[] = [
  'thought',
  'happy',
  'sad',
  'angry',
  'sleepy',
  'idea',
  'done',
  'love',
  'anxious',
  'celebrate',
  'frustrated',
  'loved',
];

export const DEFAULT_MOOD: MoodId = 'thought';

interface MoodIconProps {
  mood: MoodId;
  size?: number;
  color?: string;
}

const EYE_R = 1.3;
const STROKE = 1.8;

function EyesDots({ color }: { color: string }) {
  return (
    <>
      <Circle cx={8.5} cy={10} r={EYE_R} fill={color} />
      <Circle cx={15.5} cy={10} r={EYE_R} fill={color} />
    </>
  );
}

function MiniHeart({ cx, color }: { cx: number; color: string }) {
  return (
    <Path
      d={`M${cx} ${11.5} C ${cx - 2} ${9.5}, ${cx - 2} ${7.5}, ${cx} ${8.3} C ${cx + 2} ${7.5}, ${cx + 2} ${9.5}, ${cx} ${11.5} Z`}
      fill={color}
    />
  );
}

function renderFace(mood: MoodId, color: string) {
  switch (mood) {
    case 'thought':
      return (
        <>
          <EyesDots color={color} />
          <Line x1={9.5} y1={16} x2={14.5} y2={16} stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
        </>
      );
    case 'happy':
      return (
        <>
          <EyesDots color={color} />
          <Path d="M8 15 Q12 19 16 15" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
        </>
      );
    case 'sad':
      return (
        <>
          <EyesDots color={color} />
          <Path d="M8 17.5 Q12 13.5 16 17.5" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
          <Path d="M17.5 12 Q18.5 13.5 17.5 15 Q16.5 13.5 17.5 12 Z" fill={color} opacity={0.7} />
        </>
      );
    case 'angry':
      return (
        <>
          <Line x1={6.5} y1={7.5} x2={10} y2={9} stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
          <Line x1={17.5} y1={7.5} x2={14} y2={9} stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
          <EyesDots color={color} />
          <Path d="M9 16.5 L11 15.3 L13 16.7 L15 15.3" stroke={color} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      );
    case 'sleepy':
      return (
        <>
          <Path d="M6.5 10 Q8.5 7.8 10.5 10" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
          <Path d="M13.5 10 Q15.5 7.8 17.5 10" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
          <Circle cx={12} cy={16} r={1.1} fill={color} />
        </>
      );
    case 'anxious':
      return (
        <>
          <EyesDots color={color} />
          <Path d="M8 16 Q9.5 14.2 11 16 Q12.5 17.8 14 16 Q15.5 14.2 16 16" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
          <Path d="M18 5.5 Q19.3 7.5 18 9 Q16.7 7.5 18 5.5 Z" fill={color} opacity={0.7} />
        </>
      );
    case 'frustrated':
      return (
        <>
          <Line x1={7} y1={8} x2={10} y2={9.3} stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
          <Line x1={17} y1={8} x2={14} y2={9.3} stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
          <EyesDots color={color} />
          <Line x1={9.5} y1={16.5} x2={14.5} y2={16.5} stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
          <Line x1={3.5} y1={9} x2={2} y2={6.5} stroke={color} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
          <Line x1={20.5} y1={9} x2={22} y2={6.5} stroke={color} strokeWidth={1.4} strokeLinecap="round" opacity={0.6} />
        </>
      );
    case 'loved':
      return (
        <>
          <MiniHeart cx={8.5} color={color} />
          <MiniHeart cx={15.5} color={color} />
          <Path d="M8 15 Q12 19 16 15" stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none" />
        </>
      );
    default:
      return null;
  }
}

function renderSymbol(mood: MoodId, color: string) {
  switch (mood) {
    case 'idea':
      return (
        <>
          <Circle cx={12} cy={10} r={5} stroke={color} strokeWidth={STROKE} fill="none" />
          <Path d="M10 15 L10 18.5 L14 18.5 L14 15" stroke={color} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Line x1={10.3} y1={20} x2={13.7} y2={20} stroke={color} strokeWidth={STROKE} strokeLinecap="round" />
        </>
      );
    case 'done':
      return (
        <>
          <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={STROKE} fill="none" />
          <Path d="M8 12.5 L11 15.5 L16.5 9" stroke={color} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </>
      );
    case 'love':
      return (
        <Path
          d="M12 19.5 C 6.5 15.2, 3 11.8, 3 8 C3 5 5.3 3 8.2 3 C10.2 3 11.4 4.1 12 5.4 C12.6 4.1 13.8 3 15.8 3 C18.7 3 21 5 21 8 C21 11.8 17.5 15.2 12 19.5 Z"
          fill={color}
        />
      );
    case 'celebrate':
      return (
        <>
          <Path d="M12 3 L13 8 L18 6 L14.5 10 L20 11 L14.5 12.5 L18 17 L13 14.5 L12 20" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <Circle cx={5} cy={6} r={1.1} fill={color} />
          <Circle cx={4} cy={16} r={1.1} fill={color} />
          <Circle cx={19.5} cy={19} r={1.1} fill={color} />
        </>
      );
    default:
      return null;
  }
}

const SYMBOL_MOODS: MoodId[] = ['idea', 'done', 'love', 'celebrate'];

export function MoodIcon({ mood, size = 24, color = '#4A4458' }: MoodIconProps) {
  const isSymbol = SYMBOL_MOODS.includes(mood);
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {isSymbol ? renderSymbol(mood, color) : renderFace(mood, color)}
    </Svg>
  );
}
