import type { MoodId } from '../components/icons/MoodIcon';

/** 0 = Sunday ... 6 = Saturday, matches `Date#getDay()`. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Bubble {
  id: string;
  mood: MoodId;
  text: string | null;
  color: string;
  createdAt: number;
  lastReinforcedAt: number;
  reinforceCount: number;
  dueDate: number | null;
  /** Weekdays this task repeats on, or null if it doesn't repeat. */
  repeatDays: Weekday[] | null;
}

export type NewBubbleInput = Pick<Bubble, 'mood' | 'text' | 'color' | 'dueDate' | 'repeatDays'>;
