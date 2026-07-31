import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS } from 'react-native-reanimated';

const SWIPE_NAV_THRESHOLD = 80;

interface SwipeTabWrapperProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function SwipeTabWrapper({ children, onSwipeLeft, onSwipeRight }: SwipeTabWrapperProps) {
  const panGesture = Gesture.Pan()
    .activeOffsetX([-SWIPE_NAV_THRESHOLD, SWIPE_NAV_THRESHOLD])
    .failOffsetY([-30, 30])
    .onEnd((event) => {
      if (event.translationX <= -SWIPE_NAV_THRESHOLD && onSwipeLeft) {
        runOnJS(onSwipeLeft)();
      } else if (event.translationX >= SWIPE_NAV_THRESHOLD && onSwipeRight) {
        runOnJS(onSwipeRight)();
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={styles.flex}>{children}</Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});
