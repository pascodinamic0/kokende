import { SEGMENTS, type JamLevel, type RoadSegment } from '@/data/arteries';
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
  for (const seg of SEGMENTS) {
    const list = bySeg.get(seg.id) ?? [];
    if (list.length === 0) {
      out.set(seg.id, seg.seedJam);
      continue;
    }
    // Weight recent reports more; average deltas over last N
    const avgDelta =
      list.reduce((sum, r) => sum + REPORT_DELTA[r.type], 0) / list.length;
    out.set(seg.id, clampJam(seg.seedJam + avgDelta));
  }
  return out;
}

export function jamCostMultiplier(level: JamLevel): number {
  // Travel-time multiplier used by least-jam router
  return [1.0, 1.25, 1.7, 2.6, 4.5][level];
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
    .map((x) => `${x.s.name.split('(')[0].trim()} : ${JAM_LABELS[x.lvl].toLowerCase()}`)
    .join(' · ');
}
