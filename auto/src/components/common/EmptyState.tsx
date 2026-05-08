import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { THEME } from '../../theme';
import type { IoniconName } from '../../types';

type EmptyStateProps = {
  icon?: IoniconName;
  title: string;
  message?: string;
};

export function EmptyState({ icon = 'checkmark-circle-outline', title, message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons color={THEME.colors.primary} name={icon} size={34} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.xxl,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: THEME.colors.softGreen,
    borderRadius: THEME.radius.xl,
    height: 56,
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
    width: 56,
  },
  message: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    lineHeight: 18,
    marginTop: THEME.spacing.xs,
    textAlign: 'center',
  },
  title: {
    ...THEME.typography.h3,
    color: THEME.colors.textPrimary,
    textAlign: 'center',
  },
});
