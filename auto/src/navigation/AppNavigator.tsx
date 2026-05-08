import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { THEME } from '../theme';
import type { IoniconName, MainTabParamList, RootStackParamList } from '../types';
import { MapScreen } from '../screens/MapScreen';
import { RouteScreen } from '../screens/RouteScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { TrafficScreen } from '../screens/TrafficScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, IoniconName> = {
  Map: 'map-outline',
  Traffic: 'car-outline',
  Parking: 'business-outline',
  Settings: 'settings-outline',
};

const TAB_ICONS_ACTIVE: Record<keyof MainTabParamList, IoniconName> = {
  Map: 'map',
  Traffic: 'car',
  Parking: 'business',
  Settings: 'settings',
};

const TAB_LABELS: Record<keyof MainTabParamList, string> = {
  Map: 'Газрын зураг',
  Traffic: 'Замын нөхцөл',
  Parking: 'Зогсоол',
  Settings: 'Тохиргоо',
};

function ParkingPlaceholderScreen() {
  return (
    <View style={styles.placeholderScreen}>
      <View style={styles.placeholderIcon}>
        <Ionicons color={THEME.colors.primary} name="business-outline" size={32} />
      </View>
      <Text style={styles.placeholderTitle}>Зогсоол</Text>
      <Text style={styles.placeholderText}>
        Дэлгэрэнгүй жагсаалт backend багийн өгөгдөлтэй холбогдох үед идэвхжинэ.
      </Text>
    </View>
  );
}

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: THEME.colors.navActive,
        tabBarInactiveTintColor: THEME.colors.navInactive,
        tabBarLabel: TAB_LABELS[route.name],
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 66 + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ],
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, focused }) => (
          <Ionicons
            color={color}
            name={focused ? TAB_ICONS_ACTIVE[route.name] : TAB_ICONS[route.name]}
            size={23}
          />
        ),
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Traffic" component={TrafficScreen} />
      <Tab.Screen name="Parking" component={ParkingPlaceholderScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Route"
        component={RouteScreen}
        options={{
          animation: 'slide_from_right',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholderIcon: {
    alignItems: 'center',
    backgroundColor: THEME.colors.softGreen,
    borderRadius: THEME.radius.xl,
    height: 64,
    justifyContent: 'center',
    marginBottom: THEME.spacing.md,
    width: 64,
  },
  placeholderScreen: {
    alignItems: 'center',
    backgroundColor: THEME.colors.bgBase,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
  placeholderText: {
    ...THEME.typography.body,
    color: THEME.colors.textMuted,
    lineHeight: 19,
    marginTop: THEME.spacing.xs,
    textAlign: 'center',
  },
  placeholderTitle: {
    ...THEME.typography.h1,
    color: THEME.colors.textPrimary,
  },
  tabBar: {
    backgroundColor: THEME.colors.navBg,
    borderTopColor: 'transparent',
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
});
