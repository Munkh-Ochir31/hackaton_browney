import api from './apiClient';

const FALLBACK_DATA = [
  { id: 'p1', _id: 'p1', name: 'Сүхбаатарын талбайн зогсоол', address: 'Сүхбаатарын талбай', lat: 47.918, lng: 106.917, priceMNT: 2000, available: true, distanceKm: 0.5, totalSlots: 50, availableSlots: 12 },
  { id: 'p2', _id: 'p2', name: 'Улсын их дэлгүүрийн зогсоол', address: 'Энхтайваны өргөн чөлөө', lat: 47.916, lng: 106.903, priceMNT: 1500, available: true, distanceKm: 1.2, totalSlots: 30, availableSlots: 5 },
  { id: 'p3', _id: 'p3', name: 'Шангри-Ла төвийн зогсоол', address: 'Олимпийн гудамж', lat: 47.913, lng: 106.920, priceMNT: 3000, available: false, distanceKm: 0.8, totalSlots: 100, availableSlots: 0 },
];

const normalize = (p) => ({
  id: p._id || p.id,
  _id: p._id || p.id,
  name: p.name,
  address: p.address,
  lat: p.location?.coordinates?.[1] ?? p.lat,
  lng: p.location?.coordinates?.[0] ?? p.lng,
  priceMNT: p.pricePerHour ?? p.priceMNT,
  available: (p.availableSlots ?? 0) > 0,
  distanceKm: p.walkDistanceMeters ? +(p.walkDistanceMeters / 1000).toFixed(1) : p.distanceKm,
  totalSlots: p.totalSlots,
  availableSlots: p.availableSlots,
  rating: p.rating,
  features: p.features,
  score: p.score,
});

export const fetchParkings = async () => {
  try {
    const res = await api.getParkings({ limit: 50 });
    return (res.data?.items || res.data || []).map(normalize);
  } catch (err) {
    console.warn('Backend unavailable, using fallback:', err.message);
    return FALLBACK_DATA;
  }
};

export const fetchParkingsNearby = async ({ lat, lng, radius = 2000 }) => {
  try {
    const res = await api.getParkingsNearby({ lat, lng, radius });
    return (res.data || []).map(normalize);
  } catch (err) {
    console.warn('Nearby fetch failed:', err.message);
    return FALLBACK_DATA;
  }
};

export const fetchParkingById = async (id) => {
  try {
    const res = await api.getParking(id);
    return normalize(res.data || res);
  } catch (err) {
    return FALLBACK_DATA.find((p) => p.id === id) || null;
  }
};

export const PARKING_DATA = FALLBACK_DATA;
