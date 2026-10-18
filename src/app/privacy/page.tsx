import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Confidentialité',
  description: 'Politique de confidentialité Kokende — Digni Digital LLC.',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <p>
        <strong>Dernière mise à jour :</strong> 18 octobre 2026
      </p>
      <p>
        Kokende est édité par <strong>Digni Digital LLC</strong>. Contact :{' '}
        <a href="mailto:contact@dignidigital.com">contact@dignidigital.com</a>.
      </p>

      <h2>1. Données que nous traitons</h2>
      <ul>
        <li>
          <strong>Sur votre appareil</strong> : signalements d&apos;embouteillage
          (IndexedDB / Dexie), mode Voiture ou Moto, consentement cookies.
        </li>
        <li>
          <strong>Compte (si SSO activé)</strong> : identifiant et profil fournis
          par Google ou Apple via Clerk — jamais de mot de passe e-mail stocké par
          Kokende.
        </li>
        <li>
          <strong>Technique</strong> : logs d&apos;hébergement (Vercel) usuels
          (IP, user-agent) pour la sécurité et la disponibilité.
        </li>
      </ul>

      <h2>2. Ce que nous ne faisons pas</h2>
      <ul>
        <li>Pas de vente de données personnelles.</li>
        <li>Pas de tracking publicitaire tiers.</li>
        <li>
          Pas de flotte GPS live ni de géolocalisation continue en arrière-plan
          sans action de votre part.
        </li>
      </ul>

      <h2>3. Finalités</h2>
      <p>
        Fournir la navigation A→B, agréger des signalements locaux pour afficher
        une couche trafic <em>seedée + crowdsourcée</em>, et authentifier les
        utilisateurs via Google / Apple lorsque Clerk est configuré.
      </p>

      <h2>4. Conservation</h2>
      <p>
        Les signalements restent sur votre appareil jusqu&apos;à suppression du
        stockage du site. Les données de compte SSO suivent la politique Clerk /
        du fournisseur d&apos;identité.
      </p>

      <h2>5. Vos droits</h2>
      <p>
        Selon votre juridiction, vous pouvez demander l&apos;accès, la
        correction ou la suppression. Écrivez à{' '}
        <a href="mailto:contact@dignidigital.com">contact@dignidigital.com</a>.
      </p>

      <h2>6. Contact</h2>
      <p>
        Digni Digital LLC<br />
        <a href="mailto:contact@dignidigital.com">contact@dignidigital.com</a>
      </p>
    </LegalPage>
  );
}
