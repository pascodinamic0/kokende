import { KokendeApp } from '@/components/KokendeApp';
import type { VehicleMode } from '@/data/route_segments';

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const sp = await searchParams;
  const mode: VehicleMode | undefined =
    sp.mode === 'moto' ? 'moto' : sp.mode === 'car' ? 'car' : undefined;
  return <KokendeApp initialVehicle={mode} />;
}
