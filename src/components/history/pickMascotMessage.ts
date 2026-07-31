interface MascotMessageInput {
  displayName: string;
  currentStreak: number;
  achievementRate: number;
  completedCount: number;
  forgottenCount: number;
}

export type MascotMessageKey =
  | 'noHistory'
  | 'greatStreak'
  | 'goodStreak'
  | 'highRate'
  | 'lowRate'
  | 'manyForgotten'
  | 'default';

export function pickMascotMessageKey({
  currentStreak,
  achievementRate,
  completedCount,
  forgottenCount,
}: MascotMessageInput): MascotMessageKey {
  const total = completedCount + forgottenCount;

  if (total === 0) return 'noHistory';
  if (currentStreak >= 7) return 'greatStreak';
  if (currentStreak >= 3) return 'goodStreak';
  if (achievementRate >= 80) return 'highRate';
  if (forgottenCount > completedCount && forgottenCount >= 3) return 'manyForgotten';
  if (achievementRate < 40) return 'lowRate';
  return 'default';
}
