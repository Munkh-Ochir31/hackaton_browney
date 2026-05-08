import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type SkeletonLoaderProps = {
  style?: StyleProp<ViewStyle>;
};

export function SkeletonLoader({ style }: SkeletonLoaderProps) {
  const progress = useSharedValue(-120);

  useEffect(() => {
    progress.value = withRepeat(withTiming(260, { duration: 1500 }), -1, false);
  }, [progress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value }],
  }));

  return (
    <View style={[styles.base, style]}>
      <Animated.View style={[styles.shimmer, shimmerStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#DDE5EF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  shimmer: {
    backgroundColor: 'rgba(255,255,255,0.52)',
    height: '100%',
    position: 'absolute',
    width: 90,
  },
});
