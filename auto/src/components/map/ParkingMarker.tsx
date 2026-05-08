import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { THEME } from '../../theme';
import type { OccupancyLevel, ParkingSpot } from '../../types';

type ParkingMarkerProps = {
  parking: ParkingSpot;
  isSelected: boolean;
  onPress: (parking: ParkingSpot) => void;
};

export function getOccupancyLevel(parking: ParkingSpot): OccupancyLevel {
  const freeRatio = parking.available / parking.total;

  if (freeRatio > 0.5) {
    return 'available';
  }

  if (freeRatio >= 0.2) {
    return 'filling';
  }

  return 'full';
}

export function ParkingMarker({ parking, isSelected, onPress }: ParkingMarkerProps) {
  const scale = useSharedValue(1);
  const occupancyLevel = getOccupancyLevel(parking);

  useEffect(() => {
    scale.value = withSpring(isSelected ? 1.3 : 1, {
      damping: 14,
      stiffness: 300,
    });
  }, [isSelected, scale]);

  const selectedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Marker
      coordinate={{ latitude: parking.lat, longitude: parking.lng }}
      onPress={() => onPress(parking)}
      zIndex={isSelected ? 20 : 10}
    >
      <Animated.View style={[styles.marker, markerStyles[occupancyLevel], selectedStyle]}>
        <Text style={styles.count} numberOfLines={1}>
          {parking.available}
        </Text>
      </Animated.View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  count: {
    color: THEME.colors.bgCard,
    fontSize: 12,
    fontWeight: '800',
  },
  marker: {
    alignItems: 'center',
    borderColor: THEME.colors.bgCard,
    borderRadius: 22,
    borderWidth: 3,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
});

const markerStyles = StyleSheet.create({
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
