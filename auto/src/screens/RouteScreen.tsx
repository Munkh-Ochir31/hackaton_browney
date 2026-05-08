import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/common/EmptyState';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { RouteInfoCard } from '../components/route/RouteInfoCard';
import { RouteStepItem } from '../components/route/RouteStepItem';
import { CURRENT_LOCATION, PARKING_SPOTS } from '../data/mockData';
import { useRouteStore } from '../store/routeStore';
import { THEME } from '../theme';
import type { RootStackParamList, SearchResult } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Route'>;

export function RouteScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);
  const pulse = useSharedValue(0.7);
  const destination = useRouteStore((state) => state.destination);
  const activeRoute = useRouteStore((state) => state.activeRoute);
  const isLoading = useRouteStore((state) => state.isLoading);
  const setDestination = useRouteStore((state) => state.setDestination);
  const loadRoute = useRouteStore((state) => state.loadRoute);
  const startNavigation = useRouteStore((state) => state.startNavigation);
  const fallbackDestination = PARKING_SPOTS[0];

  const requestedDestination: SearchResult = useMemo(
    () => route.params?.destination ?? fallbackDestination,
    [fallbackDestination, route.params?.destination],
  );

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        backButton: {
          top: insets.top + THEME.spacing.sm,
        },
        infoCard: {
          top: insets.top + 62,
        },
        navButtonWrap: {
          bottom: Math.max(insets.bottom, THEME.spacing.md),
        },
      }),
    [insets.bottom, insets.top],
  );

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
  }, [pulse]);

  useEffect(() => {
    setDestination(requestedDestination);
    loadRoute(CURRENT_LOCATION, requestedDestination);
  }, [loadRoute, requestedDestination, setDestination]);

  useEffect(() => {
    if (!mapReady || !activeRoute) {
      return;
    }

    const timer = setTimeout(() => {
      mapRef.current?.fitToCoordinates(activeRoute.polylineCoords, {
        animated: true,
        edgePadding: {
          bottom: 80,
          left: 48,
          right: 48,
          top: 160,
        },
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [activeRoute, mapReady]);

  const navButtonStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
  }));

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.mapPanel}>
        <MapView
          initialRegion={{
            latitude: requestedDestination.lat,
            latitudeDelta: 0.035,
            longitude: requestedDestination.lng,
            longitudeDelta: 0.035,
          }}
          onMapReady={() => setMapReady(true)}
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          showsCompass={false}
          showsMyLocationButton={false}
          style={styles.map}
        >
          {activeRoute ? (
            <Polyline
              coordinates={activeRoute.polylineCoords}
              lineCap="round"
              lineJoin="round"
              strokeColor={THEME.colors.primary}
              strokeWidth={5}
            />
          ) : null}
          <Marker coordinate={CURRENT_LOCATION} />
          <Marker coordinate={{ latitude: requestedDestination.lat, longitude: requestedDestination.lng }} />
        </MapView>

        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => navigation.goBack()}
          style={[styles.backButton, dynamicStyles.backButton]}
        >
          <Ionicons color={THEME.colors.textPrimary} name="chevron-back" size={24} />
        </TouchableOpacity>

        <View style={[styles.infoCardWrap, dynamicStyles.infoCard]}>
          {isLoading ? (
            <View style={styles.infoSkeleton}>
              <SkeletonLoader style={styles.infoTitleSkeleton} />
              <SkeletonLoader style={styles.infoLineSkeleton} />
            </View>
          ) : activeRoute && destination ? (
            <RouteInfoCard destination={destination} routeData={activeRoute} />
          ) : null}
        </View>
      </View>

      <View style={styles.bottomPanel}>
        <Text style={styles.panelTitle}>Хэрхэн явах</Text>
        {isLoading ? (
          <View style={styles.stepsSkeletonWrap}>
            <SkeletonLoader style={styles.stepSkeleton} />
            <SkeletonLoader style={styles.stepSkeleton} />
            <SkeletonLoader style={styles.stepSkeletonShort} />
          </View>
        ) : activeRoute ? (
          <ScrollView contentContainerStyle={styles.stepsContent} showsVerticalScrollIndicator={false}>
            {activeRoute.steps.map((step, index) => (
              <RouteStepItem
                isLast={index === activeRoute.steps.length - 1}
                key={step.id}
                step={step}
              />
            ))}
          </ScrollView>
        ) : (
          <EmptyState
            icon="map-outline"
            message="Энэ чиглэлд одоогоор mock маршрут бэлэн биш байна."
            title="Маршрут олдсонгүй"
          />
        )}
      </View>

      {activeRoute ? (
        <Animated.View style={[styles.navButtonWrap, dynamicStyles.navButtonWrap, navButtonStyle]}>
          <TouchableOpacity activeOpacity={0.9} onPress={startNavigation} style={styles.navButton}>
            <Ionicons color={THEME.colors.bgCard} name="play" size={20} />
            <Text style={styles.navButtonText}>Навигац эхлүүлэх</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    ...THEME.shadow.card,
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    left: THEME.spacing.md,
    position: 'absolute',
    width: 44,
  },
  bottomPanel: {
    backgroundColor: THEME.colors.bgCard,
    borderTopLeftRadius: THEME.radius.xl,
    borderTopRightRadius: THEME.radius.xl,
    flex: 45,
    marginTop: -THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.lg,
  },
  container: {
    backgroundColor: THEME.colors.bgCard,
    flex: 1,
  },
  infoCardWrap: {
    left: THEME.spacing.md,
    position: 'absolute',
    right: THEME.spacing.md,
  },
  infoLineSkeleton: {
    height: 13,
    marginTop: THEME.spacing.sm,
    width: '58%',
  },
  infoSkeleton: {
    ...THEME.shadow.card,
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.md,
  },
  infoTitleSkeleton: {
    height: 20,
    width: '80%',
  },
  map: {
    flex: 1,
  },
  mapPanel: {
    flex: 55,
  },
  navButton: {
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'center',
  },
  navButtonText: {
    ...THEME.typography.h3,
    color: THEME.colors.bgCard,
    marginLeft: THEME.spacing.xs,
  },
  navButtonWrap: {
    ...THEME.shadow.card,
    left: THEME.spacing.lg,
    position: 'absolute',
    right: THEME.spacing.lg,
  },
  panelTitle: {
    ...THEME.typography.h1,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  stepSkeleton: {
    height: 56,
    marginBottom: THEME.spacing.sm,
  },
  stepSkeletonShort: {
    height: 56,
    width: '72%',
  },
  stepsContent: {
    paddingBottom: 86,
  },
  stepsSkeletonWrap: {
    paddingTop: THEME.spacing.xs,
  },
});
