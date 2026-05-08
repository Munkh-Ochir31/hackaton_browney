import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { THEME } from '../../theme';

export type StatusPillTone = 'safe' | 'warning' | 'danger' | 'neutral';

type StatusPillProps = {
  label: string;
  tone: StatusPillTone;
};

export function StatusPill({ label, tone }: StatusPillProps) {
  return (
    <View style={[styles.base, toneStyles[tone]]}>
      <View style={[styles.dot, dotStyles[tone]]} />
      <Text style={[styles.label, labelStyles[tone]]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: THEME.radius.pill,
    flexDirection: 'row',
    minHeight: 26,
    paddingHorizontal: THEME.spacing.sm,
  },
  dot: {
    borderRadius: 4,
    height: 8,
    marginRight: THEME.spacing.xs,
    width: 8,
  },
  label: {
    ...THEME.typography.caption,
    fontWeight: '700',
  },
});

const toneStyles = StyleSheet.create({
  danger: {
    backgroundColor: THEME.colors.softRed,
  },
  neutral: {
    backgroundColor: THEME.colors.bgBase,
  },
  safe: {
    backgroundColor: THEME.colors.softGreen,
  },
  warning: {
    backgroundColor: THEME.colors.softYellow,
  },
});

const dotStyles = StyleSheet.create({
  danger: {
    backgroundColor: THEME.colors.danger,
  },
  neutral: {
    backgroundColor: THEME.colors.textMuted,
  },
  safe: {
    backgroundColor: THEME.colors.safe,
  },
  warning: {
    backgroundColor: THEME.colors.warning,
  },
});

const labelStyles = StyleSheet.create({
  danger: {
    color: THEME.colors.danger,
  },
  neutral: {
    color: THEME.colors.textMuted,
  },
  safe: {
    color: THEME.colors.primaryDark,
  },
  warning: {
    color: THEME.colors.warning,
  },
});
