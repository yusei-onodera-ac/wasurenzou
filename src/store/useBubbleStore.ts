import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Bubble, NewBubbleInput, Weekday } from '../types/bubble';
import { generateId } from '../utils/id';
import { cancelDecayWarnings, scheduleDecayWarnings } from '../services/notifications/notificationService';
import { useTaskHistoryStore } from './useTaskHistoryStore';

export const BUBBLE_STORAGE_KEY = 'wasureru-memo.bubbles.v2';

const DAY_MS = 24 * 60 * 60 * 1000;

interface PendingBubble {
  bubble: Bubble;
  /** Local-midnight timestamp of the day this bubble should reappear. */
  showAt: number;
}

function startOfDay(timestamp: number): Date {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date;
}

/** First timestamp strictly after `fromTimestamp` whose weekday is in `repeatDays`. */
function getNextOccurrence(fromTimestamp: number, repeatDays: Weekday[]): number {
  const base = startOfDay(fromTimestamp);
  for (let offset = 1; offset <= 7; offset += 1) {
    const candidate = new Date(base);
    candidate.setDate(base.getDate() + offset);
    if (repeatDays.includes(candidate.getDay() as Weekday)) {
      return candidate.getTime();
    }
  }
  const fallback = new Date(base);
  fallback.setDate(base.getDate() + 1);
  return fallback.getTime();
}

function buildRespawn(bubble: Bubble): PendingBubble | null {
  const repeatDays = bubble.repeatDays;
  if (!repeatDays || repeatDays.length === 0) return null;

  const now = Date.now();
  const showAt = getNextOccurrence(now, repeatDays);
  const dueDateShift = bubble.dueDate !== null ? showAt - startOfDay(now).getTime() : 0;

  return {
    showAt,
    bubble: {
      id: generateId(),
      mood: bubble.mood,
      text: bubble.text,
      color: bubble.color,
      createdAt: showAt,
      lastReinforcedAt: showAt,
      reinforceCount: 0,
      dueDate: bubble.dueDate !== null ? bubble.dueDate + dueDateShift : null,
      repeatDays,
    },
  };
}

interface BubbleState {
  bubbles: Bubble[];
  pending: PendingBubble[];
  addBubble: (input: NewBubbleInput) => Bubble;
  reinforceBubble: (id: string) => void;
  completeBubble: (id: string) => void;
  deleteBubble: (id: string) => void;
  moveBubble: (id: string, direction: 'up' | 'down') => void;
  stashForgotten: (id: string) => Bubble | undefined;
  commitForgotten: (bubble: Bubble) => void;
  reviveStashed: (bubble: Bubble) => void;
  /** Promote any pending repeats whose scheduled day has arrived into the active list. */
  activatePending: () => void;
}

export const useBubbleStore = create<BubbleState>()(
  persist(
    (set, get) => ({
      bubbles: [],
      pending: [],
      addBubble: (input) => {
        const now = Date.now();
        const bubble: Bubble = {
          id: generateId(),
          mood: input.mood,
          text: input.text,
          color: input.color,
          createdAt: now,
          lastReinforcedAt: now,
          reinforceCount: 0,
          dueDate: input.dueDate,
          repeatDays: input.repeatDays,
        };
        set({ bubbles: [...get().bubbles, bubble] });
        scheduleDecayWarnings(bubble).catch(() => {});
        return bubble;
      },
      reinforceBubble: (id) => {
        let reinforced: Bubble | undefined;
        set({
          bubbles: get().bubbles.map((bubble) => {
            if (bubble.id !== id) return bubble;
            reinforced = { ...bubble, lastReinforcedAt: Date.now(), reinforceCount: bubble.reinforceCount + 1 };
            return reinforced;
          }),
        });
        if (reinforced) {
          scheduleDecayWarnings(reinforced).catch(() => {});
        }
      },
      completeBubble: (id) => {
        const bubble = get().bubbles.find((item) => item.id === id);
        if (!bubble) return;

        useTaskHistoryStore.getState().addEntry({
          text: bubble.text,
          mood: bubble.mood,
          color: bubble.color,
          outcome: 'completed',
          resolvedAt: Date.now(),
        });

        const respawn = buildRespawn(bubble);
        set({
          bubbles: get().bubbles.filter((item) => item.id !== id),
          pending: respawn ? [...get().pending, respawn] : get().pending,
        });
        cancelDecayWarnings(id).catch(() => {});
      },
      stashForgotten: (id) => {
        const bubble = get().bubbles.find((item) => item.id === id);
        if (!bubble) return undefined;

        set({ bubbles: get().bubbles.filter((item) => item.id !== id) });
        cancelDecayWarnings(id).catch(() => {});
        return bubble;
      },
      commitForgotten: (bubble) => {
        useTaskHistoryStore.getState().addEntry({
          text: bubble.text,
          mood: bubble.mood,
          color: bubble.color,
          outcome: 'forgotten',
          resolvedAt: Date.now(),
        });

        const respawn = buildRespawn(bubble);
        if (respawn) {
          set({ pending: [...get().pending, respawn] });
        }
      },
      reviveStashed: (bubble) => {
        const revived: Bubble = { ...bubble, lastReinforcedAt: Date.now(), reinforceCount: bubble.reinforceCount + 1 };
        set({ bubbles: [...get().bubbles, revived] });
        scheduleDecayWarnings(revived).catch(() => {});
      },
      deleteBubble: (id) => {
        set({ bubbles: get().bubbles.filter((bubble) => bubble.id !== id) });
        cancelDecayWarnings(id).catch(() => {});
      },
      moveBubble: (id, direction) => {
        const bubbles = get().bubbles;
        const index = bubbles.findIndex((bubble) => bubble.id === id);
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (index === -1 || targetIndex < 0 || targetIndex >= bubbles.length) return;

        const next = [...bubbles];
        [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
        set({ bubbles: next });
      },
      activatePending: () => {
        const now = Date.now();
        const { pending, bubbles } = get();
        const ready = pending.filter((item) => item.showAt <= now);
        if (ready.length === 0) return;

        const stillPending = pending.filter((item) => item.showAt > now);
        const activated = ready.map((item) => ({ ...item.bubble, createdAt: now, lastReinforcedAt: now }));
        set({ bubbles: [...bubbles, ...activated], pending: stillPending });
        activated.forEach((bubble) => {
          scheduleDecayWarnings(bubble).catch(() => {});
        });
      },
    }),
    {
      name: BUBBLE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const ALL_WEEKDAYS: Weekday[] = [0, 1, 2, 3, 4, 5, 6];
export const WEEKDAY_WEEKDAYS: Weekday[] = [1, 2, 3, 4, 5];
export const WEEKEND_WEEKDAYS: Weekday[] = [0, 6];
