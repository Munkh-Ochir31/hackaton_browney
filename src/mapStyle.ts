import type { StyleSpecification } from 'maplibre-gl';

export const PARKUB_MAP_STYLE: StyleSpecification = {
  version: 8,
  name: 'UB Traffic Dark OSM',
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: {
      type: 'vector',
      tiles: ['/api/tiles/{z}/{x}/{y}.pbf'],
      minzoom: 0,
      maxzoom: 14,
      bounds: [87.70255, 41.54893, 119.9889, 52.17016],
      attribution:
        '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#05070d',
      },
    },
    {
      id: 'landcover-grass',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landcover',
      filter: ['match', ['get', 'class'], ['grass', 'wood', 'forest'], true, false],
      paint: {
        'fill-color': [
          'match',
          ['get', 'class'],
          'wood',
          '#0f2b24',
          'forest',
          '#0c251f',
          '#10281f',
        ],
        'fill-opacity': 0.68,
      },
    },
    {
      id: 'parks',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'park',
      paint: {
        'fill-color': '#10281f',
        'fill-opacity': 0.76,
      },
    },
    {
      id: 'landuse-public',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landuse',
      filter: ['match', ['get', 'class'], ['hospital', 'school', 'university', 'stadium'], true, false],
      paint: {
        'fill-color': [
          'match',
          ['get', 'class'],
          'hospital',
          '#271728',
          'school',
          '#1f2440',
          'university',
          '#1f2440',
          '#221b3b',
        ],
        'fill-opacity': 0.72,
      },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: {
        'fill-color': '#08364a',
      },
    },
    {
      id: 'waterway',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'waterway',
      paint: {
        'line-color': '#0ea5e9',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.6, 14, 2.8],
        'line-opacity': 0.62,
      },
    },
    {
      id: 'aeroway',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'aeroway',
      paint: {
        'line-color': '#263247',
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2, 14, 8],
      },
    },
    {
      id: 'buildings',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'building',
      minzoom: 13,
      paint: {
        'fill-color': '#111827',
        'fill-outline-color': '#263247',
      },
    },
    {
      id: 'minor-road-casing',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 11,
      filter: ['match', ['get', 'class'], ['minor', 'service', 'track', 'path'], true, false],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#0b1220',
        'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1.6, 14, 7.6],
      },
    },
    {
      id: 'minor-road',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 11,
      filter: ['match', ['get', 'class'], ['minor', 'service', 'track', 'path'], true, false],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#253047',
        'line-width': ['interpolate', ['linear'], ['zoom'], 11, 0.8, 14, 5.4],
      },
    },
    {
      id: 'secondary-road-casing',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['match', ['get', 'class'], ['secondary', 'tertiary'], true, false],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#070b13',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 1.5, 14, 9.5],
      },
    },
    {
      id: 'secondary-road',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['match', ['get', 'class'], ['secondary', 'tertiary'], true, false],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#3b4a6b',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.7, 14, 6.4],
      },
    },
    {
      id: 'primary-road-casing',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['match', ['get', 'class'], ['primary', 'trunk', 'motorway'], true, false],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#070b13',
        'line-width': ['interpolate', ['linear'], ['zoom'], 7, 2.2, 14, 13],
      },
    },
    {
      id: 'primary-road',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['match', ['get', 'class'], ['primary', 'trunk', 'motorway'], true, false],
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': '#6d5dfc',
        'line-width': ['interpolate', ['linear'], ['zoom'], 7, 1.2, 14, 8.6],
      },
    },
    {
      id: 'rail',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', ['get', 'class'], 'rail'],
      paint: {
        'line-color': '#6b7280',
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.6, 14, 2.2],
        'line-dasharray': [0.4, 0.8],
      },
    },
    {
      id: 'boundary',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      paint: {
        'line-color': '#263247',
        'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.4, 12, 1.2],
        'line-dasharray': [2, 2],
      },
    },
    {
      id: 'road-labels',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'transportation_name',
      minzoom: 12,
      layout: {
        'symbol-placement': 'line',
        'text-field': ['coalesce', ['get', 'name'], ['get', 'name_en'], ['get', 'ref']],
        'text-font': ['Open Sans Regular'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 12, 10, 14, 12],
      },
      paint: {
        'text-color': '#cbd5e1',
        'text-halo-color': '#05070d',
        'text-halo-width': 1.6,
      },
    },
    {
      id: 'poi-labels',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'poi',
      minzoom: 13,
      layout: {
        'text-field': ['coalesce', ['get', 'name'], ['get', 'name_en']],
        'text-font': ['Open Sans Regular'],
        'text-size': 11,
        'text-offset': [0, 0.7],
        'text-anchor': 'top',
      },
      paint: {
        'text-color': '#a7f3d0',
        'text-halo-color': '#05070d',
        'text-halo-width': 1.4,
      },
    },
    {
      id: 'place-labels',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      layout: {
        'text-field': ['coalesce', ['get', 'name'], ['get', 'name_en']],
        'text-font': ['Open Sans Semibold'],
        'text-size': ['interpolate', ['linear'], ['zoom'], 5, 11, 14, 18],
      },
      paint: {
        'text-color': '#e0f2fe',
        'text-halo-color': '#05070d',
        'text-halo-width': 1.6,
      },
    },
  ],
};
