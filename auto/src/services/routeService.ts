import { MOCK_ROUTE } from '../data/mockData';
import type { LatLng, RouteData } from '../types';

const wait = (durationMs: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });

function distanceKm(from: LatLng, to: LatLng) {
  const latitudeKm = (to.latitude - from.latitude) * 111;
  const longitudeKm = (to.longitude - from.longitude) * 74;
  return Math.sqrt(latitudeKm * latitudeKm + longitudeKm * longitudeKm);
}

export async function getRoute(from: LatLng, to: LatLng, delayMs = 800): Promise<RouteData | null> {
  await wait(delayMs);

  if (distanceKm(from, to) > 45) {
    return null;
  }

  return {
    ...MOCK_ROUTE,
    polylineCoords: [from, ...MOCK_ROUTE.polylineCoords.slice(1, -1), to],
  };
}
