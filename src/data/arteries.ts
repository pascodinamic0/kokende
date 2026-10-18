/**
 * Compatibility re-export — source of truth is `route_segments`.
 * Import from `@/data/route_segments` for new code.
 */
export {
  ROUTE_SEGMENTS,
  SEGMENTS,
  CORRIDOR_LABELS,
  KIND_LABELS,
  getSegment,
  segmentsForVehicle,
  type JamLevel,
  type VehicleMode,
  type SegmentKind,
  type RoadSegment,
} from './route_segments';
