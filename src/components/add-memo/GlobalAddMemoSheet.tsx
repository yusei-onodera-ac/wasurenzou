import { useCallback } from 'react';
import { useRouter } from 'expo-router';

import { useBubbleStore } from '../../store/useBubbleStore';
import { useAddMemoSheetStore } from '../../store/useAddMemoSheetStore';
import { useEntitlementStore } from '../../store/useEntitlementStore';
import { canAddBubble } from '../../services/limits';
import { triggerHaptic } from '../../services/haptics/haptics';
import { playSound } from '../../services/sound/soundService';
import { AddMemoSheet, type AddMemoInput } from './AddMemoSheet';

export function GlobalAddMemoSheet() {
  const router = useRouter();
  const isVisible = useAddMemoSheetStore((state) => state.isVisible);
  const close = useAddMemoSheetStore((state) => state.close);
  const bubbles = useBubbleStore((state) => state.bubbles);
  const addBubble = useBubbleStore((state) => state.addBubble);
  const isPremium = useEntitlementStore((state) => state.isPremium);

  const handleSave = useCallback(
    (input: AddMemoInput) => {
      if (!canAddBubble(bubbles.length, isPremium)) {
        close();
        router.push('/paywall');
        return;
      }
      triggerHaptic('addBubble');
      playSound('add');
      addBubble(input);
    },
    [addBubble, bubbles.length, isPremium, close, router]
  );

  return <AddMemoSheet visible={isVisible} onClose={close} onSave={handleSave} />;
}
