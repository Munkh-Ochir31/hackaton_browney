import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { THEME } from '../../theme';
import type { IoniconName, ParkingSpot, PlaceCategory, SearchResult } from '../../types';

type SearchResultItemProps = {
  result: SearchResult;
  query: string;
  distanceLabel: string;
  isRecent?: boolean;
  onPress: (result: SearchResult) => void;
  onRemove?: (id: string) => void;
};

const categoryIcons: Record<PlaceCategory, IoniconName> = {
  airport: 'airplane-outline',
  education: 'school-outline',
  food: 'restaurant-outline',
  hospital: 'medkit-outline',
  landmark: 'location-outline',
  parking: 'business-outline',
  shop: 'storefront-outline',
};

function isParking(result: SearchResult): result is ParkingSpot {
  return 'total' in result;
}

function getCategory(result: SearchResult): PlaceCategory {
  return isParking(result) ? 'parking' : result.category;
}

function HighlightedName({ name, query }: { name: string; query: string }) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return <Text style={styles.resultName}>{name}</Text>;
  }

  const index = name.toLowerCase().indexOf(normalized);

  if (index < 0) {
    return <Text style={styles.resultName}>{name}</Text>;
  }

  const before = name.slice(0, index);
  const match = name.slice(index, index + normalized.length);
  const after = name.slice(index + normalized.length);

  return (
    <Text style={styles.resultName}>
      {before}
      <Text style={styles.highlight}>{match}</Text>
      {after}
    </Text>
  );
}

export function SearchResultItem({
  result,
  query,
  distanceLabel,
  isRecent,
  onPress,
  onRemove,
}: SearchResultItemProps) {
  const category = getCategory(result);
  const iconName = isRecent ? 'time-outline' : categoryIcons[category];

  return (
    <TouchableOpacity activeOpacity={0.78} onPress={() => onPress(result)} style={styles.row}>
      <View style={[styles.iconWrap, categoryStyles[category]]}>
        <Ionicons color={THEME.colors.primaryDark} name={iconName} size={21} />
      </View>
      <View style={styles.copy}>
        <HighlightedName name={result.name} query={query} />
        <Text style={styles.address} numberOfLines={1}>
          {result.district} · {result.address}
        </Text>
      </View>
      <Text style={styles.distance}>{distanceLabel}</Text>
      {onRemove ? (
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.7}
          onPress={() => onRemove(result.id)}
          style={styles.removeButton}
        >
          <Ionicons color={THEME.colors.textMuted} name="close" size={18} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  address: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    marginTop: THEME.spacing.xxs,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  distance: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    fontWeight: '700',
    marginLeft: THEME.spacing.xs,
  },
  highlight: {
    color: THEME.colors.textPrimary,
    fontWeight: '800',
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: 22,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  removeButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginLeft: THEME.spacing.xs,
    width: 32,
  },
  resultName: {
    ...THEME.typography.h3,
    color: THEME.colors.textPrimary,
  },
  row: {
    alignItems: 'center',
    backgroundColor: THEME.colors.bgCard,
    borderRadius: THEME.radius.md,
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginBottom: THEME.spacing.xs,
    minHeight: 68,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
  },
});

const categoryStyles = StyleSheet.create({
  airport: {
    backgroundColor: '#EAF1FF',
  },
  education: {
    backgroundColor: '#EEF2FF',
  },
  food: {
    backgroundColor: '#FFF1E6',
  },
  hospital: {
    backgroundColor: THEME.colors.softRed,
  },
  landmark: {
    backgroundColor: THEME.colors.softGreen,
  },
  parking: {
    backgroundColor: THEME.colors.softGreen,
  },
  shop: {
    backgroundColor: THEME.colors.softYellow,
  },
});
