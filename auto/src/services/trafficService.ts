import { TRAFFIC_SEGMENTS } from '../data/mockData';
import type { TrafficSegment } from '../types';

const wait = (durationMs: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, durationMs);
  });

export async function getTrafficSegments(delayMs = 800): Promise<TrafficSegment[]> {
  await wait(delayMs);
  return TRAFFIC_SEGMENTS.map((segment) => ({
    ...segment,
    reportedAt: new Date(segment.reportedAt),
  }));
}
