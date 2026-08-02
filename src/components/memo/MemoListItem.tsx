import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInDown,
  LinearTransition,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Circle, Defs, Ellipse, RadialGradient, Stop, Svg } from 'react-native-svg';

import { useBubbleStore } from '../../store/useBubbleStore';
import { useToastStore } from '../../store/useToastStore';
import { useForgottenQueueStore } from '../../store/useForgottenQueueStore';
import type { Bubble as BubbleModel } from '../../types/bubble';
import { triggerHaptic } from '../../services/haptics/haptics';
import { playSound } from '../../services/sound/soundService';
import { useBubbleDecay } from '../../hooks/useBubbleDecay';
import { computeDecayCompletionTime, computeDecayProgress } from '../../utils/decay';
import { computeRemainingTime, formatShortDate } from '../../utils/date';
import { lightenColor } from '../../utils/color';
import { colors } from '../../theme/colors';
import { MoodIcon } from '../icons/MoodIcon';
import { EditIcon } from '../icons/EditIcon';
import { ParticleBurst } from './ParticleBurst';
import { CelebrationOverlay } from './CelebrationOverlay';
import { DecayDots } from './DecayDots';
import { TapCallout } from './TapCallout';

const ICON_SIZE = 46;
const ICON_CENTER = ICON_SIZE / 2;
const SWIPE_DISMISS_THRESHOLD = 96;
const TAP_CALLOUT_THRESHOLD_MS = 30 * 60 * 1000;
const REORDER_ROW_HEIGHT = 78;
const REORDER_LONG_PRESS_MS = 350;

const AnimatedView = Animated.createAnimatedComponent(View);

interface MemoListItemProps {
  bubble: BubbleModel;
  now: number;
  showSwipeHint?: boolean;
}

export function MemoListItem({ bubble, now, showSwipeHint }: MemoListItemProps) {
  const { t } = useTranslation(['common', 'home']);
  const router = useRouter();
  const reinforceBubble = useBubbleStore((state) => state.reinforceBubble);
  const completeBubble = useBubbleStore((state) => state.completeBubble);
  const deleteBubble = useBubbleStore((state) => state.deleteBubble);
  const moveBubble = useBubbleStore((state) => state.moveBubble);
  const [burstVisible, setBurstVisible] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  const cardScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const dragStartX = useSharedValue(0);
  const rowOpacity = useSharedValue(1);
  const rowHeightScale = useSharedValue(1);
  const reviveRingProgress = useSharedValue(0);
  const dragTranslateY = useSharedValue(0);
  const reorderSteps = useSharedValue(0);
  const isReordering = useSharedValue(false);

  const handleForgotten = () => {
    const stashed = useBubbleStore.getState().stashForgotten(bubble.id);
    if (!stashed) return;
    const wasEmpty = useForgottenQueueStore.getState().queue.length === 0;
    useForgottenQueueStore.getState().enqueue(stashed);
    if (wasEmpty) {
      router.push('/forgotten');
    }
  };

  const { decayOpacity, decayProgress, pulseScale } = useBubbleDecay(
    bubble.lastReinforcedAt,
    now,
    bubble.dueDate,
    handleForgotten
  );

  const handleReinforce = () => {
    triggerHaptic('reinforce');
    playSound('tap');
    reinforceBubble(bubble.id);
  };

  const collapseAndRemove = (onRemoved: () => void) => {
    setBurstVisible(true);
    translateX.value = withTiming(400, { duration: 220 });
    rowOpacity.value = withTiming(0, { duration: 200 });
    rowHeightScale.value = withTiming(0, { duration: 220 }, (finished) => {
      if (finished) {
        runOnJS(onRemoved)();
      }
    });
  };

  const cancelSwipe = () => {
    translateX.value = withSpring(0);
  };

  const confirmComplete = () => {
    triggerHaptic('complete');
    playSound('celebration');
    useToastStore.getState().show(t('home:toast.completed'));
    setCelebrationVisible(true);
    setTimeout(() => {
      collapseAndRemove(() => completeBubble(bubble.id));
    }, 650);
  };

  const handleCompletePress = () => {
    Alert.alert(t('confirmComplete.title'), undefined, [
      { text: t('actions.back'), style: 'cancel', onPress: cancelSwipe },
      { text: t('actions.yes'), onPress: confirmComplete },
    ]);
  };

  const confirmDelete = () => {
    triggerHaptic('dismiss');
    playSound('delete');
    useToastStore.getState().show(t('home:toast.deleted'));
    collapseAndRemove(() => deleteBubble(bubble.id));
  };

  const handleDeletePress = () => {
    Alert.alert(t('confirmDelete.title'), t('confirmDelete.message'), [
      { text: t('actions.cancel'), style: 'cancel' },
      { text: t('actions.delete'), style: 'destructive', onPress: confirmDelete },
    ]);
  };

  const handleEditPress = () => {
    Alert.alert(t('editMenu.title'), undefined, [
      { text: t('actions.cancel'), style: 'cancel' },
      { text: t('actions.delete'), style: 'destructive', onPress: handleDeletePress },
      { text: t('actions.complete'), onPress: handleCompletePress },
    ]);
  };

  const handleMoveUp = () => moveBubble(bubble.id, 'up');
  const handleMoveDown = () => moveBubble(bubble.id, 'down');

  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      cardScale.value = withTiming(0.96, { duration: 70 });
    })
    .onEnd(() => {
      cardScale.value = withSequence(withSpring(1.03), withSpring(1));
      reviveRingProgress.value = 0;
      reviveRingProgress.value = withTiming(1, { duration: 550 });
      runOnJS(handleReinforce)();
    })
    .onFinalize(() => {
      cardScale.value = withSpring(1);
    });

  const panGesture = Gesture.Pan()
    .activeOffsetX([-1000, 10])
    .failOffsetY([-20, 20])
    .onStart(() => {
      dragStartX.value = translateX.value;
    })
    .onUpdate((event) => {
      translateX.value = Math.max(0, dragStartX.value + event.translationX);
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_DISMISS_THRESHOLD) {
        runOnJS(handleCompletePress)();
      } else {
        runOnJS(cancelSwipe)();
      }
    });

  const reorderGesture = Gesture.Pan()
    .activateAfterLongPress(REORDER_LONG_PRESS_MS)
    .onStart(() => {
      isReordering.value = true;
      reorderSteps.value = 0;
      cardScale.value = withTiming(1.04, { duration: 120 });
      runOnJS(triggerHaptic)('reinforce');
    })
    .onUpdate((event) => {
      const relative = event.translationY - reorderSteps.value * REORDER_ROW_HEIGHT;
      dragTranslateY.value = relative;
      if (relative > REORDER_ROW_HEIGHT * 0.6) {
        reorderSteps.value += 1;
        runOnJS(handleMoveDown)();
        runOnJS(triggerHaptic)('reinforce');
      } else if (relative < -REORDER_ROW_HEIGHT * 0.6) {
        reorderSteps.value -= 1;
        runOnJS(handleMoveUp)();
        runOnJS(triggerHaptic)('reinforce');
      }
    })
    .onEnd(() => {
      isReordering.value = false;
      dragTranslateY.value = withTiming(0);
      cardScale.value = withSpring(1);
    })
    .onFinalize(() => {
      isReordering.value = false;
      dragTranslateY.value = withTiming(0);
      cardScale.value = withSpring(1);
    });

  const composedGesture = Gesture.Race(reorderGesture, panGesture, tapGesture);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: dragTranslateY.value },
      { scale: cardScale.value * pulseScale.value },
    ],
    opacity: decayOpacity.value * rowOpacity.value,
    zIndex: isReordering.value ? 10 : 0,
  }));

  const wrapperAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: rowHeightScale.value }],
    marginBottom: 12 * rowHeightScale.value,
    zIndex: isReordering.value ? 10 : 0,
  }));

  const iconWobbleStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${(pulseScale.value - 1) * 120}deg` }],
  }));

  const reviveRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + reviveRingProgress.value * 0.8 }],
    opacity: (1 - reviveRingProgress.value) * 0.8,
  }));

  const gradientId = `memoIconGradient-${bubble.id}`;

  const currentProgress = computeDecayProgress(bubble.lastReinforcedAt, now, bubble.dueDate);
  const decayCompleteAt = computeDecayCompletionTime(bubble.lastReinforcedAt, bubble.dueDate);
  const remaining = computeRemainingTime(decayCompleteAt - now);
  const remainingLabel = t(`home:remaining.${remaining.unit}`, { count: remaining.count });
  const showTapCallout = now - bubble.lastReinforcedAt > TAP_CALLOUT_THRESHOLD_MS;

  return (
    <AnimatedView layout={LinearTransition.duration(220)}>
      <AnimatedView style={[styles.wrapper, wrapperAnimatedStyle]}>
      {showSwipeHint ? <Text style={[styles.swipeHint, { pointerEvents: 'none' }]}>{t('home:swipeHint')}</Text> : null}
      <Animated.View style={[styles.card, cardAnimatedStyle]}>
        <GestureDetector gesture={composedGesture}>
          <View style={styles.gestureZone}>
            {showTapCallout ? <TapCallout text={t('home:tapCallout')} /> : null}
            <View style={styles.iconWrap}>
              <Svg width={ICON_SIZE} height={ICON_SIZE}>
                <Defs>
                  <RadialGradient id={gradientId} cx="35%" cy="30%" r="75%">
                    <Stop offset="0%" stopColor={lightenColor(bubble.color, 0.5)} />
                    <Stop offset="100%" stopColor={bubble.color} />
                  </RadialGradient>
                </Defs>
                <Circle cx={ICON_CENTER} cy={ICON_CENTER} r={ICON_CENTER - 1} fill={`url(#${gradientId})`} />
                <Ellipse
                  cx={ICON_CENTER - ICON_CENTER * 0.28}
                  cy={ICON_CENTER - ICON_CENTER * 0.38}
                  rx={ICON_CENTER * 0.32}
                  ry={ICON_CENTER * 0.2}
                  fill="#FFFFFF"
                  opacity={0.4}
                />
              </Svg>
              <AnimatedView style={[styles.iconOverlay, iconWobbleStyle]}>
                <MoodIcon mood={bubble.mood} size={22} color="#4A4458" />
              </AnimatedView>
              <AnimatedView style={[styles.reviveRing, reviveRingStyle]} pointerEvents="none" />
            </View>

            <View style={styles.content}>
              <Text style={styles.text} numberOfLines={2}>
                {bubble.text ?? t('untitledTask')}
              </Text>
              {bubble.dueDate ? (
                <Text style={[styles.dueDate, bubble.dueDate < now && styles.dueDateOverdue]}>
                  {t('home:dueDateLabel', { date: formatShortDate(bubble.dueDate) })}
                </Text>
              ) : null}
              <Text
                style={[
                  styles.decayLabel,
                  currentProgress >= 0.75 && styles.decayLabelUrgent,
                  currentProgress >= 0.3 && currentProgress < 0.75 && styles.decayLabelFading,
                ]}
              >
                {remainingLabel}
              </Text>
              <DecayDots decayProgress={decayProgress} />
            </View>
          </View>
        </GestureDetector>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('actions.edit')}
            style={styles.actionButton}
            onPress={handleEditPress}
            hitSlop={8}
          >
            <EditIcon size={16} color="#8A8296" />
          </Pressable>
        </View>

        {burstVisible ? <ParticleBurst x="50%" y="50%" color={bubble.color} /> : null}
        {celebrationVisible ? <CelebrationOverlay text={t('home:celebration')} /> : null}
      </Animated.View>
      </AnimatedView>
    </AnimatedView>
  );
}

export function MemoListItemAnimated(props: MemoListItemProps) {
  return (
    <Animated.View entering={FadeInDown.springify().damping(14)}>
      <MemoListItem {...props} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  swipeHint: {
    alignSelf: 'flex-end',
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    marginRight: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 14,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(74, 68, 88, 0.06)',
    shadowColor: '#4A4458',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  gestureZone: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviveRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 2,
    borderColor: '#4CAF7D',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A4458',
  },
  dueDate: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A8296',
  },
  dueDateOverdue: {
    color: '#D14343',
  },
  decayLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A8296',
  },
  decayLabelFading: {
    color: '#B08A3E',
  },
  decayLabelUrgent: {
    color: '#D14343',
  },
  actions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4EEF9',
  },
});
