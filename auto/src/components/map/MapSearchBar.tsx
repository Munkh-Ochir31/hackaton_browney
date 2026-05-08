import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { THEME } from '../../theme';

type MapSearchBarProps = {
  onPress: () => void;
};

export function MapSearchBar({ onPress }: MapSearchBarProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.container}>
      <Ionicons color={THEME.colors.textMuted} name="search-outline" size={20} />
      <View style={styles.copy}>
        <Text style={styles.placeholder} numberOfLines={1}>
          Хаана очих вэ? Зогсоол хайх...
        </Text>
      </View>
      <View style={styles.micButton}>
        <Ionicons color={THEME.colors.primary} name="mic-outline" size={19} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...THEME.shadow.card,
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.pill,
    flexDirection: 'row',
    height: 48,
    paddingLeft: THEME.spacing.md,
    paddingRight: THEME.spacing.xs,
  },
  copy: {
    flex: 1,
    marginHorizontal: THEME.spacing.xs,
  },
  micButton: {
    alignItems: 'center',
    borderRadius: THEME.radius.pill,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  placeholder: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
  },
});
