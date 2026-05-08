import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Car,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Filter,
  Gauge,
  Globe2,
  LocateFixed,
  LogOut,
  MapPin,
  Mic,
  Moon,
  Navigation,
  ParkingCircle,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import maplibregl, { type GeoJSONSource, type Map, type Marker } from 'maplibre-gl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PARKUB_MAP_STYLE } from './mapStyle';

type TrafficLevel = 'severe' | 'moderate' | 'clear';
type OccupancyLevel = 'available' | 'filling' | 'full';
type AppView = 'map' | 'traffic' | 'parking' | 'settings';
type SearchItem = (ParkingSpot & { resultType: 'parking' }) | (Place & { resultType: 'place' });

type LatLng = {
  lat: number;
  lng: number;
};

type ParkingSpot = LatLng & {
  id: string;
  name: string;
  nameEn: string;
  total: number;
  available: number;
  pricePerHour: number;
  district: string;
  address: string;
  isOpen: boolean;
  amenities: string[];
};

type TrafficSegment = {
  id: string;
  road: string;
  segment: string;
  level: TrafficLevel;
  delayMinutes: number;
  reportedAt: Date;
  coordinates: LatLng[];
};

type Place = LatLng & {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  district: string;
  address: string;
  distanceKm: number;
};

type RouteStep = {
  id: string;
  icon: 'left' | 'right' | 'straight';
  text: string;
  distance: string;
};

const THEME = {
  primary: '#22D3EE',
  primaryDark: '#8B5CF6',
  danger: '#FF4D7D',
  warning: '#FBBF24',
  safe: '#34D399',
  bgBase: '#05070D',
  bgCard: '#111827',
  navBg: '#080B13',
  navInactive: '#7C8497',
  textPrimary: '#F8FAFC',
  textMuted: '#9CA3AF',
};

const PARKING_SPOTS: ParkingSpot[] = [
  {
    id: 'p1',
    name: 'Централ Тауэр зогсоол',
    nameEn: 'Central Tower Parking',
    lat: 47.9157,
    lng: 106.9215,
    total: 50,
    available: 12,
    pricePerHour: 2000,
    district: 'Чингэлтэй дүүрэг',
    address: 'Сүхбаатарын талбайн баруун тал',
    isOpen: true,
    amenities: ['CCTV', 'Гэрэлтүүлэг', 'Дотор зогсоол'],
  },
  {
    id: 'p2',
    name: 'Шангри-Ла Молл зогсоол',
    nameEn: 'Shangri-La Mall Parking',
    lat: 47.9101,
    lng: 106.9187,
    total: 120,
    available: 3,
    pricePerHour: 3000,
    district: 'Сүхбаатар дүүрэг',
    address: 'Олимпын гудамж',
    isOpen: true,
    amenities: ['CCTV', 'Цахилгаан цэнэглэгч', '24/7'],
  },
  {
    id: 'p3',
    name: 'Их Тэнгэр зогсоол',
    nameEn: 'Ikh Tenger Parking',
    lat: 47.92,
    lng: 106.905,
    total: 80,
    available: 45,
    pricePerHour: 1500,
    district: 'Баянгол дүүрэг',
    address: 'Их Тэнгэрийн уулзвар',
    isOpen: true,
    amenities: ['Ил зогсоол', 'Гэрэлтүүлэг', 'Камер'],
  },
  {
    id: 'p4',
    name: 'Сансар төв зогсоол',
    nameEn: 'Sansar Center Parking',
    lat: 47.924,
    lng: 106.942,
    total: 65,
    available: 21,
    pricePerHour: 1800,
    district: 'Баянзүрх дүүрэг',
    address: 'Сансарын тунелийн ойролцоо',
    isOpen: true,
    amenities: ['CCTV', 'Харуул', 'Гэрэлтүүлэг'],
  },
  {
    id: 'p5',
    name: 'Нарантуул зах зогсоол',
    nameEn: 'Narantuul Market Parking',
    lat: 47.908,
    lng: 106.938,
    total: 150,
    available: 72,
    pricePerHour: 1000,
    district: 'Баянзүрх дүүрэг',
    address: 'Нарантуул худалдааны төв',
    isOpen: true,
    amenities: ['Ил зогсоол', 'Хямд үнэ', 'Такси буудал'],
  },
  {
    id: 'p6',
    name: 'Зайсан Хилл зогсоол',
    nameEn: 'Zaisan Hill Parking',
    lat: 47.879,
    lng: 106.898,
    total: 90,
    available: 8,
    pricePerHour: 2500,
    district: 'Хан-Уул дүүрэг',
    address: 'Зайсан толгойн зам',
    isOpen: true,
    amenities: ['Панорам харагдац', 'CCTV', '24/7'],
  },
  {
    id: 'p7',
    name: 'Хан-Уул бизнес парк',
    nameEn: 'Khan-Uul Business Park',
    lat: 47.892,
    lng: 106.883,
    total: 110,
    available: 58,
    pricePerHour: 1800,
    district: 'Хан-Уул дүүрэг',
    address: 'Чингисийн өргөн чөлөө',
    isOpen: false,
    amenities: ['Дотор зогсоол', 'Камер', 'Лифт'],
  },
  {
    id: 'p8',
    name: 'Баянгол төв зогсоол',
    nameEn: 'Bayangol Center Parking',
    lat: 47.911,
    lng: 106.87,
    total: 75,
    available: 31,
    pricePerHour: 1500,
    district: 'Баянгол дүүрэг',
    address: 'Ард Аюушийн өргөн чөлөө',
    isOpen: true,
    amenities: ['Гэрэлтүүлэг', 'Харуул', 'Ойрхон гарц'],
  },
  {
    id: 'p9',
    name: 'Драгон Центр зогсоол',
    nameEn: 'Dragon Center Parking',
    lat: 47.906,
    lng: 106.912,
    total: 140,
    available: 19,
    pricePerHour: 1200,
    district: 'Сонгинохайрхан чиглэл',
    address: 'Энхтайвны өргөн чөлөө',
    isOpen: true,
    amenities: ['Автобус терминал', 'Ил зогсоол', 'Харуул'],
  },
  {
    id: 'p10',
    name: 'Улаанбаатар Плаза зогсоол',
    nameEn: 'Ulaanbaatar Plaza Parking',
    lat: 47.913,
    lng: 106.927,
    total: 95,
    available: 63,
    pricePerHour: 2200,
    district: 'Сүхбаатар дүүрэг',
    address: 'Сөүлийн гудамж',
    isOpen: true,
    amenities: ['CCTV', 'Дотор зогсоол', 'Төлбөрийн киоск'],
  },
];

const minutesAgo = (minutes: number): Date => new Date(Date.now() - minutes * 60_000);

const TRAFFIC_SEGMENTS: TrafficSegment[] = [
  {
    id: 't1',
    road: 'Энхтайвны өргөн чөлөө',
    segment: 'Баруун 4 замаас Сүхбаатарын талбай хүртэл',
    level: 'severe',
    delayMinutes: 18,
    reportedAt: minutesAgo(4),
    coordinates: [
      { lat: 47.9134, lng: 106.8922 },
      { lat: 47.9144, lng: 106.9048 },
      { lat: 47.9167, lng: 106.9177 },
    ],
  },
  {
    id: 't2',
    road: 'Энхтайвны өргөн чөлөө',
    segment: 'Сүхбаатарын талбайгаас Зүүн 4 зам',
    level: 'moderate',
    delayMinutes: 9,
    reportedAt: minutesAgo(8),
    coordinates: [
      { lat: 47.9167, lng: 106.9177 },
      { lat: 47.9142, lng: 106.9298 },
      { lat: 47.9131, lng: 106.9382 },
    ],
  },
  {
    id: 't3',
    road: 'Чингисийн өргөн чөлөө',
    segment: 'Хан-Уулын уулзвараас Төв шуудан',
    level: 'clear',
    delayMinutes: 2,
    reportedAt: minutesAgo(12),
    coordinates: [
      { lat: 47.892, lng: 106.883 },
      { lat: 47.9006, lng: 106.8964 },
      { lat: 47.9139, lng: 106.9161 },
    ],
  },
  {
    id: 't4',
    road: 'Их тойруу',
    segment: 'Гэсэр сүмээс Сансар хүртэл',
    level: 'severe',
    delayMinutes: 22,
    reportedAt: minutesAgo(5),
    coordinates: [
      { lat: 47.9219, lng: 106.9001 },
      { lat: 47.9245, lng: 106.9147 },
      { lat: 47.924, lng: 106.942 },
    ],
  },
  {
    id: 't5',
    road: 'Сүхбаатарын гудамж',
    segment: 'Төв шуудангаас МУИС хүртэл',
    level: 'moderate',
    delayMinutes: 7,
    reportedAt: minutesAgo(16),
    coordinates: [
      { lat: 47.9139, lng: 106.9161 },
      { lat: 47.9186, lng: 106.9177 },
      { lat: 47.9221, lng: 106.9206 },
    ],
  },
  {
    id: 't6',
    road: 'Баянголын гудамж',
    segment: 'Гандангаас Баруун 4 зам',
    level: 'clear',
    delayMinutes: 1,
    reportedAt: minutesAgo(20),
    coordinates: [
      { lat: 47.9228, lng: 106.8946 },
      { lat: 47.9186, lng: 106.9006 },
      { lat: 47.9134, lng: 106.8922 },
    ],
  },
  {
    id: 't7',
    road: 'Нарны зам',
    segment: 'Төмөр замаас Баянмонгол хороолол',
    level: 'moderate',
    delayMinutes: 11,
    reportedAt: minutesAgo(9),
    coordinates: [
      { lat: 47.9012, lng: 106.8898 },
      { lat: 47.9009, lng: 106.9104 },
      { lat: 47.9007, lng: 106.9322 },
    ],
  },
  {
    id: 't8',
    road: 'Зайсангийн зам',
    segment: 'Зайсан тойргоос Их Тэнгэр',
    level: 'severe',
    delayMinutes: 15,
    reportedAt: minutesAgo(6),
    coordinates: [
      { lat: 47.8847, lng: 106.915 },
      { lat: 47.8917, lng: 106.9074 },
      { lat: 47.8971, lng: 106.9078 },
    ],
  },
  {
    id: 't9',
    road: 'Олимпын гудамж',
    segment: 'Шангри-Лагаас Сансарын тунель',
    level: 'clear',
    delayMinutes: 0,
    reportedAt: minutesAgo(23),
    coordinates: [
      { lat: 47.9101, lng: 106.9187 },
      { lat: 47.9132, lng: 106.9287 },
      { lat: 47.9182, lng: 106.9377 },
    ],
  },
  {
    id: 't10',
    road: 'Ард Аюушийн өргөн чөлөө',
    segment: 'Баянголоос 25-р эмийн сан',
    level: 'moderate',
    delayMinutes: 8,
    reportedAt: minutesAgo(14),
    coordinates: [
      { lat: 47.911, lng: 106.87 },
      { lat: 47.9134, lng: 106.8828 },
      { lat: 47.9134, lng: 106.8922 },
    ],
  },
  {
    id: 't11',
    road: 'Их Монгол Улсын гудамж',
    segment: 'Баянмонгол хорооллоос Нарантуул',
    level: 'clear',
    delayMinutes: 3,
    reportedAt: minutesAgo(30),
    coordinates: [
      { lat: 47.9007, lng: 106.9322 },
      { lat: 47.9044, lng: 106.9389 },
      { lat: 47.908, lng: 106.938 },
    ],
  },
  {
    id: 't12',
    road: 'Сөүлийн гудамж',
    segment: 'УБ Плазагаас Төв шуудан',
    level: 'severe',
    delayMinutes: 17,
    reportedAt: minutesAgo(3),
    coordinates: [
      { lat: 47.913, lng: 106.927 },
      { lat: 47.9143, lng: 106.9192 },
      { lat: 47.9139, lng: 106.9161 },
    ],
  },
];

const SEARCH_SUGGESTIONS: Place[] = [
  {
    id: 's1',
    name: 'Сүхбаатарын талбай',
    nameEn: 'Sukhbaatar Square',
    category: 'Төв талбай',
    lat: 47.9186,
    lng: 106.9177,
    district: 'Сүхбаатар дүүрэг',
    address: 'Төв шуудангийн урд',
    distanceKm: 0.4,
  },
  {
    id: 's2',
    name: 'Гандан хийд',
    nameEn: 'Gandantegchinlen Monastery',
    category: 'Соёл',
    lat: 47.9228,
    lng: 106.8946,
    district: 'Баянгол дүүрэг',
    address: 'Гандангийн дэнж',
    distanceKm: 2.1,
  },
  {
    id: 's3',
    name: 'ГД',
    nameEn: 'State Department Store',
    category: 'Дэлгүүр',
    lat: 47.9163,
    lng: 106.9081,
    district: 'Сүхбаатар дүүрэг',
    address: 'Их дэлгүүрийн барилга',
    distanceKm: 1.2,
  },
  {
    id: 's4',
    name: 'Шангри-Ла Молл',
    nameEn: 'Shangri-La Mall',
    category: 'Дэлгүүр',
    lat: 47.9101,
    lng: 106.9187,
    district: 'Сүхбаатар дүүрэг',
    address: 'Олимпын гудамж',
    distanceKm: 0.8,
  },
  {
    id: 's5',
    name: 'Их Тэнгэр',
    nameEn: 'Ikh Tenger',
    category: 'Бүс',
    lat: 47.92,
    lng: 106.905,
    district: 'Баянгол дүүрэг',
    address: 'Их Тэнгэрийн уулзвар',
    distanceKm: 1.9,
  },
  {
    id: 's6',
    name: 'Богд хааны ордон музей',
    nameEn: 'Bogd Khan Palace Museum',
    category: 'Музей',
    lat: 47.8971,
    lng: 106.9078,
    district: 'Хан-Уул дүүрэг',
    address: 'Зайсангийн гудамж',
    distanceKm: 2.4,
  },
  {
    id: 's7',
    name: 'Зайсан толгой',
    nameEn: 'Zaisan Memorial',
    category: 'Үзмэр',
    lat: 47.8847,
    lng: 106.915,
    district: 'Хан-Уул дүүрэг',
    address: 'Зайсан толгой',
    distanceKm: 3.8,
  },
  {
    id: 's8',
    name: 'Чингис хааны нисэх буудал',
    nameEn: 'Chinggis Khaan International Airport',
    category: 'Нисэх буудал',
    lat: 47.6469,
    lng: 106.8198,
    district: 'Сэргэлэн сум',
    address: 'Хөшигийн хөндий',
    distanceKm: 51.0,
  },
  {
    id: 's9',
    name: 'Хүрэлтогоот',
    nameEn: 'Khurel Togoot',
    category: 'Судалгаа',
    lat: 47.8655,
    lng: 107.0539,
    district: 'Баянзүрх дүүрэг',
    address: 'Богд уулын ам',
    distanceKm: 13.5,
  },
  {
    id: 's10',
    name: 'МУИС',
    nameEn: 'National University of Mongolia',
    category: 'Их сургууль',
    lat: 47.9221,
    lng: 106.9206,
    district: 'Сүхбаатар дүүрэг',
    address: 'Их сургуулийн гудамж',
    distanceKm: 1.1,
  },
  {
    id: 's11',
    name: 'Улаанбаатар зочид буудал',
    nameEn: 'Ulaanbaatar Hotel',
    category: 'Зочид буудал',
    lat: 47.9183,
    lng: 106.9217,
    district: 'Сүхбаатар дүүрэг',
    address: 'Сүхбаатарын талбайн зүүн тал',
    distanceKm: 0.5,
  },
  {
    id: 's12',
    name: 'Нарантуул зах',
    nameEn: 'Narantuul Market',
    category: 'Зах',
    lat: 47.908,
    lng: 106.938,
    district: 'Баянзүрх дүүрэг',
    address: 'Нарантуул худалдааны төв',
    distanceKm: 2.7,
  },
];

const ROUTE_STEPS: RouteStep[] = [
  { id: 'r1', icon: 'straight', text: 'Сүхбаатарын талбайгаас урагш хөдөлнө', distance: '260 м' },
  { id: 'r2', icon: 'right', text: 'Олимпын гудамж руу баруун эргэнэ', distance: '410 м' },
  { id: 'r3', icon: 'straight', text: 'Шангри-Ла Моллын үндсэн орц хүртэл шулуун явна', distance: '520 м' },
  { id: 'r4', icon: 'left', text: 'Зогсоолын B1 түвшний орц руу зүүн эргэнэ', distance: '90 м' },
];

const NAV_ITEMS: Array<{ id: AppView; label: string; icon: LucideIcon }> = [
  { id: 'map', label: 'Нүүр', icon: MapPin },
  { id: 'traffic', label: 'Траффик', icon: Car },
  { id: 'parking', label: 'Зогсоол', icon: ParkingCircle },
  { id: 'settings', label: 'Профайл', icon: UserRound },
];

const getOccupancyLevel = (spot: ParkingSpot): OccupancyLevel => {
  const freeRatio = spot.available / spot.total;

  if (freeRatio > 0.5) {
    return 'available';
  }

  if (freeRatio >= 0.2) {
    return 'filling';
  }

  return 'full';
};

const occupancyLabel: Record<OccupancyLevel, string> = {
  available: 'Сул байна',
  filling: 'Дүүрч байна',
  full: 'Дүүрсэн',
};

const trafficLabel: Record<TrafficLevel, string> = {
  severe: 'Хүнд',
  moderate: 'Хэвийн',
  clear: 'Саадгүй',
};

const trafficColor: Record<TrafficLevel, string> = {
  severe: THEME.danger,
  moderate: THEME.warning,
  clear: THEME.safe,
};

type TrafficGeoJson = Exclude<Parameters<GeoJSONSource['setData']>[0], string>;

const createTrafficGeoJson = (): TrafficGeoJson => ({
  type: 'FeatureCollection',
  features: TRAFFIC_SEGMENTS.map((segment) => ({
    type: 'Feature',
    properties: {
      id: segment.id,
      road: segment.road,
      level: segment.level,
      delayMinutes: segment.delayMinutes,
    },
    geometry: {
      type: 'LineString',
      coordinates: segment.coordinates.map((point): [number, number] => [point.lng, point.lat]),
    },
  })),
});

const formatMnt = (value: number): string => new Intl.NumberFormat('mn-MN').format(value);

const getTimeAgo = (date: Date): string => {
  const minutes = Math.max(1, Math.round((Date.now() - date.getTime()) / 60_000));
  return `${minutes} минутын өмнө`;
};

const getDistanceFromCenter = (spot: ParkingSpot): string => {
  const roughMeters =
    Math.sqrt((spot.lat - 47.9077) ** 2 + (spot.lng - 106.8832) ** 2) * 111_000;

  if (roughMeters > 1_000) {
    return `${(roughMeters / 1_000).toFixed(1)} км`;
  }

  return `${Math.round(roughMeters / 10) * 10} м`;
};

const isParkingItem = (item: SearchItem): item is ParkingSpot & { resultType: 'parking' } =>
  item.resultType === 'parking';

function App() {
  const [activeView, setActiveView] = useState<AppView>('map');
  const [selectedParking, setSelectedParking] = useState<ParkingSpot>(PARKING_SPOTS[0]);
  const [trafficFilter, setTrafficFilter] = useState<TrafficLevel | 'all'>('all');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  const parkingStats = useMemo(() => {
    const available = PARKING_SPOTS.reduce((sum, spot) => sum + spot.available, 0);
    const total = PARKING_SPOTS.reduce((sum, spot) => sum + spot.total, 0);
    const open = PARKING_SPOTS.filter((spot) => spot.isOpen).length;

    return { available, total, open };
  }, []);

  const trafficStats = useMemo(
    () => ({
      severe: TRAFFIC_SEGMENTS.filter((segment) => segment.level === 'severe').length,
      moderate: TRAFFIC_SEGMENTS.filter((segment) => segment.level === 'moderate').length,
      clear: TRAFFIC_SEGMENTS.filter((segment) => segment.level === 'clear').length,
    }),
    [],
  );

  const searchItems = useMemo<SearchItem[]>(
    () => [
      ...SEARCH_SUGGESTIONS.map((place) => ({ ...place, resultType: 'place' as const })),
      ...PARKING_SPOTS.map((spot) => ({ ...spot, resultType: 'parking' as const })),
    ],
    [],
  );

  const filteredSearchItems = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('mn-MN');

    if (!normalizedQuery) {
      return searchItems.slice(0, 8);
    }

    return searchItems
      .filter((item) => {
        const searchable = `${item.name} ${item.nameEn} ${item.address} ${item.district}`.toLocaleLowerCase('mn-MN');
        return searchable.includes(normalizedQuery);
      })
      .slice(0, 8);
  }, [query, searchItems]);

  const filteredTrafficSegments = useMemo(
    () =>
      trafficFilter === 'all'
        ? TRAFFIC_SEGMENTS
        : TRAFFIC_SEGMENTS.filter((segment) => segment.level === trafficFilter),
    [trafficFilter],
  );

  const sortedParkingSpots = useMemo(
    () =>
      [...PARKING_SPOTS].sort((first, second) => {
        const firstLevel = getOccupancyLevel(first);
        const secondLevel = getOccupancyLevel(second);
        const score: Record<OccupancyLevel, number> = { available: 0, filling: 1, full: 2 };
        return score[firstLevel] - score[secondLevel] || second.available - first.available;
      }),
    [],
  );

  const handleSelectParking = (spot: ParkingSpot): void => {
    setSelectedParking(spot);
    setIsSheetOpen(true);
    setActiveView('map');
  };

  const handleSelectSearchResult = (item: SearchItem): void => {
    if (isParkingItem(item)) {
      handleSelectParking(item);
    } else {
      const nearestSpot = PARKING_SPOTS.reduce((nearest, spot) => {
        const nearestDistance = Math.abs(nearest.lat - item.lat) + Math.abs(nearest.lng - item.lng);
        const spotDistance = Math.abs(spot.lat - item.lat) + Math.abs(spot.lng - item.lng);
        return spotDistance < nearestDistance ? spot : nearest;
      }, PARKING_SPOTS[0]);
      setSelectedParking(nearestSpot);
      setIsSheetOpen(true);
      setActiveView('map');
    }

    setQuery('');
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">UB</div>
          <div>
            <strong>UB Traffic</strong>
            <span>Smart mobility</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Үндсэн цэс">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                key={item.id}
                onClick={() => setActiveView(item.id)}
                type="button"
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-card">
          <ShieldCheck size={20} />
          <div>
            <strong>{parkingStats.open} нээлттэй бүс</strong>
            <span>{parkingStats.available}/{parkingStats.total} сул зогсоол</span>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="page-title">
            <span className="eyebrow">Улаанбаатар хот</span>
            <h1>UB Traffic</h1>
          </div>

          <div className="global-search">
            <Search size={18} />
            <input
              aria-label="Хайлт"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Хаашаа явах вэ?"
              value={query}
            />
            {query ? (
              <button aria-label="Хайлт арилгах" className="search-action" onClick={() => setQuery('')} type="button">
                <X size={17} />
              </button>
            ) : (
              <button aria-label="Дуугаар хайх" className="search-action" type="button">
                <Mic size={17} />
              </button>
            )}

            <div className="search-popover">
              <div className="popover-title">{query ? 'Хайлтын илэрц' : 'Алдартай газрууд'}</div>
              {filteredSearchItems.length ? (
                filteredSearchItems.map((item) => (
                  <button
                    className="search-result"
                    key={`${item.resultType}-${item.id}`}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      handleSelectSearchResult(item);
                    }}
                    type="button"
                  >
                    <span className="result-icon">
                      {item.resultType === 'parking' ? <ParkingCircle size={18} /> : <MapPin size={18} />}
                    </span>
                    <span>
                      <strong>{item.name}</strong>
                      <small>{item.district} · {item.address}</small>
                    </span>
                    <ChevronRight size={16} />
                  </button>
                ))
              ) : (
                <div className="empty-search">Хайлт олдсонгүй</div>
              )}
            </div>
          </div>

          <div className="live-pill">
            <span className="live-dot" />
            Шууд
          </div>
        </header>

        {isLoading ? (
          <LoadingDashboard />
        ) : (
          <div className={`content-grid view-${activeView}`}>
            <section className="map-card">
              <MapToolbar
                selectedParking={selectedParking}
                onLocate={() => handleSelectParking(PARKING_SPOTS[0])}
                onFilter={() => setActiveView('traffic')}
              />
              <CityMap
                onSelectParking={handleSelectParking}
                selectedParking={selectedParking}
              />
              {isSheetOpen ? (
                <ParkingSheet
                  onClose={() => setIsSheetOpen(false)}
                  onRoute={() => setActiveView('map')}
                  spot={selectedParking}
                />
              ) : null}
            </section>

            <section className="right-panel">
              {activeView === 'traffic' ? (
                <TrafficPanel
                  filter={trafficFilter}
                  onFilterChange={setTrafficFilter}
                  segments={filteredTrafficSegments}
                  stats={trafficStats}
                />
              ) : activeView === 'parking' ? (
                <ParkingPanel
                  onSelectParking={handleSelectParking}
                  selectedParking={selectedParking}
                  spots={sortedParkingSpots}
                />
              ) : activeView === 'settings' ? (
                <SettingsPanel />
              ) : (
                <RoutePanel selectedParking={selectedParking} />
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

function LoadingDashboard() {
  return (
    <div className="loading-grid">
      <div className="skeleton skeleton-map" />
      <div className="skeleton-stack">
        <div className="skeleton skeleton-card" />
        <div className="skeleton skeleton-card small" />
        <div className="skeleton skeleton-card" />
      </div>
    </div>
  );
}

type MapToolbarProps = {
  selectedParking: ParkingSpot;
  onLocate: () => void;
  onFilter: () => void;
};

function MapToolbar({ selectedParking, onLocate, onFilter }: MapToolbarProps) {
  return (
    <div className="map-toolbar">
      <div>
        <span className="eyebrow">Сонгосон зогсоол</span>
        <strong>{selectedParking.name}</strong>
      </div>
      <div className="map-actions">
        <button className="icon-button" onClick={onLocate} type="button" aria-label="Миний байршил">
          <LocateFixed size={19} />
        </button>
        <button className="icon-button" onClick={onFilter} type="button" aria-label="Шүүлтүүр">
          <Filter size={19} />
        </button>
      </div>
    </div>
  );
}

type CityMapProps = {
  selectedParking: ParkingSpot;
  onSelectParking: (spot: ParkingSpot) => void;
};

function CityMap({ selectedParking, onSelectParking }: CityMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const onSelectRef = useRef(onSelectParking);

  useEffect(() => {
    onSelectRef.current = onSelectParking;
  }, [onSelectParking]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: PARKUB_MAP_STYLE,
      center: [106.9177, 47.9139],
      zoom: 12.8,
      minZoom: 5,
      maxZoom: 17,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    map.on('load', () => {
      map.addSource('traffic-segments', {
        type: 'geojson',
        data: createTrafficGeoJson(),
      });

      (['clear', 'moderate', 'severe'] as TrafficLevel[]).forEach((level) => {
        const beforeLayer = map.getLayer('road-labels') ? 'road-labels' : undefined;

        map.addLayer(
          {
            id: `traffic-${level}`,
            type: 'line',
            source: 'traffic-segments',
            filter: ['==', ['get', 'level'], level],
            layout: {
              'line-cap': 'round',
              'line-join': 'round',
            },
            paint: {
              'line-color': trafficColor[level],
              'line-width': ['interpolate', ['linear'], ['zoom'], 10, 3, 14, level === 'severe' ? 8 : 6],
              'line-opacity': level === 'clear' ? 0.76 : 0.9,
              'line-blur': level === 'severe' ? 0.4 : 0,
            },
          },
          beforeLayer,
        );
      });
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;

    if (!map) {
      return;
    }

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = PARKING_SPOTS.map((spot) => {
      const level = getOccupancyLevel(spot);
      const isSelected = selectedParking.id === spot.id;
      const element = document.createElement('button');
      const label = document.createElement('span');

      element.className = `parking-marker maplibre-parking-marker ${level} ${isSelected ? 'selected' : ''}`;
      element.type = 'button';
      element.title = spot.name;
      label.textContent = String(spot.available);
      element.append(label);
      element.addEventListener('click', () => {
        onSelectRef.current(spot);
        map.flyTo({
          center: [spot.lng, spot.lat],
          zoom: 14.2,
          speed: 0.9,
          curve: 1.25,
          essential: true,
        });
      });

      return new maplibregl.Marker({ element, anchor: 'bottom' })
        .setLngLat([spot.lng, spot.lat])
        .addTo(map);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [selectedParking.id]);

  useEffect(() => {
    mapRef.current?.flyTo({
      center: [selectedParking.lng, selectedParking.lat],
      zoom: 14,
      speed: 0.82,
      curve: 1.18,
      essential: true,
    });
  }, [selectedParking]);

  return (
    <div className="city-map real-map" aria-label="Улаанбаатар хотын OpenStreetMap газрын зураг">
      <div ref={containerRef} className="maplibre-stage" />
      <div className="map-data-pill">
        Offline UB map
      </div>
      <div className="map-legend">
        <span><i className="legend-dot safe" /> Сул</span>
        <span><i className="legend-dot warning" /> Дүүрч байна</span>
        <span><i className="legend-dot danger" /> Дүүрсэн</span>
      </div>
    </div>
  );
}

type ParkingSheetProps = {
  spot: ParkingSpot;
  onClose: () => void;
  onRoute: () => void;
};

function ParkingSheet({ spot, onClose, onRoute }: ParkingSheetProps) {
  const level = getOccupancyLevel(spot);
  const occupiedPercent = Math.round(((spot.total - spot.available) / spot.total) * 100);

  return (
    <article className="parking-sheet">
      <div className="sheet-handle" />
      <button className="sheet-close" onClick={onClose} type="button" aria-label="Хаах">
        <X size={17} />
      </button>
      <div className="sheet-title-row">
        <div>
          <span className="eyebrow">{spot.district}</span>
          <h2>{spot.name}</h2>
        </div>
        <span className={`status-badge ${spot.isOpen ? 'open' : 'closed'}`}>
          {spot.isOpen ? 'Нээлттэй' : 'Хаалттай'}
        </span>
      </div>

      <div className="sheet-meta">
        <span><Clock3 size={16} /> ₮{formatMnt(spot.pricePerHour)}/цаг</span>
        <span><MapPin size={16} /> {getDistanceFromCenter(spot)}</span>
      </div>

      <div className="occupancy-row">
        <div className="occupancy-copy">
          <strong>{spot.available}/{spot.total} зогсоол</strong>
          <span>{occupancyLabel[level]} · {occupiedPercent}% дүүрэлттэй</span>
        </div>
        <div className="occupancy-track">
          <span className={`occupancy-fill ${level}`} style={{ width: `${occupiedPercent}%` }} />
        </div>
      </div>

      <div className="amenity-row">
        {spot.amenities.map((amenity) => (
          <span key={amenity}>{amenity}</span>
        ))}
      </div>

      <p className="address-line">{spot.address}</p>

      <div className="sheet-actions">
        <button className="secondary-button" type="button">Мэдээлэл</button>
        <button className="primary-button" onClick={onRoute} type="button">
          <Navigation size={18} />
          Маршрут
        </button>
      </div>
    </article>
  );
}

type RoutePanelProps = {
  selectedParking: ParkingSpot;
};

function RoutePanel({ selectedParking }: RoutePanelProps) {
  const trafficLevel = getOccupancyLevel(selectedParking) === 'full' ? 'severe' : 'moderate';

  return (
    <div className="panel-stack">
      <div className="route-card">
        <div className="route-header">
          <div>
            <span className="eyebrow">Идэвхтэй маршрут</span>
            <h2>{selectedParking.name}</h2>
          </div>
          <span className={`traffic-badge ${trafficLevel}`}>{trafficLevel === 'severe' ? 'Түгжрэлтэй' : 'Хэвийн'}</span>
        </div>

        <div className="route-stats">
          <span><Clock3 size={16} /> ~8 мин</span>
          <span><Gauge size={16} /> 1.2 км</span>
          <span><Zap size={16} /> ₮{formatMnt(selectedParking.pricePerHour)}</span>
        </div>

        <div className="route-line-preview">
          <span className="route-node start" />
          <span className="route-path" />
          <span className="route-node end" />
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-heading">
          <h3>Хэрхэн явах</h3>
          <span>Central → Parking</span>
        </div>

        <div className="step-list">
          {ROUTE_STEPS.map((step, index) => (
            <div className="route-step" key={step.id}>
              <div className="step-icon">
                {step.icon === 'left' ? <ArrowLeft size={17} /> : step.icon === 'right' ? <ArrowRight size={17} /> : <Navigation size={17} />}
              </div>
              <div>
                <strong>{index + 1}. {step.text}</strong>
                <span>{step.distance}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="start-button" type="button">
        <Navigation size={19} />
        Навигац эхлүүлэх
      </button>
    </div>
  );
}

type TrafficPanelProps = {
  filter: TrafficLevel | 'all';
  onFilterChange: (filter: TrafficLevel | 'all') => void;
  segments: TrafficSegment[];
  stats: Record<TrafficLevel, number>;
};

function TrafficPanel({ filter, onFilterChange, segments, stats }: TrafficPanelProps) {
  const filterOptions: Array<{ id: TrafficLevel | 'all'; label: string }> = [
    { id: 'all', label: 'Бүгд' },
    { id: 'severe', label: 'Хүнд' },
    { id: 'moderate', label: 'Хэвийн' },
    { id: 'clear', label: 'Саадгүй' },
  ];

  return (
    <div className="panel-stack">
      <div className="panel-card traffic-head">
        <div>
          <span className="eyebrow">Улаанбаатар хот</span>
          <h2>Замын нөхцөл</h2>
        </div>
        <span className="live-pill compact"><span className="live-dot" /> Шууд</span>
      </div>

      <div className="stats-grid">
        <StatCard tone="danger" value={stats.severe} label="Хүнд түгжрэл" />
        <StatCard tone="warning" value={stats.moderate} label="Хэвийн нөхцөл" />
        <StatCard tone="safe" value={stats.clear} label="Саадгүй зам" />
      </div>

      <div className="filter-row">
        {filterOptions.map((option) => (
          <button
            className={filter === option.id ? 'active' : ''}
            key={option.id}
            onClick={() => onFilterChange(option.id)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="traffic-list">
        {segments.length ? (
          segments.map((segment) => <TrafficCard key={segment.id} segment={segment} />)
        ) : (
          <div className="empty-state">
            <CheckCircle2 size={34} />
            <strong>Энэ ангилалд мэдээлэл байхгүй байна</strong>
          </div>
        )}
      </div>
    </div>
  );
}

type StatCardProps = {
  tone: 'danger' | 'warning' | 'safe';
  value: number;
  label: string;
};

function StatCard({ tone, value, label }: StatCardProps) {
  return (
    <div className={`stat-card ${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

type TrafficCardProps = {
  segment: TrafficSegment;
};

function TrafficCard({ segment }: TrafficCardProps) {
  return (
    <article className={`traffic-card ${segment.level}`}>
      <span className="severity-bar" />
      <div className="traffic-card-main">
        <strong>{segment.road}</strong>
        <span>{segment.segment}</span>
        <div className="traffic-card-meta">
          <span className={`traffic-badge ${segment.level}`}>{trafficLabel[segment.level]}</span>
          <span className="delay-chip">+{segment.delayMinutes} мин</span>
          <small>{getTimeAgo(segment.reportedAt)}</small>
        </div>
      </div>
      <ChevronRight size={18} />
    </article>
  );
}

type ParkingPanelProps = {
  spots: ParkingSpot[];
  selectedParking: ParkingSpot;
  onSelectParking: (spot: ParkingSpot) => void;
};

function ParkingPanel({ spots, selectedParking, onSelectParking }: ParkingPanelProps) {
  return (
    <div className="panel-stack">
      <div className="panel-card traffic-head">
        <div>
          <span className="eyebrow">Зогсоолын жагсаалт</span>
          <h2>Ойр байгаа сул зогсоолууд</h2>
        </div>
        <ParkingCircle size={24} />
      </div>

      <div className="parking-list">
        {spots.map((spot) => {
          const level = getOccupancyLevel(spot);
          return (
            <button
              className={`parking-row ${selectedParking.id === spot.id ? 'active' : ''}`}
              key={spot.id}
              onClick={() => onSelectParking(spot)}
              type="button"
            >
              <span className={`parking-row-icon ${level}`}>{spot.available}</span>
              <span className="parking-row-copy">
                <strong>{spot.name}</strong>
                <small>{spot.district} · ₮{formatMnt(spot.pricePerHour)}/цаг</small>
              </span>
              <span className={`traffic-badge ${level === 'available' ? 'clear' : level === 'filling' ? 'moderate' : 'severe'}`}>
                {occupancyLabel[level]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="panel-stack">
      <div className="panel-card profile-card">
        <div className="profile-avatar">
          <UserRound size={28} />
        </div>
        <div>
          <span className="eyebrow">Жолооч</span>
          <h2>UB-00123</h2>
          <p>Улаанбаатар хотын шуурхай зам, зогсоолын мэдээлэл</p>
        </div>
      </div>

      <div className="panel-card setting-list">
        <div>
          <Bell size={18} />
          <span>Мэдэгдэл</span>
          <strong>Асаалттай</strong>
        </div>
        <div>
          <Moon size={18} />
          <span>Харанхуй горим</span>
          <strong>On</strong>
        </div>
        <div>
          <Car size={18} />
          <span>Машин</span>
          <strong>Sedan</strong>
        </div>
        <div>
          <Globe2 size={18} />
          <span>Хэл</span>
          <strong>Монгол</strong>
        </div>
        <div>
          <Settings size={18} />
          <span>Тохиргоо</span>
          <ChevronRight size={18} />
        </div>
      </div>

      <button className="secondary-button logout-button" type="button">
        <LogOut size={18} />
        Гарах
      </button>
    </div>
  );
}

export default App;
