import type { LatLng } from '@/data/communes';

const R = 6371; // km

export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function nearestPointOnSegments(
  point: LatLng,
  segments: { id: string; coords: LatLng[] }[],
): { segmentId: string; distKm: number; nearest: LatLng } | null {
  let best: { segmentId: string; distKm: number; nearest: LatLng } | null = null;
  for (const seg of segments) {
    for (const c of seg.coords) {
      const d = haversineKm(point, c);
      if (!best || d < best.distKm) {
        best = { segmentId: seg.id, distKm: d, nearest: c };
      }
    }
  }
  return best;
}

/** Flatten polyline from segment coords (dedupe shared nodes). */
export function mergeCoords(parts: LatLng[][]): LatLng[] {
  const out: LatLng[] = [];
  for (const part of parts) {
    for (const p of part) {
      const last = out[out.length - 1];
      if (!last || last[0] !== p[0] || last[1] !== p[1]) out.push(p);
    }
  }
  return out;
}
