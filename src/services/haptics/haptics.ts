import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

type HapticEvent = 'reinforce' | 'dismiss' | 'addBubble' | 'purchase' | 'complete';

export function triggerHaptic(event: HapticEvent): void {
  if (Platform.OS === 'web') return;

  switch (event) {
    case 'reinforce':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'dismiss':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'addBubble':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'purchase':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'complete':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
  }
}
