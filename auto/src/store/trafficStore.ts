import { create } from 'zustand';

import { TRAFFIC_SEGMENTS } from '../data/mockData';
import { getTrafficSegments } from '../services/trafficService';
import type { TrafficFilter, TrafficSegment } from '../types';

type TrafficState = {
  segments: TrafficSegment[];
  activeFilter: TrafficFilter;
  isRefreshing: boolean;
  setFilter: (filter: TrafficFilter) => void;
  refresh: () => Promise<void>;
};

export const useTrafficStore = create<TrafficState>((set) => ({
  segments: TRAFFIC_SEGMENTS,
  activeFilter: 'all',
  isRefreshing: false,
  setFilter: (filter) => set({ activeFilter: filter }),
  refresh: async () => {
    set({ isRefreshing: true });
    const segments = await getTrafficSegments(1500);
    set({ segments, isRefreshing: false });
  },
}));
