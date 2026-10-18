import type { LatLng } from './communes';

export type JamLevel = 0 | 1 | 2 | 3 | 4; // 0 libre → 4 bloqué
export type VehicleMode = 'car' | 'moto';
/** Road character — moto prefers wewa / informal / narrow to slip past car jams. */
export type SegmentKind = 'arterial' | 'wewa' | 'informal' | 'narrow';

export interface RoadSegment {
  id: string;
  name: string;
  corridor:
    | 'bd-30-juin'
    | 'lumumba'
    | 'university'
    | 'matadi-kibala'
    | 'local'
    | 'wewa';
  coords: LatLng[];
  /** Seeded jam severity for demo (0–4). Car-oriented seed; moto costs differ at route time. */
  seedJam: JamLevel;
  /** Approximate length in km. */
  km: number;
  /** Road character (default arterial). */
  kind: SegmentKind;
  /**
   * Vehicle classes that may use this segment.
   * Omit / both = car + moto. Moto-only wewa/informal stay out of car graphs.
   */
  vehicles: VehicleMode[];
}

/**
 * Shared Kinshasa route graph for car + moto.
 * Geometry is approximate polylines — not survey-grade.
 * Jam = seeded + local crowdsource, not live fleet GPS.
 */
export const ROUTE_SEGMENTS: RoadSegment[] = [
  // —— Bd du 30 Juin (Gombe ↔ Kintambo ↔ Ngaliema) ——
  {
    id: 'b30-gombe-kintambo',
    name: 'Bd du 30 Juin (Gombe → Kintambo)',
    corridor: 'bd-30-juin',
    coords: [
      [-4.3017, 15.3125],
      [-4.308, 15.3],
      [-4.315, 15.288],
      [-4.3225, 15.278],
    ],
    seedJam: 3,
    km: 4.2,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'b30-kintambo-ngaliema',
    name: 'Bd du 30 Juin (Kintambo → Ngaliema)',
    corridor: 'bd-30-juin',
    coords: [
      [-4.3225, 15.278],
      [-4.332, 15.262],
      [-4.345, 15.248],
    ],
    seedJam: 2,
    km: 4.0,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  // —— Blvd Lumumba (centre → Limete → Masina → Ndjili → aéroport) ——
  {
    id: 'lum-gombe-limete',
    name: 'Blvd Lumumba (Gombe → Limete)',
    corridor: 'lumumba',
    coords: [
      [-4.3017, 15.3125],
      [-4.318, 15.322],
      [-4.345, 15.332],
      [-4.372, 15.338],
    ],
    seedJam: 4,
    km: 7.5,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'lum-limete-masina',
    name: 'Blvd Lumumba (Limete → Masina)',
    corridor: 'lumumba',
    coords: [
      [-4.372, 15.338],
      [-4.378, 15.365],
      [-4.382, 15.395],
    ],
    seedJam: 3,
    km: 5.5,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'lum-masina-ndjili',
    name: 'Blvd Lumumba (Masina → Ndjili)',
    corridor: 'lumumba',
    coords: [
      [-4.382, 15.395],
      [-4.386, 15.415],
      [-4.39, 15.43],
    ],
    seedJam: 2,
    km: 3.5,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'lum-ndjili-airport',
    name: 'Accès aéroport Ndjili',
    corridor: 'lumumba',
    coords: [
      [-4.39, 15.43],
      [-4.387, 15.438],
      [-4.3857, 15.4446],
    ],
    seedJam: 1,
    km: 1.8,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  // —— Voie libre alternate: via Matete / Nord (bypass Lumumba jam) ——
  {
    id: 'alt-gombe-matete',
    name: 'Voie Est via Matete (Gombe → Matete)',
    corridor: 'local',
    coords: [
      [-4.3017, 15.3125],
      [-4.33, 15.335],
      [-4.36, 15.348],
      [-4.385, 15.355],
    ],
    seedJam: 1,
    km: 12.5,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'alt-matete-masina',
    name: 'Voie Est Matete → Masina',
    corridor: 'local',
    coords: [
      [-4.385, 15.355],
      [-4.383, 15.375],
      [-4.382, 15.395],
    ],
    seedJam: 0,
    km: 5.5,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  // —— Corridor Université (Gombe → Lemba / UNIKIN) ——
  {
    id: 'uni-gombe-lemba',
    name: 'Axe Université (Gombe → Lemba)',
    corridor: 'university',
    coords: [
      [-4.3017, 15.3125],
      [-4.335, 15.31],
      [-4.365, 15.308],
      [-4.398, 15.308],
    ],
    seedJam: 2,
    km: 11.0,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'uni-lemba-unikin',
    name: 'Campus UNIKIN',
    corridor: 'university',
    coords: [
      [-4.398, 15.308],
      [-4.415, 15.305],
    ],
    seedJam: 1,
    km: 2.0,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'uni-lemba-limete',
    name: 'Lemba → Limete',
    corridor: 'university',
    coords: [
      [-4.398, 15.308],
      [-4.385, 15.322],
      [-4.372, 15.338],
    ],
    seedJam: 1,
    km: 4.5,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  // —— Matadi–Kibala (Gombe → Ngaliema → Mont-Ngafula) ——
  {
    id: 'matadi-ngaliema-kibala',
    name: 'Route Matadi–Kibala',
    corridor: 'matadi-kibala',
    coords: [
      [-4.345, 15.248],
      [-4.37, 15.245],
      [-4.4, 15.25],
    ],
    seedJam: 2,
    km: 6.5,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'local-kintambo-bandal',
    name: 'Kintambo → Bandalungwa',
    corridor: 'local',
    coords: [
      [-4.3225, 15.278],
      [-4.335, 15.283],
      [-4.348, 15.288],
    ],
    seedJam: 1,
    km: 3.2,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'local-bandal-kasavubu',
    name: 'Bandal → Kasa-Vubu',
    corridor: 'local',
    coords: [
      [-4.348, 15.288],
      [-4.343, 15.295],
      [-4.338, 15.302],
    ],
    seedJam: 1,
    km: 2.0,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'local-kasavubu-gombe',
    name: 'Kasa-Vubu → Gombe',
    corridor: 'local',
    coords: [
      [-4.338, 15.302],
      [-4.32, 15.308],
      [-4.3017, 15.3125],
    ],
    seedJam: 2,
    km: 4.0,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },
  {
    id: 'local-limete-matete',
    name: 'Limete → Matete',
    corridor: 'local',
    coords: [
      [-4.372, 15.338],
      [-4.38, 15.348],
      [-4.385, 15.355],
    ],
    seedJam: 1,
    km: 2.5,
    kind: 'arterial',
    vehicles: ['car', 'moto'],
  },

  // —— Seed Kinshasa wewa / informal / narrow (moto-preferred bypasses) ——
  // Honest: approximate polylines for demo routing, not surveyed GPS tracks.
  {
    id: 'wewa-gombe-barumbu-limete',
    name: 'Wewa Barumbu (Gombe → Limete)',
    corridor: 'wewa',
    coords: [
      [-4.3017, 15.3125],
      [-4.312, 15.328],
      [-4.34, 15.334],
      [-4.372, 15.338],
    ],
    seedJam: 1,
    km: 8.2,
    kind: 'wewa',
    vehicles: ['moto'],
  },
  {
    id: 'wewa-limete-masina-nord',
    name: 'Wewa Nord Limete → Masina',
    corridor: 'wewa',
    coords: [
      [-4.372, 15.338],
      [-4.368, 15.36],
      [-4.37, 15.38],
      [-4.382, 15.395],
    ],
    seedJam: 0,
    km: 6.0,
    kind: 'wewa',
    vehicles: ['moto'],
  },
  {
    id: 'informal-masina-ndjili',
    name: 'Piste informelle Masina → Ndjili',
    corridor: 'wewa',
    coords: [
      [-4.382, 15.395],
      [-4.388, 15.41],
      [-4.39, 15.43],
    ],
    seedJam: 1,
    km: 3.8,
    kind: 'informal',
    vehicles: ['moto'],
  },
  {
    id: 'narrow-kintambo-kasavubu',
    name: 'Ruelle Kintambo → Kasa-Vubu',
    corridor: 'wewa',
    coords: [
      [-4.3225, 15.278],
      [-4.33, 15.29],
      [-4.338, 15.302],
    ],
    seedJam: 0,
    km: 3.0,
    kind: 'narrow',
    vehicles: ['moto'],
  },
  {
    id: 'wewa-gombe-lemba-est',
    name: 'Wewa Est Gombe → Lemba',
    corridor: 'wewa',
    coords: [
      [-4.3017, 15.3125],
      [-4.34, 15.318],
      [-4.37, 15.314],
      [-4.398, 15.308],
    ],
    seedJam: 1,
    km: 10.5,
    kind: 'wewa',
    vehicles: ['moto'],
  },
  {
    id: 'informal-bandal-lemba',
    name: 'Piste Bandal → Lemba',
    corridor: 'wewa',
    coords: [
      [-4.348, 15.288],
      [-4.37, 15.295],
      [-4.398, 15.308],
    ],
    seedJam: 1,
    km: 5.8,
    kind: 'informal',
    vehicles: ['moto'],
  },
  {
    id: 'narrow-matete-masina',
    name: 'Ruelle Matete → Masina',
    corridor: 'wewa',
    coords: [
      [-4.385, 15.355],
      [-4.384, 15.375],
      [-4.382, 15.395],
    ],
    seedJam: 0,
    km: 4.8,
    kind: 'narrow',
    vehicles: ['moto'],
  },
];

/** @deprecated Prefer ROUTE_SEGMENTS — kept as alias for existing imports. */
export const SEGMENTS = ROUTE_SEGMENTS;

export const CORRIDOR_LABELS: Record<RoadSegment['corridor'], string> = {
  'bd-30-juin': 'Bd du 30 Juin',
  lumumba: 'Blvd Lumumba',
  university: 'Axe Université',
  'matadi-kibala': 'Matadi–Kibala',
  local: 'Voie locale',
  wewa: 'Wewa / piste',
};

export const KIND_LABELS: Record<SegmentKind, string> = {
  arterial: 'Axe principal',
  wewa: 'Wewa',
  informal: 'Piste informelle',
  narrow: 'Ruelle',
};

export function getSegment(id: string): RoadSegment | undefined {
  return ROUTE_SEGMENTS.find((s) => s.id === id);
}

export function segmentsForVehicle(mode: VehicleMode): RoadSegment[] {
  return ROUTE_SEGMENTS.filter((s) => s.vehicles.includes(mode));
}
