import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { THEME } from '../theme';

export function SettingsScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.card}>
        <View style={styles.iconWrap}>
          <Ionicons color={THEME.colors.primary} name="settings-outline" size={32} />
        </View>
        <Text style={styles.title}>Тохиргоо</Text>
        <Text style={styles.caption}>Мэдэгдэл, хэл болон байршлын тохиргоо тун удахгүй.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  caption: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    lineHeight: 19,
    marginTop: THEME.spacing.xs,
    textAlign: 'center',
  },
  card: {
    ...THEME.shadow.card,
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.lg,
    margin: THEME.spacing.md,
    padding: THEME.spacing.xl,
  },
  container: {
    backgroundColor: THEME.colors.bgBase,
    flex: 1,
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: THEME.colors.softGreen,
    borderRadius: THEME.radius.xl,
    height: 64,
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
    width: 64,
  },
  title: {
    ...THEME.typography.h1,
    color: THEME.colors.textPrimary,
  },
});
