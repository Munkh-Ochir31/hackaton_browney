import React, { useEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
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
  const destination = useRouteStore((state) => state.destination);
  const activeRoute = useRouteStore((state) => state.activeRoute);
  const isLoading = useRouteStore((state) => state.isLoading);
  const setDestination = useRouteStore((state) => state.setDestination);
  const loadRoute = useRouteStore((state) => state.loadRoute);
  const startNavigation = useRouteStore((state) => state.startNavigation);

  const requestedDestination: SearchResult = useMemo(
    () => route.params?.destination ?? PARKING_SPOTS[0],
    [route.params?.destination],
  );

  useEffect(() => {
    setDestination(requestedDestination);
    loadRoute(CURRENT_LOCATION, requestedDestination);
  }, [loadRoute, requestedDestination, setDestination]);

  const dynamicStyles = useMemo(
    () =>
      StyleSheet.create({
        backButton: {
          top: insets.top + THEME.spacing.sm,
        },
      }),
    [insets.top],
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.mapMock}>
        <View style={styles.routeLineMuted} />
        <View style={styles.routeLine} />
        <View style={styles.originPin}>
          <Ionicons color={THEME.colors.bgCard} name="navigate" size={18} />
        </View>
        <View style={styles.destinationPin}>
          <Ionicons color={THEME.colors.bgCard} name="flag" size={18} />
        </View>
        <TouchableOpacity
          activeOpacity={0.82}
          onPress={() => navigation.goBack()}
          style={[styles.backButton, dynamicStyles.backButton]}
        >
          <Ionicons color={THEME.colors.textPrimary} name="chevron-back" size={24} />
        </TouchableOpacity>
        <View style={styles.infoWrap}>
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
          <View>
            <SkeletonLoader style={styles.stepSkeleton} />
            <SkeletonLoader style={styles.stepSkeleton} />
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
          <EmptyState icon="map-outline" title="Маршрут олдсонгүй" />
        )}
      </View>

      {activeRoute ? (
        <TouchableOpacity activeOpacity={0.9} onPress={startNavigation} style={styles.navButton}>
          <Text style={styles.navButtonText}>Навигац эхлүүлэх</Text>
        </TouchableOpacity>
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
  destinationPin: {
    alignItems: 'center',
    backgroundColor: THEME.colors.danger,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    position: 'absolute',
    right: '22%',
    top: '28%',
    width: 40,
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
  infoWrap: {
    left: THEME.spacing.md,
    position: 'absolute',
    right: THEME.spacing.md,
    top: 72,
  },
  mapMock: {
    backgroundColor: THEME.colors.bgBase,
    flex: 55,
    overflow: 'hidden',
  },
  navButton: {
    ...THEME.shadow.card,
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    bottom: THEME.spacing.md,
    height: 52,
    justifyContent: 'center',
    left: THEME.spacing.lg,
    position: 'absolute',
    right: THEME.spacing.lg,
  },
  navButtonText: {
    ...THEME.typography.h3,
    color: THEME.colors.bgCard,
  },
  originPin: {
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    left: '20%',
    position: 'absolute',
    top: '62%',
    width: 40,
  },
  panelTitle: {
    ...THEME.typography.h1,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  routeLine: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.pill,
    height: 8,
    left: '23%',
    position: 'absolute',
    top: '49%',
    transform: [{ rotate: '-24deg' }],
    width: '56%',
  },
  routeLineMuted: {
    backgroundColor: THEME.colors.border,
    borderRadius: THEME.radius.pill,
    height: 12,
    left: '20%',
    position: 'absolute',
    top: '48%',
    transform: [{ rotate: '-24deg' }],
    width: '62%',
  },
  stepSkeleton: {
    height: 56,
    marginBottom: THEME.spacing.sm,
  },
  stepsContent: {
    paddingBottom: 86,
  },
});
