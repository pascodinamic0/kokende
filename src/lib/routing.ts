import { SEGMENTS, getSegment, type JamLevel, type RoadSegment } from '@/data/arteries';
import { PLACES, getPlace, type LatLng } from '@/data/communes';
import { haversineKm, mergeCoords } from './geo';
import { jamCostMultiplier, describeJamWhy } from './jam';

export type RouteMode = 'shortest' | 'least-jam';

export interface RouteOption {
  id: string;
  mode: RouteMode;
  label: string;
  subtitle: string;
  segmentIds: string[];
  coords: LatLng[];
  distanceKm: number;
  /** Estimated minutes with jam multipliers. */
  durationMin: number;
  /** Peak jam on path. */
  maxJam: JamLevel;
  why: string;
  /** True when this is the recommended least-jam alternate. */
  voieLibre?: boolean;
}

/** Node id = place id or synthetic "seg:endpoint" — we key graph by place ids near segment ends. */
type NodeId = string;

interface Edge {
  to: NodeId;
  segmentId: string;
  km: number;
  reverse: boolean;
}

function nearestPlace(coords: LatLng, maxKm = 2.5): string | null {
  let best: { id: string; d: number } | null = null;
  for (const p of PLACES) {
    const d = haversineKm(coords, p.coords);
    if (d <= maxKm && (!best || d < best.d)) best = { id: p.id, d };
  }
  return best?.id ?? null;
}

function buildGraph(): Map<NodeId, Edge[]> {
  const g = new Map<NodeId, Edge[]>();
  const add = (from: NodeId, edge: Edge) => {
    const list = g.get(from) ?? [];
    list.push(edge);
    g.set(from, list);
  };

  for (const seg of SEGMENTS) {
    const start = nearestPlace(seg.coords[0]!);
    const end = nearestPlace(seg.coords[seg.coords.length - 1]!);
    if (!start || !end || start === end) continue;
    add(start, { to: end, segmentId: seg.id, km: seg.km, reverse: false });
    add(end, { to: start, segmentId: seg.id, km: seg.km, reverse: true });
  }
  return g;
}

const GRAPH = buildGraph();

function pathCost(
  segmentIds: string[],
  levels: Map<string, JamLevel>,
): { km: number; time: number; maxJam: JamLevel } {
  let km = 0;
  let time = 0;
  let maxJam: JamLevel = 0;
  const baseSpeedKmh = 28; // urban Kinshasa demo average
  for (const id of segmentIds) {
    const seg = getSegment(id);
    if (!seg) continue;
    const jam = levels.get(id) ?? seg.seedJam;
    maxJam = Math.max(maxJam, jam) as JamLevel;
    km += seg.km;
    // Always show jam-aware ETA so users see why voie libre wins
    time += (seg.km / baseSpeedKmh) * 60 * jamCostMultiplier(jam);
  }
  return { km, time, maxJam };
}

function dijkstra(
  from: NodeId,
  to: NodeId,
  levels: Map<string, JamLevel>,
  mode: RouteMode,
): string[] | null {
  const dist = new Map<NodeId, number>();
  const prev = new Map<NodeId, { node: NodeId; segmentId: string }>();
  const pq: { node: NodeId; cost: number }[] = [{ node: from, cost: 0 }];
  dist.set(from, 0);

  while (pq.length) {
    pq.sort((a, b) => a.cost - b.cost);
    const cur = pq.shift()!;
    if (cur.node === to) break;
    if (cur.cost > (dist.get(cur.node) ?? Infinity)) continue;
    for (const e of GRAPH.get(cur.node) ?? []) {
      const seg = getSegment(e.segmentId)!;
      const jam = levels.get(e.segmentId) ?? seg.seedJam;
      const edgeCost =
        mode === 'shortest'
          ? e.km
          : e.km * jamCostMultiplier(jam);
      const next = cur.cost + edgeCost;
      if (next < (dist.get(e.to) ?? Infinity)) {
        dist.set(e.to, next);
        prev.set(e.to, { node: cur.node, segmentId: e.segmentId });
        pq.push({ node: e.to, cost: next });
      }
    }
  }

  if (!prev.has(to) && from !== to) return null;
  const segs: string[] = [];
  let n: NodeId | undefined = to;
  while (n && n !== from) {
    const p = prev.get(n);
    if (!p) break;
    segs.unshift(p.segmentId);
    n = p.node;
  }
  return segs;
}

function coordsForPath(segmentIds: string[], from: LatLng, to: LatLng): LatLng[] {
  const parts: LatLng[][] = [];
  let cursor = from;
  for (const id of segmentIds) {
    const seg = getSegment(id);
    if (!seg) continue;
    const start = seg.coords[0]!;
    const end = seg.coords[seg.coords.length - 1]!;
    const dStart = haversineKm(cursor, start);
    const dEnd = haversineKm(cursor, end);
    if (dEnd < dStart) {
      parts.push([...seg.coords].reverse());
      cursor = start;
    } else {
      parts.push(seg.coords);
      cursor = end;
    }
  }
  const merged = mergeCoords(parts);
  // Ensure endpoints
  if (merged.length === 0) return [from, to];
  return [from, ...merged.slice(1, -1), to];
}

function resolvePlaceId(idOrName: string): string | null {
  if (getPlace(idOrName)) return idOrName;
  const found = PLACES.find(
    (p) => p.name.toLowerCase() === idOrName.toLowerCase() || p.id === idOrName,
  );
  return found?.id ?? null;
}

export function computeRoutes(
  originId: string,
  destId: string,
  levels: Map<string, JamLevel>,
): RouteOption[] {
  const from = resolvePlaceId(originId);
  const to = resolvePlaceId(destId);
  if (!from || !to || from === to) return [];

  const origin = getPlace(from)!;
  const dest = getPlace(to)!;

  const shortestSegs = dijkstra(from, to, levels, 'shortest');
  const leastJamSegs = dijkstra(from, to, levels, 'least-jam');

  const options: RouteOption[] = [];

  if (shortestSegs?.length) {
    const segs = shortestSegs.map((id) => getSegment(id)!).filter(Boolean);
    const { km, time, maxJam } = pathCost(shortestSegs, levels);
    options.push({
      id: 'shortest',
      mode: 'shortest',
      label: 'Plus court',
      subtitle: 'Distance minimale',
      segmentIds: shortestSegs,
      coords: coordsForPath(shortestSegs, origin.coords, dest.coords),
      distanceKm: Math.round(km * 10) / 10,
      durationMin: Math.round(time),
      maxJam,
      why: describeJamWhy(segs, levels),
    });
  }

  if (leastJamSegs?.length) {
    const segs = leastJamSegs.map((id) => getSegment(id)!).filter(Boolean);
    const { km, time, maxJam } = pathCost(leastJamSegs, levels);
    const sameAsShortest =
      shortestSegs &&
      shortestSegs.length === leastJamSegs.length &&
      shortestSegs.every((s, i) => s === leastJamSegs[i]);
    options.push({
      id: 'least-jam',
      mode: 'least-jam',
      label: sameAsShortest ? 'Moins embouteillé' : 'Voie libre',
      subtitle: sameAsShortest
        ? 'Même axe, coût trafic optimisé'
        : 'Évite les corridors saturés',
      segmentIds: leastJamSegs,
      coords: coordsForPath(leastJamSegs, origin.coords, dest.coords),
      distanceKm: Math.round(km * 10) / 10,
      durationMin: Math.round(time),
      maxJam,
      why: sameAsShortest
        ? describeJamWhy(segs, levels)
        : `Évite ${describeJamWhy(
            (shortestSegs ?? []).map((id) => getSegment(id)!).filter(Boolean),
            levels,
          )}`,
      voieLibre: !sameAsShortest,
    });
  }

  // Prefer showing least-jam first when it differs and is meaningfully faster
  return options.sort((a, b) => {
    if (a.voieLibre && !b.voieLibre) return -1;
    if (b.voieLibre && !a.voieLibre) return 1;
    return a.durationMin - b.durationMin;
  });
}

export function segmentsNear(point: LatLng, maxKm = 1.5): RoadSegment[] {
  return SEGMENTS
    .map((s) => ({
      s,
      d: Math.min(...s.coords.map((c) => haversineKm(point, c))),
    }))
    .filter((x) => x.d <= maxKm)
    .sort((a, b) => a.d - b.d)
    .map((x) => x.s);
}
