const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseDateInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = DATE_INPUT_PATTERN.exec(trimmed);
  if (!match) return null;
  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (Number.isNaN(date.getTime())) return null;
  return date.getTime();
}

export function formatShortDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export interface RemainingTime {
  unit: 'days' | 'hours' | 'minutes';
  count: number;
}

export function computeRemainingTime(ms: number): RemainingTime {
  const clamped = Math.max(ms, 0);
  const minutes = Math.round(clamped / 60000);
  if (minutes >= 60 * 24) {
    return { unit: 'days', count: Math.max(Math.round(minutes / (60 * 24)), 1) };
  }
  if (minutes >= 60) {
    return { unit: 'hours', count: Math.max(Math.round(minutes / 60), 1) };
  }
  return { unit: 'minutes', count: Math.max(minutes, 0) };
}

export function formatDateKey(timestamp: number): string {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
