import Dexie, { type Table } from 'dexie';
import type { VehicleMode } from '@/data/route_segments';

export type ReportType = 'embouteillage' | 'accident' | 'barrage' | 'route_libre';

export interface JamReport {
  id?: number;
  segmentId: string;
  type: ReportType;
  createdAt: number;
  /** Optional note */
  note?: string;
  /** Soft geo tag */
  lat?: number;
  lng?: number;
  /** Tag report as moto-sourced vs car (default car for legacy rows). */
  source?: VehicleMode;
}

export interface CachedTile {
  key: string;
  blob: Blob;
  savedAt: number;
}

class KokendeDB extends Dexie {
  reports!: Table<JamReport, number>;
  tiles!: Table<CachedTile, string>;

  constructor() {
    super('kokende');
    this.version(1).stores({
      reports: '++id, segmentId, type, createdAt',
      tiles: 'key, savedAt',
    });
    // v2: moto-sourced reports (source indexed for filters)
    this.version(2).stores({
      reports: '++id, segmentId, type, createdAt, source',
      tiles: 'key, savedAt',
    });
  }
}

export const db =
  typeof window !== 'undefined' ? new KokendeDB() : (null as unknown as KokendeDB);

export const REPORT_LABELS: Record<ReportType, string> = {
  embouteillage: 'Embouteillage',
  accident: 'Accident',
  barrage: 'Barrage',
  route_libre: 'Route libre',
};

export const REPORT_ICONS: Record<ReportType, string> = {
  embouteillage: '🚗',
  accident: '⚠️',
  barrage: '🚧',
  route_libre: '✅',
};

/** How a report type nudges jam level (−2 … +2). */
export const REPORT_DELTA: Record<ReportType, number> = {
  embouteillage: +2,
  accident: +3,
  barrage: +2,
  route_libre: -2,
};

export async function addReport(
  segmentId: string,
  type: ReportType,
  extra?: {
    note?: string;
    lat?: number;
    lng?: number;
    source?: VehicleMode;
  },
): Promise<number> {
  return db.reports.add({
    segmentId,
    type,
    createdAt: Date.now(),
    source: extra?.source ?? 'car',
    note: extra?.note,
    lat: extra?.lat,
    lng: extra?.lng,
  });
}

export async function getRecentReports(hours = 6): Promise<JamReport[]> {
  const since = Date.now() - hours * 3600_000;
  return db.reports.where('createdAt').above(since).toArray();
}

export async function getReportsForSegment(
  segmentId: string,
  hours = 6,
): Promise<JamReport[]> {
  const since = Date.now() - hours * 3600_000;
  return db.reports
    .where('segmentId')
    .equals(segmentId)
    .filter((r) => r.createdAt > since)
    .toArray();
}
