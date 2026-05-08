import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/common/EmptyState';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { MapSearchBar } from '../components/map/MapSearchBar';
import { OccupancyBar } from '../components/parking/OccupancyBar';
import { TRAFFIC_SEGMENTS } from '../data/mockData';
import { getParkingSpots } from '../services/parkingService';
import { useMapStore } from '../store/mapStore';
import { THEME } from '../theme';
import type { ParkingSpot, RootStackParamList, TrafficLevel } from '../types';

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

const trafficColors: Record<TrafficLevel, string> = {
  clear: THEME.colors.safe,
  moderate: THEME.colors.warning,
  severe: THEME.colors.danger,
};

function markerColor(parking: ParkingSpot) {
  const freeRatio = parking.available / parking.total;

  if (freeRatio > 0.5) {
    return THEME.colors.safe;
  }

  if (freeRatio >= 0.2) {
    return THEME.colors.warning;
  }

  return THEME.colors.danger;
}

export function MapScreen() {
  const navigation = useNavigation<RootNavigation>();
  const insets = useSafeAreaInsets();
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedParking = useMapStore((state) => state.selectedParking);
  const selectParking = useMapStore((state) => state.selectParking);
  const closeBottomSheet = useMapStore((state) => state.closeBottomSheet);

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        searchOverlay: {
          top: insets.top + THEME.spacing.sm,
        },
      }),
    [insets.top],
  );

  useEffect(() => {
    let mounted = true;

    getParkingSpots(800).then((spots) => {
      if (mounted) {
        setParkingSpots(spots);
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.mapMock}>
        <View style={styles.gridLayer} />
        {TRAFFIC_SEGMENTS.slice(0, 8).map((segment, index) => (
          <View
            key={segment.id}
            style={[
              styles.roadLine,
              {
                backgroundColor: trafficColors[segment.level],
                left: `${8 + index * 9}%`,
                top: `${18 + (index % 5) * 14}%`,
                transform: [{ rotate: index % 2 === 0 ? '-16deg' : '18deg' }],
                width: `${34 + (index % 3) * 10}%`,
              },
            ]}
          />
        ))}

        {isLoading ? (
          <View style={styles.loadingCard}>
            <SkeletonLoader style={styles.skeletonTitle} />
            <SkeletonLoader style={styles.skeletonLine} />
          </View>
        ) : parkingSpots.length > 0 ? (
          parkingSpots.map((parking, index) => (
            <TouchableOpacity
              activeOpacity={0.82}
              key={parking.id}
              onPress={() => selectParking(parking)}
              style={[
                styles.marker,
                {
                  backgroundColor: markerColor(parking),
                  left: `${12 + (index % 5) * 17}%`,
                  top: `${22 + Math.floor(index / 5) * 34}%`,
                },
                selectedParking?.id === parking.id && styles.markerSelected,
              ]}
            >
              <Text style={styles.markerText}>{parking.available}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyWrap}>
            <EmptyState title="Зогсоолын мэдээлэл алга" />
          </View>
        )}
      </View>

      <View style={[styles.searchOverlay, dynamicStyles.searchOverlay]}>
        <MapSearchBar onPress={() => navigation.navigate('Search')} />
      </View>

      <View style={styles.fabStack}>
        <TouchableOpacity activeOpacity={0.82} style={styles.fab}>
          <Ionicons color={THEME.colors.textPrimary} name="locate-outline" size={23} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.82} style={styles.fab}>
          <Ionicons color={THEME.colors.textPrimary} name="filter-outline" size={23} />
        </TouchableOpacity>
      </View>

      {selectedParking ? (
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleWrap}>
              <Text style={styles.sheetTitle}>{selectedParking.name}</Text>
              <Text style={styles.sheetCaption}>{selectedParking.address}</Text>
            </View>
            <TouchableOpacity onPress={closeBottomSheet} style={styles.closeButton}>
              <Ionicons color={THEME.colors.textMuted} name="close" size={22} />
            </TouchableOpacity>
          </View>
          <OccupancyBar parking={selectedParking} />
          <ScrollView contentContainerStyle={styles.amenities} horizontal showsHorizontalScrollIndicator={false}>
            {selectedParking.amenities.map((amenity) => (
              <View key={amenity} style={styles.chip}>
                <Text style={styles.chipText}>{amenity}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Route', { destination: selectedParking })}
            style={styles.routeButton}
          >
            <Text style={styles.routeButtonText}>Маршрут</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  amenities: {
    paddingTop: THEME.spacing.md,
  },
  chip: {
    backgroundColor: THEME.colors.bgBase,
    borderRadius: THEME.radius.pill,
    marginRight: THEME.spacing.xs,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
  },
  chipText: {
    ...THEME.typography.caption,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  closeButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  container: {
    backgroundColor: THEME.colors.bgBase,
    flex: 1,
  },
  emptyWrap: {
    left: THEME.spacing.md,
    position: 'absolute',
    right: THEME.spacing.md,
    top: 120,
  },
  fab: {
    ...THEME.shadow.card,
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  fabStack: {
    bottom: THEME.spacing.lg,
    gap: THEME.spacing.sm,
    position: 'absolute',
    right: THEME.spacing.md,
  },
  gridLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.colors.bgBase,
  },
  loadingCard: {
    ...THEME.shadow.card,
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    left: THEME.spacing.md,
    padding: THEME.spacing.md,
    position: 'absolute',
    right: THEME.spacing.md,
    top: 86,
  },
  mapMock: {
    flex: 1,
    overflow: 'hidden',
  },
  marker: {
    alignItems: 'center',
    borderColor: THEME.colors.bgCard,
    borderRadius: 22,
    borderWidth: 3,
    height: 44,
    justifyContent: 'center',
    position: 'absolute',
    width: 44,
  },
  markerSelected: {
    transform: [{ scale: 1.18 }],
  },
  markerText: {
    color: THEME.colors.bgCard,
    fontSize: 12,
    fontWeight: '900',
  },
  roadLine: {
    borderRadius: THEME.radius.pill,
    height: 7,
    opacity: 0.86,
    position: 'absolute',
  },
  routeButton: {
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    height: 48,
    justifyContent: 'center',
    marginTop: THEME.spacing.lg,
  },
  routeButtonText: {
    ...THEME.typography.h3,
    color: THEME.colors.bgCard,
  },
  searchOverlay: {
    left: THEME.spacing.md,
    position: 'absolute',
    right: THEME.spacing.md,
  },
  sheet: {
    ...THEME.shadow.card,
    backgroundColor: THEME.colors.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    left: 0,
    paddingBottom: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.sm,
    position: 'absolute',
    right: 0,
  },
  sheetCaption: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    marginTop: THEME.spacing.xxs,
  },
  sheetHandle: {
    alignSelf: 'center',
    backgroundColor: THEME.colors.border,
    borderRadius: THEME.radius.pill,
    height: 4,
    marginBottom: THEME.spacing.md,
    width: 42,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  sheetTitle: {
    ...THEME.typography.h2,
    color: THEME.colors.textPrimary,
  },
  sheetTitleWrap: {
    flex: 1,
  },
  skeletonLine: {
    height: 13,
    marginTop: THEME.spacing.sm,
    width: '70%',
  },
  skeletonTitle: {
    height: 18,
    width: '45%',
  },
});
