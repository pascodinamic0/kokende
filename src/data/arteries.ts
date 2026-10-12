import type { LatLng } from './communes';

export type JamLevel = 0 | 1 | 2 | 3 | 4; // 0 libre → 4 bloqué

export interface RoadSegment {
  id: string;
  name: string;
  corridor: 'bd-30-juin' | 'lumumba' | 'university' | 'matadi-kibala' | 'local';
  coords: LatLng[];
  /** Seeded jam severity for demo (0–4). */
  seedJam: JamLevel;
  /** Approximate length in km. */
  km: number;
}

/**
 * Simplified Kinshasa arterial graph for MVP routing.
 * Geometry is approximate polylines along real corridors — not survey-grade.
 */
export const SEGMENTS: RoadSegment[] = [
  // —— Bd du 30 Juin (Gombe ↔ Kintambo ↔ Ngaliema) ——
  {
    id: 'b30-gombe-kintambo',
    name: 'Bd du 30 Juin (Gombe → Kintambo)',
    corridor: 'bd-30-juin',
    coords: [
      [-4.3017, 15.3125],
      [-4.3080, 15.3000],
      [-4.3150, 15.2880],
      [-4.3225, 15.2780],
    ],
    seedJam: 3,
    km: 4.2,
  },
  {
    id: 'b30-kintambo-ngaliema',
    name: 'Bd du 30 Juin (Kintambo → Ngaliema)',
    corridor: 'bd-30-juin',
    coords: [
      [-4.3225, 15.2780],
      [-4.3320, 15.2620],
      [-4.3450, 15.2480],
    ],
    seedJam: 2,
    km: 4.0,
  },
  // —— Blvd Lumumba (centre → Limete → Masina → Ndjili → aéroport) ——
  {
    id: 'lum-gombe-limete',
    name: 'Blvd Lumumba (Gombe → Limete)',
    corridor: 'lumumba',
    coords: [
      [-4.3017, 15.3125],
      [-4.3180, 15.3220],
      [-4.3450, 15.3320],
      [-4.3720, 15.3380],
    ],
    seedJam: 4,
    km: 7.5,
  },
  {
    id: 'lum-limete-masina',
    name: 'Blvd Lumumba (Limete → Masina)',
    corridor: 'lumumba',
    coords: [
      [-4.3720, 15.3380],
      [-4.3780, 15.3650],
      [-4.3820, 15.3950],
    ],
    seedJam: 3,
    km: 5.5,
  },
  {
    id: 'lum-masina-ndjili',
    name: 'Blvd Lumumba (Masina → Ndjili)',
    corridor: 'lumumba',
    coords: [
      [-4.3820, 15.3950],
      [-4.3860, 15.4150],
      [-4.3900, 15.4300],
    ],
    seedJam: 2,
    km: 3.5,
  },
  {
    id: 'lum-ndjili-airport',
    name: 'Accès aéroport Ndjili',
    corridor: 'lumumba',
    coords: [
      [-4.3900, 15.4300],
      [-4.3870, 15.4380],
      [-4.3857, 15.4446],
    ],
    seedJam: 1,
    km: 1.8,
  },
  // —— Voie libre alternate: via Matete / Nord (bypass Lumumba jam) ——
  {
    id: 'alt-gombe-matete',
    name: 'Voie Est via Matete (Gombe → Matete)',
    corridor: 'local',
    coords: [
      [-4.3017, 15.3125],
      [-4.3300, 15.3350],
      [-4.3600, 15.3480],
      [-4.3850, 15.3550],
    ],
    seedJam: 1,
    km: 12.5,
  },
  {
    id: 'alt-matete-masina',
    name: 'Voie Est Matete → Masina',
    corridor: 'local',
    coords: [
      [-4.3850, 15.3550],
      [-4.3830, 15.3750],
      [-4.3820, 15.3950],
    ],
    seedJam: 0,
    km: 5.5,
  },
  // —— Corridor Université (Gombe → Lemba / UNIKIN) ——
  {
    id: 'uni-gombe-lemba',
    name: 'Axe Université (Gombe → Lemba)',
    corridor: 'university',
    coords: [
      [-4.3017, 15.3125],
      [-4.3350, 15.3100],
      [-4.3650, 15.3080],
      [-4.3980, 15.3080],
    ],
    seedJam: 2,
    km: 11.0,
  },
  {
    id: 'uni-lemba-unikin',
    name: 'Campus UNIKIN',
    corridor: 'university',
    coords: [
      [-4.3980, 15.3080],
      [-4.4150, 15.3050],
    ],
    seedJam: 1,
    km: 2.0,
  },
  {
    id: 'uni-lemba-limete',
    name: 'Lemba → Limete',
    corridor: 'university',
    coords: [
      [-4.3980, 15.3080],
      [-4.3850, 15.3220],
      [-4.3720, 15.3380],
    ],
    seedJam: 1,
    km: 4.5,
  },
  // —— Matadi–Kibala (Gombe → Ngaliema → Mont-Ngafula) ——
  {
    id: 'matadi-ngaliema-kibala',
    name: 'Route Matadi–Kibala',
    corridor: 'matadi-kibala',
    coords: [
      [-4.3450, 15.2480],
      [-4.3700, 15.2450],
      [-4.4000, 15.2500],
    ],
    seedJam: 2,
    km: 6.5,
  },
  {
    id: 'local-kintambo-bandal',
    name: 'Kintambo → Bandalungwa',
    corridor: 'local',
    coords: [
      [-4.3225, 15.2780],
      [-4.3350, 15.2830],
      [-4.3480, 15.2880],
    ],
    seedJam: 1,
    km: 3.2,
  },
  {
    id: 'local-bandal-kasavubu',
    name: 'Bandal → Kasa-Vubu',
    corridor: 'local',
    coords: [
      [-4.3480, 15.2880],
      [-4.3430, 15.2950],
      [-4.3380, 15.3020],
    ],
    seedJam: 1,
    km: 2.0,
  },
  {
    id: 'local-kasavubu-gombe',
    name: 'Kasa-Vubu → Gombe',
    corridor: 'local',
    coords: [
      [-4.3380, 15.3020],
      [-4.3200, 15.3080],
      [-4.3017, 15.3125],
    ],
    seedJam: 2,
    km: 4.0,
  },
  {
    id: 'local-limete-matete',
    name: 'Limete → Matete',
    corridor: 'local',
    coords: [
      [-4.3720, 15.3380],
      [-4.3800, 15.3480],
      [-4.3850, 15.3550],
    ],
    seedJam: 1,
    km: 2.5,
  },
];

export const CORRIDOR_LABELS: Record<RoadSegment['corridor'], string> = {
  'bd-30-juin': 'Bd du 30 Juin',
  lumumba: 'Blvd Lumumba',
  university: 'Axe Université',
  'matadi-kibala': 'Matadi–Kibala',
  local: 'Voie locale',
};

export function getSegment(id: string): RoadSegment | undefined {
  return SEGMENTS.find((s) => s.id === id);
}
