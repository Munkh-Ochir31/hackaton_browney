import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { TrafficBadge } from './TrafficBadge';
import { THEME } from '../../theme';
import type { TrafficSegment } from '../../types';

type TrafficCardProps = {
  segment: TrafficSegment;
};

function timeAgo(reportedAt: Date) {
  const minutes = Math.max(1, Math.round((Date.now() - reportedAt.getTime()) / 60000));
  return `${minutes} минутын өмнө`;
}

export function TrafficCard({ segment }: TrafficCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.82} style={styles.card}>
      <View style={[styles.severityBar, severityStyles[segment.level]]} />
      <View style={styles.copy}>
        <Text style={styles.road}>{segment.road}</Text>
        <Text style={styles.segment} numberOfLines={2}>
          {segment.segment}
        </Text>
        <View style={styles.metaRow}>
          <TrafficBadge level={segment.level} />
          <View style={styles.delayChip}>
            <Ionicons color={THEME.colors.textPrimary} name="time-outline" size={14} />
            <Text style={styles.delayText}>+{segment.delayMinutes} мин</Text>
          </View>
          <Text style={styles.timeText}>{timeAgo(segment.reportedAt)}</Text>
        </View>
      </View>
      <Ionicons color={THEME.colors.textMuted} name="chevron-forward" size={20} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...THEME.shadow.card,
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    marginBottom: THEME.spacing.sm,
    minHeight: 104,
    overflow: 'hidden',
  },
  copy: {
    flex: 1,
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.md,
  },
  delayChip: {
    alignItems: 'center',
    backgroundColor: THEME.colors.bgBase,
    borderRadius: THEME.radius.pill,
    flexDirection: 'row',
    minHeight: 26,
    paddingHorizontal: THEME.spacing.xs,
  },
  delayText: {
    ...THEME.typography.caption,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    marginLeft: THEME.spacing.xxs,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.xs,
    marginTop: THEME.spacing.sm,
  },
  road: {
    ...THEME.typography.h3,
    color: THEME.colors.textPrimary,
  },
  segment: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    lineHeight: 18,
    marginTop: THEME.spacing.xxs,
  },
  severityBar: {
    alignSelf: 'stretch',
    width: 4,
  },
  timeText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
  },
});

const severityStyles = StyleSheet.create({
  clear: {
    backgroundColor: THEME.colors.safe,
  },
  moderate: {
    backgroundColor: THEME.colors.warning,
  },
  severe: {
    backgroundColor: THEME.colors.danger,
  },
});
