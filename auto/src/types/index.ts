import type { ComponentProps } from 'react';
import type { Region } from 'react-native-maps';
import type { Ionicons } from '@expo/vector-icons';
import type { NavigatorScreenParams } from '@react-navigation/native';

export type TrafficLevel = 'severe' | 'moderate' | 'clear';
export type OccupancyLevel = 'available' | 'filling' | 'full';

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type MapRegion = LatLng & {
  latitudeDelta: number;
  longitudeDelta: number;
};

export type ParkingSpot = {
  id: string;
  name: string;
  nameEn: string;
  lat: number;
  lng: number;
  total: number;
  available: number;
  pricePerHour: number;
  district: string;
  address: string;
  isOpen: boolean;
  amenities: string[];
};

export type Place = {
  id: string;
  name: string;
  nameEn: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  address: string;
  district: string;
};

export type PlaceCategory = 'parking' | 'shop' | 'hospital' | 'food' | 'landmark' | 'education' | 'airport';

export type TrafficSegment = {
  id: string;
  road: string;
  segment: string;
  level: TrafficLevel;
  delayMinutes: number;
  coordinates: LatLng[];
  reportedAt: Date;
};

export type RouteDirection = 'left' | 'right' | 'straight';

export type RouteStep = {
  id: string;
  direction: RouteDirection;
  instruction: string;
  distance: string;
};

export type RouteData = {
  steps: RouteStep[];
  totalDistance: string;
  totalTime: string;
  polylineCoords: LatLng[];
  trafficLevel: TrafficLevel;
};

export type SearchResult = ParkingSpot | Place;

export type TrafficFilter = 'all' | TrafficLevel;

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
  Route: { destination?: SearchResult } | undefined;
  Search: undefined;
};

export type MainTabParamList = {
  Map: undefined;
  Traffic: undefined;
  Parking: undefined;
  Settings: undefined;
};

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type NativeMapRegion = Region;
