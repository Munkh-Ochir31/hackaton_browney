import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '../../theme';
import type { TrafficLevel } from '../../types';

type TrafficBadgeProps = {
  level: TrafficLevel;
};

const labels: Record<TrafficLevel, string> = {
  severe: 'Хүнд',
  moderate: 'Хэвийн',
  clear: 'Саадгүй',
};

export function TrafficBadge({ level }: TrafficBadgeProps) {
  return (
    <View style={[styles.badge, badgeStyles[level]]}>
      <Text style={[styles.text, textStyles[level]]}>{labels[level]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: THEME.radius.pill,
    minHeight: 26,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xxs,
  },
  text: {
    ...THEME.typography.caption,
    fontWeight: '700',
  },
});

const badgeStyles = StyleSheet.create({
  clear: {
    backgroundColor: THEME.colors.softGreen,
  },
  moderate: {
    backgroundColor: THEME.colors.softYellow,
  },
  severe: {
    backgroundColor: THEME.colors.softRed,
  },
});

const textStyles = StyleSheet.create({
  clear: {
    color: THEME.colors.safe,
  },
  moderate: {
    color: THEME.colors.warning,
  },
  severe: {
    color: THEME.colors.danger,
  },
});
