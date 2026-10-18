import type { Metadata } from 'next';
import { KokendeApp } from '@/components/KokendeApp';
import type { VehicleMode } from '@/data/route_segments';

export const metadata: Metadata = {
  title: 'Démo Gombe → Ndjili',
  description:
    'Trajet démo : corridor Lumumba embouteillé vs voie libre (voiture) ou wewa (moto). Données seedées + signalements locaux.',
};

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const sp = await searchParams;
  const vehicle: VehicleMode = sp.mode === 'moto' ? 'moto' : 'car';
  return (
    <KokendeApp
      initialOrigin="gombe"
      initialDest="airport"
      demoBanner
      initialVehicle={vehicle}
    />
  );
}
