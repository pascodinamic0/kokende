import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Cookies',
  description: 'Politique cookies Kokende — Digni Digital LLC.',
};

export default function CookiesPage() {
  return (
    <LegalPage title="Politique cookies">
      <p>
        <strong>Dernière mise à jour :</strong> 18 octobre 2026
      </p>
      <p>
        Éditeur : <strong>Digni Digital LLC</strong> —{' '}
        <a href="mailto:contact@dignidigital.com">contact@dignidigital.com</a>.
      </p>

      <h2>1. Ce que nous utilisons</h2>
      <ul>
        <li>
          <strong>Consentement</strong> (<code>kokende-cookie-consent</code>) —
          localStorage, pour mémoriser votre choix.
        </li>
        <li>
          <strong>Préférence véhicule</strong> (<code>kokende-vehicle</code>) —
          Voiture ou Moto.
        </li>
        <li>
          <strong>Signalements</strong> — IndexedDB (Dexie), hors cookies HTTP.
        </li>
        <li>
          <strong>Session SSO</strong> — cookies Clerk uniquement si les clés
          OAuth sont configurées.
        </li>
      </ul>

      <h2>2. Cookies non utilisés</h2>
      <p>
        Pas de cookies publicitaires, pas de pixels de réseaux sociaux, pas de
        analytics marketing tiers dans ce MVP.
      </p>

      <h2>3. Gérer vos choix</h2>
      <p>
        Effacez les données du site dans les paramètres du navigateur pour
        réafficher la bannière et supprimer les signalements locaux.
      </p>
    </LegalPage>
  );
}
