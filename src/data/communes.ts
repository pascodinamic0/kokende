export type LatLng = [number, number]; // [lat, lng]

export interface Place {
  id: string;
  name: string;
  kind: 'commune' | 'landmark' | 'airport';
  coords: LatLng;
  aliases?: string[];
}

/** Kinshasa communes + key landmarks (approx. centroids). */
export const PLACES: Place[] = [
  { id: 'gombe', name: 'Gombe', kind: 'commune', coords: [-4.3017, 15.3125], aliases: ['centre-ville', 'ville'] },
  { id: 'lingwala', name: 'Lingwala', kind: 'commune', coords: [-4.3220, 15.3080] },
  { id: 'barumbu', name: 'Barumbu', kind: 'commune', coords: [-4.3120, 15.3280] },
  { id: 'kintambo', name: 'Kintambo', kind: 'commune', coords: [-4.3225, 15.2780] },
  { id: 'ngaliema', name: 'Ngaliema', kind: 'commune', coords: [-4.3450, 15.2480], aliases: ['binza'] },
  { id: 'bandalungwa', name: 'Bandalungwa', kind: 'commune', coords: [-4.3480, 15.2880], aliases: ['bandal'] },
  { id: 'kasavubu', name: 'Kasa-Vubu', kind: 'commune', coords: [-4.3380, 15.3020] },
  { id: 'limete', name: 'Limete', kind: 'commune', coords: [-4.3720, 15.3380] },
  { id: 'lemba', name: 'Lemba', kind: 'commune', coords: [-4.3980, 15.3080], aliases: ['unikin'] },
  { id: 'ngaba', name: 'Ngaba', kind: 'commune', coords: [-4.3850, 15.3220] },
  { id: 'matete', name: 'Matete', kind: 'commune', coords: [-4.3850, 15.3550] },
  { id: 'masina', name: 'Masina', kind: 'commune', coords: [-4.3820, 15.3950] },
  { id: 'ndjili', name: 'Ndjili', kind: 'commune', coords: [-4.3900, 15.4300], aliases: ['n\'djili'] },
  { id: 'kimbanseke', name: 'Kimbanseke', kind: 'commune', coords: [-4.4200, 15.4100] },
  { id: 'mont-ngafula', name: 'Mont-Ngafula', kind: 'commune', coords: [-4.4000, 15.2500], aliases: ['kibala'] },
  { id: 'airport', name: 'Aéroport Ndjili', kind: 'airport', coords: [-4.3857, 15.4446], aliases: ['aéroport', 'fia', 'n\'djili airport'] },
  { id: 'unikin', name: 'Université de Kinshasa', kind: 'landmark', coords: [-4.4150, 15.3050], aliases: ['unikin', 'campus'] },
  { id: 'grand-marche', name: 'Grand Marché', kind: 'landmark', coords: [-4.3180, 15.3150] },
  { id: 'zoo', name: 'Zoo de Kinshasa', kind: 'landmark', coords: [-4.3550, 15.2950] },
];

export const COMMUNE_CHIPS = [
  'gombe',
  'limete',
  'ngaliema',
  'kintambo',
  'lemba',
  'masina',
  'ndjili',
  'airport',
  'bandalungwa',
  'matete',
] as const;

export const KINSHASA_CENTER: LatLng = [-4.3276, 15.3136];
export const DEFAULT_ZOOM = 12;

export function getPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

export function searchPlaces(q: string): Place[] {
  const s = q.trim().toLowerCase();
  if (!s) return PLACES.filter((p) => p.kind === 'commune' || p.kind === 'airport').slice(0, 8);
  return PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(s) ||
      p.aliases?.some((a) => a.toLowerCase().includes(s)) ||
      p.id.includes(s),
  ).slice(0, 10);
}
