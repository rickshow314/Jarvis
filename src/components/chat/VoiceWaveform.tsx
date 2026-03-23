import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const BAR_COUNT = 5;
const BAR_COLOR = '#6C63FF';

interface Props {
  isActive: boolean;
}

export function VoiceWaveform({ isActive }: Props) {
  const heights = useRef(Array.from({ length: BAR_COUNT }, () => new Animated.Value(4))).current;

  useEffect(() => {
    if (isActive) {
      const animations = heights.map((h, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(h, { toValue: 24 + i * 4, duration: 250 + i * 60, useNativeDriver: false }),
            Animated.timing(h, { toValue: 4, duration: 250 + i * 60, useNativeDriver: false }),
          ])
        )
      );
      animations.forEach(a => a.start());
      return () => animations.forEach(a => a.stop());
    } else {
      heights.forEach(h => Animated.timing(h, { toValue: 4, duration: 200, useNativeDriver: false }).start());
    }
  }, [isActive]);

  return (
    <View style={styles.container}>
      {heights.map((h, i) => (
        <Animated.View key={i} style={[styles.bar, { height: h }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 40 },
  bar: { width: 4, borderRadius: 2, backgroundColor: BAR_COLOR },
});
