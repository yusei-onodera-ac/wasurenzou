const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

export const MIN_DECAY_DURATION_MS = 6 * HOUR_MS;
export const DEFAULT_DECAY_DURATION_MS = 6 * HOUR_MS;

const QUIET_HOUR_START = 22;
const QUIET_HOUR_END = 7;

const MIN_OPACITY = 0;
const MIN_SCALE = 0.3;

/**
 * The disappearing window is a third of the time left until the deadline
 * (never below MIN_DECAY_DURATION_MS), so urgency naturally rises as a
 * due date approaches. Tasks without a due date get a fixed 6h window.
 */
export function computeFullDecayDuration(dueDate: number | null, fromMs: number): number {
  if (dueDate === null) return DEFAULT_DECAY_DURATION_MS;
  const remaining = (dueDate - fromMs) / 3;
  return Math.max(remaining, MIN_DECAY_DURATION_MS);
}

function startOfDay(ms: number): number {
  const date = new Date(ms);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Elapsed time excluding the quiet window (22:00-07:00 local time), so
 * forgetting pauses overnight instead of progressing while the user sleeps.
 */
export function computeActiveElapsedMs(startMs: number, endMs: number): number {
  if (endMs <= startMs) return 0;

  let total = 0;
  let dayStart = startOfDay(startMs);

  while (dayStart < endMs) {
    const activeStart = dayStart + QUIET_HOUR_END * HOUR_MS;
    const activeEnd = dayStart + QUIET_HOUR_START * HOUR_MS;
    const overlapStart = Math.max(activeStart, startMs);
    const overlapEnd = Math.min(activeEnd, endMs);
    if (overlapEnd > overlapStart) {
      total += overlapEnd - overlapStart;
    }
    dayStart += DAY_MS;
  }

  return total;
}

/**
 * The wall-clock moment decay will complete, accounting for the overnight
 * pause — used to schedule notifications at the right real times.
 */
export function computeDecayCompletionTime(lastReinforcedAt: number, dueDate: number | null): number {
  const fullDecayMs = computeFullDecayDuration(dueDate, lastReinforcedAt);
  let remainingBudget = fullDecayMs;
  let dayStart = startOfDay(lastReinforcedAt);

  while (true) {
    const activeStart = dayStart + QUIET_HOUR_END * HOUR_MS;
    const activeEnd = dayStart + QUIET_HOUR_START * HOUR_MS;
    const windowStart = Math.max(activeStart, lastReinforcedAt);
    if (activeEnd > windowStart) {
      const available = activeEnd - windowStart;
      if (available >= remainingBudget) {
        return windowStart + remainingBudget;
      }
      remainingBudget -= available;
    }
    dayStart += DAY_MS;
  }
}

export function computeDecayProgress(lastReinforcedAt: number, now: number, dueDate: number | null): number {
  const fullDecayMs = computeFullDecayDuration(dueDate, lastReinforcedAt);
  if (fullDecayMs <= 0) return 1;
  const activeElapsed = computeActiveElapsedMs(lastReinforcedAt, now);
  return Math.min(Math.max(activeElapsed / fullDecayMs, 0), 1);
}

export function computeOpacity(progress: number): number {
  return 1 - progress * (1 - MIN_OPACITY);
}

export function computeScale(progress: number): number {
  return 1 - progress * (1 - MIN_SCALE);
}
