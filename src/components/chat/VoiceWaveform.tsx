import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const BAR_COUNT = 5;
const BAR_COLOR = '#6C63FF';

interface Props {
  isActive: boolean;
}

export function VoiceWaveform({ isActive }: Props) {
  const heights = Array.from({ length: BAR_COUNT }, () => useSharedValue(4));

  useEffect(() => {
    heights.forEach((h, i) => {
      if (isActive) {
        h.value = withRepeat(
          withSequence(
            withTiming(24 + Math.random() * 16, {
              duration: 250 + i * 60,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(4, { duration: 250 + i * 60, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          true,
        );
      } else {
        h.value = withTiming(4, { duration: 200 });
      }
    });
  }, [isActive]);

  return (
    <View style={styles.container}>
      {heights.map((h, i) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const style = useAnimatedStyle(() => ({ height: h.value }));
        return <Animated.View key={i} style={[styles.bar, style]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 40 },
  bar: { width: 4, borderRadius: 2, backgroundColor: BAR_COLOR },
});
