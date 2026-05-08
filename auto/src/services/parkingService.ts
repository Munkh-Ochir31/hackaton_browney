import { PARKING_SPOTS } from '../data/mockData';
import type { ParkingSpot } from '../types';

const wait = (durationMs: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });

export async function getParkingSpots(delayMs = 800): Promise<ParkingSpot[]> {
  await wait(delayMs);
  return PARKING_SPOTS;
}

export async function getParkingSpotById(id: string): Promise<ParkingSpot | null> {
  await wait(250);
  return PARKING_SPOTS.find((spot) => spot.id === id) ?? null;
}
