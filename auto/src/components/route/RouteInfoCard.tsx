  import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { StatusPill } from '../common/StatusPill';
import { THEME } from '../../theme';
import type { RouteData, SearchResult, TrafficLevel } from '../../types';

type RouteInfoCardProps = {
  destination: SearchResult;
  routeData: RouteData;
};

const trafficLabels: Record<TrafficLevel, string> = {
  severe: '🔴 Түгжрэлтэй',
  moderate: '🟡 Хэвийн',
  clear: '🟢 Саадгүй',
};

const trafficTones = {
  severe: 'danger',
  moderate: 'warning',
  clear: 'safe',
} as const;

export function RouteInfoCard({ destination, routeData }: RouteInfoCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.caption}>Очих газар</Text>
      <Text style={styles.title} numberOfLines={1}>
        {destination.name}
      </Text>
      <View style={styles.metaRow}>
        <View style={styles.badge}>
          <Ionicons color={THEME.colors.primary} name="time-outline" size={16} />
          <Text style={styles.badgeText}>{routeData.totalTime}</Text>
        </View>
        <View style={styles.badge}>
          <Ionicons color={THEME.colors.primary} name="navigate-outline" size={16} />
          <Text style={styles.badgeText}>{routeData.totalDistance}</Text>
        </View>
        <StatusPill
          label={trafficLabels[routeData.trafficLevel]}
          tone={trafficTones[routeData.trafficLevel]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: THEME.radius.pill,
    flexDirection: 'row',
    minHeight: 28,
    paddingHorizontal: THEME.spacing.sm,
  },
  badgeText: {
    ...THEME.typography.caption,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    marginLeft: THEME.spacing.xxs,
  },
  caption: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  card: {
    ...THEME.shadow.card,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderColor: 'rgba(255,255,255,0.72)',
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    padding: THEME.spacing.md,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.xs,
    marginTop: THEME.spacing.sm,
  },
  title: {
    ...THEME.typography.h2,
    color: THEME.colors.textPrimary,
    marginTop: THEME.spacing.xxs,
  },
});
