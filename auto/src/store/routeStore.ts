import { create } from 'zustand';

import { CURRENT_LOCATION } from '../data/mockData';
import { getRoute } from '../services/routeService';
import type { LatLng, RouteData, SearchResult } from '../types';

type RouteState = {
  destination: SearchResult | null;
  activeRoute: RouteData | null;
  isLoading: boolean;
  isNavigating: boolean;
  setDestination: (destination: SearchResult | null) => void;
  loadRoute: (from?: LatLng, destinationOverride?: SearchResult) => Promise<void>;
  startNavigation: () => void;
  resetRoute: () => void;
};

export const useRouteStore = create<RouteState>((set, get) => ({
  destination: null,
  activeRoute: null,
  isLoading: false,
  isNavigating: false,
  setDestination: (destination) => set({ destination, isNavigating: false }),
  loadRoute: async (from = CURRENT_LOCATION, destinationOverride) => {
    const destination = destinationOverride ?? get().destination;

    if (!destination) {
      set({ activeRoute: null, isLoading: false });
      return;
    }

    set({ isLoading: true, destination });
    const route = await getRoute(from, { latitude: destination.lat, longitude: destination.lng });
    set({ activeRoute: route, isLoading: false });
  },
  startNavigation: () => set({ isNavigating: true }),
  resetRoute: () =>
    set({
      activeRoute: null,
      destination: null,
      isLoading: false,
      isNavigating: false,
    }),
}));
