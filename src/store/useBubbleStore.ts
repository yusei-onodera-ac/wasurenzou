import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Bubble, NewBubbleInput } from '../types/bubble';
import { generateId } from '../utils/id';
import { cancelDecayWarnings, scheduleDecayWarnings } from '../services/notifications/notificationService';
import { useTaskHistoryStore } from './useTaskHistoryStore';

export const BUBBLE_STORAGE_KEY = 'wasureru-memo.bubbles.v1';

const DAY_MS = 24 * 60 * 60 * 1000;

function buildRespawn(bubble: Bubble): Bubble {
  const now = Date.now();
  return {
    id: generateId(),
    mood: bubble.mood,
    text: bubble.text,
    color: bubble.color,
    createdAt: now,
    lastReinforcedAt: now,
    reinforceCount: 0,
    dueDate: bubble.dueDate !== null ? bubble.dueDate + DAY_MS : null,
    repeatDaily: true,
  };
}

interface BubbleState {
  bubbles: Bubble[];
  addBubble: (input: NewBubbleInput) => Bubble;
  reinforceBubble: (id: string) => void;
  completeBubble: (id: string) => void;
  deleteBubble: (id: string) => void;
  moveBubble: (id: string, direction: 'up' | 'down') => void;
  stashForgotten: (id: string) => Bubble | undefined;
  commitForgotten: (bubble: Bubble) => void;
  reviveStashed: (bubble: Bubble) => void;
}

export const useBubbleStore = create<BubbleState>()(
  persist(
    (set, get) => ({
      bubbles: [],
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
          repeatDaily: input.repeatDaily,
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

        const respawn = bubble.repeatDaily ? buildRespawn(bubble) : null;
        set({
          bubbles: get()
            .bubbles.filter((item) => item.id !== id)
            .concat(respawn ? [respawn] : []),
        });
        cancelDecayWarnings(id).catch(() => {});
        if (respawn) {
          scheduleDecayWarnings(respawn).catch(() => {});
        }
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

        if (bubble.repeatDaily) {
          const respawn = buildRespawn(bubble);
          set({ bubbles: [...get().bubbles, respawn] });
          scheduleDecayWarnings(respawn).catch(() => {});
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
    }),
    {
      name: BUBBLE_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
