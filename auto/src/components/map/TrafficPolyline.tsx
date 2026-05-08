import React from 'react';
import { Polyline } from 'react-native-maps';

import { THEME } from '../../theme';
import type { TrafficSegment } from '../../types';

type TrafficPolylineProps = {
  segment: TrafficSegment;
};

const colors = {
  severe: THEME.colors.danger,
  moderate: THEME.colors.warning,
  clear: THEME.colors.safe,
};

const widths = {
  severe: 6,
  moderate: 5,
  clear: 4,
};

export function TrafficPolyline({ segment }: TrafficPolylineProps) {
  return (
    <Polyline
      coordinates={segment.coordinates}
      lineCap="round"
      lineDashPattern={segment.level === 'moderate' ? [10, 8] : undefined}
      lineJoin="round"
      strokeColor={colors[segment.level]}
      strokeWidth={widths[segment.level]}
    />
  );
}
