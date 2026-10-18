import {
  ROUTE_SEGMENTS,
  type JamLevel,
  type RoadSegment,
  type SegmentKind,
  type VehicleMode,
} from '@/data/route_segments';
import { REPORT_DELTA, type JamReport } from './db';

export function clampJam(n: number): JamLevel {
  return Math.max(0, Math.min(4, Math.round(n))) as JamLevel;
}

export const JAM_LABELS: Record<JamLevel, string> = {
  0: 'Libre',
  1: 'Fluide',
  2: 'Dense',
  3: 'Embouteillé',
  4: 'Bloqué',
};

export const JAM_COLORS: Record<JamLevel, string> = {
  0: '#16a34a',
  1: '#84cc16',
  2: '#eab308',
  3: '#f97316',
  4: '#dc2626',
};

/** Aggregate seed + crowdsourced reports into live jam levels. */
export function aggregateJamLevels(reports: JamReport[]): Map<string, JamLevel> {
  const bySeg = new Map<string, JamReport[]>();
  for (const r of reports) {
    const list = bySeg.get(r.segmentId) ?? [];
    list.push(r);
    bySeg.set(r.segmentId, list);
  }

  const out = new Map<string, JamLevel>();
  for (const seg of ROUTE_SEGMENTS) {
    const list = bySeg.get(seg.id) ?? [];
    if (list.length === 0) {
      out.set(seg.id, seg.seedJam);
      continue;
    }
    const avgDelta =
      list.reduce((sum, r) => sum + REPORT_DELTA[r.type], 0) / list.length;
    out.set(seg.id, clampJam(seg.seedJam + avgDelta));
  }
  return out;
}

const CAR_MULT: number[] = [1.0, 1.25, 1.7, 2.6, 4.5];
/** Moto on arterials — still slowed, but less than cars. */
const MOTO_ARTERIAL: number[] = [1.0, 1.1, 1.35, 1.9, 3.0];
/** Moto on wewa / informal / narrow — can filter past car queues. */
const MOTO_FILTER: number[] = [1.0, 1.05, 1.15, 1.35, 1.8];

/**
 * Travel-time multiplier. Moto jam costs differ so a moto can bypass car jams
 * when a wewa/informal/narrow alternate exists.
 */
export function jamCostMultiplier(
  level: JamLevel,
  vehicle: VehicleMode = 'car',
  kind: SegmentKind = 'arterial',
): number {
  if (vehicle === 'car') return CAR_MULT[level]!;
  if (kind === 'wewa' || kind === 'informal' || kind === 'narrow') {
    return MOTO_FILTER[level]!;
  }
  return MOTO_ARTERIAL[level]!;
}

export function describeJamWhy(
  segments: RoadSegment[],
  levels: Map<string, JamLevel>,
): string {
  const jammed = segments
    .map((s) => ({ s, lvl: levels.get(s.id) ?? s.seedJam }))
    .filter((x) => x.lvl >= 3)
    .sort((a, b) => b.lvl - a.lvl);
  if (jammed.length === 0) return 'Circulation globalement fluide sur cet itinéraire.';
  const top = jammed.slice(0, 2);
  return top
    .map((x) => `${x.s.name.split('(')[0]!.trim()} : ${JAM_LABELS[x.lvl].toLowerCase()}`)
    .join(' · ');
}
