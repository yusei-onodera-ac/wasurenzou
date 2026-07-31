import { useEffect, useRef } from 'react';
import { useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { computeDecayProgress, computeOpacity, computeScale } from '../utils/decay';

const DECAY_TRANSITION_DURATION_MS = 2000;
const PULSE_THRESHOLD = 0.75;
const PULSE_DURATION_MS = 420;
const PULSE_PEAK_SCALE = 1.08;

export function useBubbleDecay(
  lastReinforcedAt: number,
  now: number,
  dueDate: number | null,
  onFullyDecayed: () => void
) {
  const decayOpacity = useSharedValue(1);
  const decayScale = useSharedValue(1);
  const decayProgress = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const hasNotifiedDecay = useRef(false);
  const isPulsing = useRef(false);

  useEffect(() => {
    const progress = computeDecayProgress(lastReinforcedAt, now, dueDate);

    decayOpacity.value = withTiming(computeOpacity(progress), { duration: DECAY_TRANSITION_DURATION_MS });
    decayScale.value = withTiming(computeScale(progress), { duration: DECAY_TRANSITION_DURATION_MS });
    decayProgress.value = withTiming(progress, { duration: DECAY_TRANSITION_DURATION_MS });

    const shouldPulse = progress >= PULSE_THRESHOLD && progress < 1;
    if (shouldPulse && !isPulsing.current) {
      isPulsing.current = true;
      pulseScale.value = withRepeat(withTiming(PULSE_PEAK_SCALE, { duration: PULSE_DURATION_MS }), -1, true);
    } else if (!shouldPulse && isPulsing.current) {
      isPulsing.current = false;
      pulseScale.value = withTiming(1, { duration: 200 });
    }

    if (progress >= 1 && !hasNotifiedDecay.current) {
      hasNotifiedDecay.current = true;
      onFullyDecayed();
    } else if (progress < 1) {
      hasNotifiedDecay.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [now, lastReinforcedAt, dueDate]);

  return { decayOpacity, decayScale, decayProgress, pulseScale };
}
