import type { MoodId } from '../components/icons/MoodIcon';

export interface Bubble {
  id: string;
  mood: MoodId;
  text: string | null;
  color: string;
  createdAt: number;
  lastReinforcedAt: number;
  reinforceCount: number;
  dueDate: number | null;
  repeatDaily: boolean;
}

export type NewBubbleInput = Pick<Bubble, 'mood' | 'text' | 'color' | 'dueDate' | 'repeatDaily'>;
