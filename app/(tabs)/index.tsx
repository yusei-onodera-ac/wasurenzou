import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { MemoList } from '../../src/components/memo/MemoList';
import { SwipeTabWrapper } from '../../src/components/navigation/SwipeTabWrapper';
import { useThemeColors } from '../../src/theme/useThemeColors';

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SwipeTabWrapper onSwipeLeft={() => router.push('/settings')} onSwipeRight={() => router.push('/history')}>
        <MemoList />
      </SwipeTabWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
