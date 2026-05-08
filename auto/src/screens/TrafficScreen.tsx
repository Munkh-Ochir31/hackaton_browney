import React, { useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '../components/common/EmptyState';
import { SkeletonLoader } from '../components/common/SkeletonLoader';
import { TrafficCard } from '../components/traffic/TrafficCard';
import { useTrafficStore } from '../store/trafficStore';
import { THEME } from '../theme';
import type { TrafficFilter, TrafficLevel } from '../types';

const filters: { key: TrafficFilter; label: string }[] = [
  { key: 'all', label: 'Бүгд' },
  { key: 'severe', label: 'Хүнд' },
  { key: 'moderate', label: 'Хэвийн' },
  { key: 'clear', label: 'Саадгүй' },
];

export function TrafficScreen() {
  const opacity = useSharedValue(0.3);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const segments = useTrafficStore((state) => state.segments);
  const activeFilter = useTrafficStore((state) => state.activeFilter);
  const isRefreshing = useTrafficStore((state) => state.isRefreshing);
  const setFilter = useTrafficStore((state) => state.setFilter);
  const refresh = useTrafficStore((state) => state.refresh);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    const timer = setTimeout(() => setIsInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, [opacity]);

  const liveDotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const counts = useMemo(() => {
    const initial: Record<TrafficLevel, number> = { clear: 0, moderate: 0, severe: 0 };

    return segments.reduce((acc, segment) => {
      acc[segment.level] += 1;
      return acc;
    }, initial);
  }, [segments]);

  const filteredSegments = useMemo(
    () =>
      activeFilter === 'all'
        ? segments
        : segments.filter((segment) => segment.level === activeFilter),
    [activeFilter, segments],
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Замын нөхцөл</Text>
          <Text style={styles.subtitle}>Улаанбаатар хот</Text>
        </View>
        <View style={styles.liveWrap}>
          <Animated.View style={[styles.liveDot, liveDotStyle]} />
          <Text style={styles.liveText}>Шууд</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            onRefresh={refresh}
            refreshing={isRefreshing}
            tintColor={THEME.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsBar}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>🔴 {counts.severe}</Text>
            <Text style={styles.statLabel}>Хүнд түгжрэл</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>🟡 {counts.moderate}</Text>
            <Text style={styles.statLabel}>Хэвийн нөхцөл</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>🟢 {counts.clear}</Text>
            <Text style={styles.statLabel}>Саадгүй зам</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.filters}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.key;
            return (
              <TouchableOpacity
                activeOpacity={0.78}
                key={filter.key}
                onPress={() => setFilter(filter.key)}
                style={styles.filterButton}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter.label}
                </Text>
                {isActive ? <View style={styles.filterUnderline} /> : null}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {isInitialLoading ? (
          <View>
            <SkeletonLoader style={styles.cardSkeleton} />
            <SkeletonLoader style={styles.cardSkeleton} />
            <SkeletonLoader style={styles.cardSkeleton} />
          </View>
        ) : filteredSegments.length > 0 ? (
          filteredSegments.map((segment) => <TrafficCard key={segment.id} segment={segment} />)
        ) : (
          <EmptyState title="Энэ ангилалд мэдээлэл байхгүй байна" />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cardSkeleton: {
    height: 104,
    marginBottom: THEME.spacing.sm,
  },
  container: {
    backgroundColor: THEME.colors.bgBase,
    flex: 1,
  },
  content: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  filterButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginRight: THEME.spacing.lg,
  },
  filterText: {
    ...THEME.typography.h3,
    color: THEME.colors.textMuted,
  },
  filterTextActive: {
    color: THEME.colors.primaryDark,
  },
  filterUnderline: {
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.pill,
    bottom: 0,
    height: 3,
    position: 'absolute',
    width: '100%',
  },
  filters: {
    paddingBottom: THEME.spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
  },
  liveDot: {
    backgroundColor: THEME.colors.danger,
    borderRadius: 5,
    height: 10,
    marginRight: THEME.spacing.xs,
    width: 10,
  },
  liveText: {
    ...THEME.typography.caption,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  liveWrap: {
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.pill,
    flexDirection: 'row',
    minHeight: 34,
    paddingHorizontal: THEME.spacing.sm,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    marginTop: THEME.spacing.xxs,
  },
  statNumber: {
    ...THEME.typography.body,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
  },
  statsBar: {
    ...THEME.shadow.card,
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    flexDirection: 'row',
    marginBottom: THEME.spacing.md,
    padding: THEME.spacing.md,
  },
  subtitle: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    marginTop: THEME.spacing.xxs,
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.textPrimary,
  },
});
