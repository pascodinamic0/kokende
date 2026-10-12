import type { Metadata } from 'next';
import { KokendeApp } from '@/components/KokendeApp';

export const metadata: Metadata = {
  title: 'Démo Gombe → Ndjili',
  description:
    'Trajet démo : corridor Lumumba embouteillé vs voie libre via Matete. Données seedées + signalements locaux.',
};

export default function DemoPage() {
  return <KokendeApp initialOrigin="gombe" initialDest="airport" demoBanner />;
}
