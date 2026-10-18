import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Conditions d’utilisation',
  description: 'Conditions d’utilisation Kokende — Digni Digital LLC.',
};

export default function TermsPage() {
  return (
    <LegalPage title="Conditions d’utilisation">
      <p>
        <strong>Dernière mise à jour :</strong> 18 octobre 2026
      </p>
      <p>
        En utilisant Kokende (https://kokende.vercel.app), vous acceptez ces
        conditions. Éditeur : <strong>Digni Digital LLC</strong> (
        <a href="mailto:contact@dignidigital.com">contact@dignidigital.com</a>).
      </p>

      <h2>1. Service</h2>
      <p>
        Kokende propose des itinéraires indicatifs à Kinshasa (voiture et moto)
        à partir d&apos;un graphe routier simplifié et de niveaux
        d&apos;embouteillage <strong>seedés et/ou signalés localement</strong>.
        Ce n&apos;est <strong>pas</strong> une flotte GPS live, ni un service
        officiel de ministère ou de police.
      </p>

      <h2>2. Pas de garanties de circulation</h2>
      <p>
        Les ETA et la couche trafic sont des estimations de démonstration. Les
        conditions réelles (accidents, barrages, météo, chantiers) peuvent
        différer. Conduisez prudemment et respectez le code de la route
        congolais.
      </p>

      <h2>3. Comptes</h2>
      <p>
        L&apos;authentification, lorsqu&apos;elle est activée, se fait uniquement
        via <strong>Google</strong> ou <strong>Apple</strong> (Clerk). Aucune
        inscription e-mail / mot de passe n&apos;est proposée.
      </p>

      <h2>4. Signalements</h2>
      <p>
        Les signalements sont stockés sur votre appareil. Ne soumettez pas de
        contenu illégal ou trompeur. Vous restez responsable de ce que vous
        signalez.
      </p>

      <h2>5. Limitation de responsabilité</h2>
      <p>
        Dans les limites autorisées par la loi, Digni Digital LLC n&apos;est pas
        responsable des retards, courses perdues, accidents ou décisions prises
        sur la base des itinéraires affichés.
      </p>

      <h2>6. Contact</h2>
      <p>
        <a href="mailto:contact@dignidigital.com">contact@dignidigital.com</a>
      </p>
    </LegalPage>
  );
}
