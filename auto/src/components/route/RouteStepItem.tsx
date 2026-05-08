import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { THEME } from '../../theme';
import type { IoniconName, RouteDirection, RouteStep } from '../../types';

type RouteStepItemProps = {
  step: RouteStep;
  isLast: boolean;
};

const directionIcons: Record<RouteDirection, IoniconName> = {
  left: 'arrow-back-outline',
  right: 'arrow-forward-outline',
  straight: 'arrow-up-outline',
};

export function RouteStepItem({ step, isLast }: RouteStepItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.timeline}>
        <View style={styles.iconWrap}>
          <Ionicons color={THEME.colors.primary} name={directionIcons[step.direction]} size={21} />
        </View>
        {!isLast ? <View style={styles.line} /> : null}
      </View>
      <View style={styles.copy}>
        <Text style={styles.instruction}>
          {step.instruction} — {step.distance}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    flex: 1,
    paddingBottom: THEME.spacing.md,
    paddingTop: THEME.spacing.xs,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: THEME.colors.softGreen,
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  instruction: {
    ...THEME.typography.body,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
    lineHeight: 19,
  },
  line: {
    backgroundColor: THEME.colors.border,
    flex: 1,
    marginVertical: THEME.spacing.xs,
    width: 2,
  },
  row: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    minHeight: 72,
  },
  timeline: {
    alignItems: 'center',
  },
});
