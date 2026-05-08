import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { getOccupancyLevel } from '../map/ParkingMarker';
import { THEME } from '../../theme';
import type { ParkingSpot } from '../../types';

type OccupancyBarProps = {
  parking: ParkingSpot;
};

export function OccupancyBar({ parking }: OccupancyBarProps) {
  const fill = useSharedValue(0);
  const occupancyLevel = getOccupancyLevel(parking);
  const occupiedRatio = parking.total === 0 ? 0 : (parking.total - parking.available) / parking.total;

  useEffect(() => {
    fill.value = withTiming(Math.min(occupiedRatio, 1), { duration: 600 });
  }, [fill, occupiedRatio]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fill.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {parking.available}/{parking.total} зогсоол
        </Text>
        <Text style={statusTextStyles[occupancyLevel]}>
          {parking.available === 0 ? 'Бүрэн дүүрсэн' : `${Math.round(occupiedRatio * 100)}% дүүрсэн`}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, fillStyles[occupancyLevel], fillStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: THEME.spacing.md,
  },
  fill: {
    borderRadius: THEME.radius.pill,
    height: '100%',
  },
  label: {
    ...THEME.typography.body,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  labelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.xs,
  },
  track: {
    backgroundColor: THEME.colors.bgBase,
    borderRadius: THEME.radius.pill,
    height: 9,
    overflow: 'hidden',
  },
});

const fillStyles = StyleSheet.create({
  available: {
    backgroundColor: THEME.colors.safe,
  },
  filling: {
    backgroundColor: THEME.colors.warning,
  },
  full: {
    backgroundColor: THEME.colors.danger,
  },
});

const statusTextStyles = StyleSheet.create({
  available: {
    ...THEME.typography.caption,
    color: THEME.colors.safe,
    fontWeight: '700',
  },
  filling: {
    ...THEME.typography.caption,
    color: THEME.colors.warning,
    fontWeight: '700',
  },
  full: {
    ...THEME.typography.caption,
    color: THEME.colors.danger,
    fontWeight: '700',
  },
});
