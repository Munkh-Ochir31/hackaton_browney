import React, { useEffect } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { StatusPill } from '../common/StatusPill';
import { OccupancyBar } from './OccupancyBar';
import { THEME } from '../../theme';
import type { ParkingSpot } from '../../types';

type ParkingBottomSheetProps = {
  parking: ParkingSpot | null;
  distanceLabel: string;
  onClose: () => void;
  onRoute: (parking: ParkingSpot) => void;
};

function formatMnt(value: number) {
  return `₮${value.toLocaleString('en-US')}/цаг`;
}

export function ParkingBottomSheet({
  parking,
  distanceLabel,
  onClose,
  onRoute,
}: ParkingBottomSheetProps) {
  const translateY = useSharedValue(320);
  const dragStart = useSharedValue(0);

  useEffect(() => {
    translateY.value = withSpring(parking ? 0 : 320, {
      damping: 30,
      stiffness: 300,
    });
  }, [parking, translateY]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      dragStart.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, dragStart.value + event.translationY);
    })
    .onEnd(() => {
      if (translateY.value > 90) {
        translateY.value = withSpring(320, { damping: 30, stiffness: 300 }, () => runOnJS(onClose)());
        return;
      }

      translateY.value = withSpring(0, { damping: 30, stiffness: 300 });
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!parking) {
    return null;
  }

  return (
    <View style={styles.layer} pointerEvents="box-none">
      <Pressable accessibilityRole="button" onPress={onClose} style={styles.dismissArea} />
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <View style={styles.titleWrap}>
              <Text style={styles.title} numberOfLines={1}>
                {parking.name}
              </Text>
              <Text style={styles.titleCaption}>{parking.nameEn}</Text>
            </View>
            <StatusPill label={parking.isOpen ? 'Нээлттэй' : 'Хаалттай'} tone={parking.isOpen ? 'safe' : 'danger'} />
          </View>

          <View style={styles.priceRow}>
            <Ionicons color={THEME.colors.primary} name="time-outline" size={18} />
            <Text style={styles.price}>{formatMnt(parking.pricePerHour)}</Text>
          </View>

          <OccupancyBar parking={parking} />

          <ScrollView
            contentContainerStyle={styles.chips}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {parking.amenities.map((amenity) => (
              <View key={amenity} style={styles.chip}>
                <Text style={styles.chipText}>{amenity}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.addressRow}>
            <View style={styles.addressItem}>
              <Ionicons color={THEME.colors.textMuted} name="location-outline" size={17} />
              <Text style={styles.addressText} numberOfLines={2}>
                {parking.district}, {parking.address}
              </Text>
            </View>
            <View style={styles.distanceItem}>
              <Ionicons color={THEME.colors.textMuted} name="walk-outline" size={17} />
              <Text style={styles.distanceText}>{distanceLabel}</Text>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity activeOpacity={0.82} style={styles.infoButton}>
              <Text style={styles.infoButtonText}>Мэдээлэл</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              disabled={!parking.isOpen || parking.available === 0}
              onPress={() => onRoute(parking)}
              style={[styles.routeButton, (!parking.isOpen || parking.available === 0) && styles.routeButtonDisabled]}
            >
              <Ionicons color={THEME.colors.bgCard} name="navigate-outline" size={18} />
              <Text style={styles.routeButtonText}>Маршрут</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  addressItem: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginRight: THEME.spacing.sm,
  },
  addressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: THEME.spacing.md,
  },
  addressText: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    flex: 1,
    lineHeight: 16,
    marginLeft: THEME.spacing.xxs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.lg,
  },
  chip: {
    backgroundColor: THEME.colors.bgBase,
    borderRadius: THEME.radius.pill,
    marginRight: THEME.spacing.xs,
    minHeight: 30,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
  },
  chipText: {
    ...THEME.typography.caption,
    color: THEME.colors.textPrimary,
    fontWeight: '600',
  },
  chips: {
    paddingTop: THEME.spacing.md,
  },
  dismissArea: {
    bottom: 260,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  distanceItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  distanceText: {
    ...THEME.typography.caption,
    color: THEME.colors.textPrimary,
    fontWeight: '700',
    marginLeft: THEME.spacing.xxs,
  },
  handle: {
    alignSelf: 'center',
    backgroundColor: THEME.colors.border,
    borderRadius: THEME.radius.pill,
    height: 4,
    marginBottom: THEME.spacing.md,
    width: 42,
  },
  headerRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  infoButton: {
    alignItems: 'center',
    borderColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },
  infoButtonText: {
    ...THEME.typography.h3,
    color: THEME.colors.primaryDark,
  },
  layer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  price: {
    ...THEME.typography.h3,
    color: THEME.colors.textPrimary,
    marginLeft: THEME.spacing.xs,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: THEME.spacing.md,
  },
  routeButton: {
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    flex: 1,
    flexDirection: 'row',
    height: 48,
    justifyContent: 'center',
  },
  routeButtonDisabled: {
    backgroundColor: THEME.colors.navInactive,
  },
  routeButtonText: {
    ...THEME.typography.h3,
    color: THEME.colors.bgCard,
    marginLeft: THEME.spacing.xs,
  },
  sheet: {
    ...THEME.shadow.card,
    backgroundColor: THEME.colors.bgCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    left: 0,
    paddingBottom: THEME.spacing.xl,
    paddingHorizontal: THEME.spacing.lg,
    paddingTop: THEME.spacing.sm,
    position: 'absolute',
    right: 0,
  },
  title: {
    ...THEME.typography.h2,
    color: THEME.colors.textPrimary,
  },
  titleCaption: {
    ...THEME.typography.caption,
    color: THEME.colors.textMuted,
    marginTop: THEME.spacing.xxs,
  },
  titleWrap: {
    flex: 1,
  },
});
