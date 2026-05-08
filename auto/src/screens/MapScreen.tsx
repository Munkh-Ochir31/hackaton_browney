import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/common/EmptyState';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { MapSearchBar } from '../components/map/MapSearchBar';
import { ParkingMarker } from '../components/map/ParkingMarker';
import { TrafficPolyline } from '../components/map/TrafficPolyline';
import { ParkingBottomSheet } from '../components/parking/ParkingBottomSheet';
import { CURRENT_LOCATION, TRAFFIC_SEGMENTS, UB_CENTER } from '../data/mockData';
import { getParkingSpots } from '../services/parkingService';
import { useMapStore } from '../store/mapStore';
import { THEME } from '../theme';
import type { LatLng, ParkingSpot, RootStackParamList } from '../types';

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

function distanceLabel(from: LatLng, parking: ParkingSpot) {
  const latitudeMeters = (parking.lat - from.latitude) * 111000;
  const longitudeMeters = (parking.lng - from.longitude) * 74000;
  const meters = Math.round(Math.sqrt(latitudeMeters * latitudeMeters + longitudeMeters * longitudeMeters));

  if (meters < 1000) {
    return `~${meters}м`;
  }

  return `~${(meters / 1000).toFixed(1)}км`;
}

export function MapScreen() {
  const navigation = useNavigation<RootNavigation>();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const selectedParking = useMapStore((state) => state.selectedParking);
  const isBottomSheetOpen = useMapStore((state) => state.isBottomSheetOpen);
  const selectParking = useMapStore((state) => state.selectParking);
  const closeBottomSheet = useMapStore((state) => state.closeBottomSheet);
  const setRegion = useMapStore((state) => state.setRegion);

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        emptyWrap: {
          top: insets.top + 76,
        },
        fabStack: {
          bottom: THEME.spacing.lg,
        },
        searchOverlay: {
          top: insets.top + THEME.spacing.sm,
        },
      }),
    [insets.top],
  );

  useEffect(() => {
    let active = true;

    getParkingSpots(800).then((spots) => {
      if (active) {
        setParkingSpots(spots);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const selectedDistance = useMemo(() => {
    if (!selectedParking) {
      return '';
    }

    return distanceLabel(CURRENT_LOCATION, selectedParking);
  }, [selectedParking]);

  const handleRegionChange = (region: Region) => {
    setRegion(region);
  };

  const handleMyLocation = () => {
    mapRef.current?.animateToRegion(
      {
        ...CURRENT_LOCATION,
        latitudeDelta: 0.018,
        longitudeDelta: 0.018,
      },
      500,
    );
  };

  const handleRoute = (parking: ParkingSpot) => {
    closeBottomSheet();
    navigation.navigate('Route', { destination: parking });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <MapView
        initialRegion={UB_CENTER}
        mapType="standard"
        onRegionChangeComplete={handleRegionChange}
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        showsCompass={false}
        showsMyLocationButton={false}
        showsUserLocation
        style={styles.map}
      >
        <Marker coordinate={CURRENT_LOCATION} />

        {!isLoading
          ? TRAFFIC_SEGMENTS.map((segment) => <TrafficPolyline key={segment.id} segment={segment} />)
          : null}

        {!isLoading
          ? parkingSpots.map((parking) => (
              <ParkingMarker
                isSelected={selectedParking?.id === parking.id}
                key={parking.id}
                onPress={selectParking}
                parking={parking}
              />
            ))
          : null}
      </MapView>

      <View style={[styles.searchOverlay, dynamicStyles.searchOverlay]}>
        <MapSearchBar onPress={() => navigation.navigate('Search')} />
      </View>

      {isLoading ? (
        <View style={[styles.skeletonCard, dynamicStyles.emptyWrap]}>
          <SkeletonLoader style={styles.skeletonTitle} />
          <SkeletonLoader style={styles.skeletonLine} />
          <SkeletonLoader style={styles.skeletonShortLine} />
        </View>
      ) : null}

      {!isLoading && parkingSpots.length === 0 ? (
        <View style={[styles.emptyCard, dynamicStyles.emptyWrap]}>
          <EmptyState
            icon="car-outline"
            message="Дахин ачааллах үед mock service шинэ өгөгдөл буцаана."
            title="Зогсоолын мэдээлэл алга"
          />
        </View>
      ) : null}

      <View style={[styles.fabStack, dynamicStyles.fabStack]}>
        <TouchableOpacity activeOpacity={0.82} onPress={handleMyLocation} style={styles.fab}>
          <Ionicons color={THEME.colors.textPrimary} name="locate-outline" size={23} />
        </TouchableOpacity>
        <Pressable accessibilityRole="button" style={styles.fab}>
          <Ionicons color={THEME.colors.textPrimary} name="filter-outline" size={23} />
        </Pressable>
      </View>

      {isBottomSheetOpen ? (
        <ParkingBottomSheet
          distanceLabel={selectedDistance}
          onClose={closeBottomSheet}
          onRoute={handleRoute}
          parking={selectedParking}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.bgBase,
    flex: 1,
  },
  emptyCard: {
    left: THEME.spacing.md,
    position: 'absolute',
    right: THEME.spacing.md,
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
    gap: THEME.spacing.sm,
    position: 'absolute',
    right: THEME.spacing.md,
  },
  map: {
    flex: 1,
  },
  searchOverlay: {
    left: THEME.spacing.md,
    position: 'absolute',
    right: THEME.spacing.md,
  },
  skeletonCard: {
    ...THEME.shadow.card,
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    left: THEME.spacing.md,
    padding: THEME.spacing.md,
    position: 'absolute',
    right: THEME.spacing.md,
  },
  skeletonLine: {
    height: 13,
    marginTop: THEME.spacing.sm,
    width: '86%',
  },
  skeletonShortLine: {
    height: 13,
    marginTop: THEME.spacing.xs,
    width: '54%',
  },
  skeletonTitle: {
    height: 18,
    width: '45%',
  },
});
