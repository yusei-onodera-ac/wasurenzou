import type { MoodId } from '../components/icons/MoodIcon';

export type TaskOutcome = 'completed' | 'forgotten';

export interface HistoryEntry {
  id: string;
  text: string | null;
  mood: MoodId;
  color: string;
  outcome: TaskOutcome;
  resolvedAt: number;
}

export type NewHistoryEntry = Omit<HistoryEntry, 'id'>;
