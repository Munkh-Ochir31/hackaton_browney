import { create } from 'zustand';

import { UB_CENTER } from '../data/mockData';
import type { MapRegion, ParkingSpot } from '../types';

type MapState = {
  selectedParking: ParkingSpot | null;
  isBottomSheetOpen: boolean;
  mapRegion: MapRegion;
  selectParking: (parking: ParkingSpot) => void;
  closeBottomSheet: () => void;
  setRegion: (region: MapRegion) => void;
};

export const useMapStore = create<MapState>((set) => ({
  selectedParking: null,
  isBottomSheetOpen: false,
  mapRegion: UB_CENTER,
  selectParking: (parking) => set({ selectedParking: parking, isBottomSheetOpen: true }),
  closeBottomSheet: () => set({ selectedParking: null, isBottomSheetOpen: false }),
  setRegion: (region) => set({ mapRegion: region }),
}));
