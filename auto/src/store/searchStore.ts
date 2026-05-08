import { create } from 'zustand';

import type { Place, SearchResult } from '../types';

type SearchState = {
  recentSearches: Place[];
  addRecent: (result: SearchResult) => void;
  removeRecent: (id: string) => void;
  clearRecent: () => void;
};

function toRecentPlace(result: SearchResult): Place {
  const category = 'category' in result ? result.category : 'parking';

  return {
    id: result.id,
    name: result.name,
    nameEn: result.nameEn,
    category,
    lat: result.lat,
    lng: result.lng,
    address: result.address,
    district: result.district,
  };
}

export const useSearchStore = create<SearchState>((set) => ({
  recentSearches: [],
  addRecent: (result) =>
    set((state) => {
      const place = toRecentPlace(result);
      const deduped = state.recentSearches.filter((item) => item.id !== place.id);
      return { recentSearches: [place, ...deduped].slice(0, 5) };
    }),
  removeRecent: (id) =>
    set((state) => ({
      recentSearches: state.recentSearches.filter((item) => item.id !== id),
    })),
  clearRecent: () => set({ recentSearches: [] }),
}));
