# Kokende

**Kokende** (Lingala : *to go*) — PWA de navigation Kinshasa-first qui préfère la **voie libre** à la distance minimale. Voiture **et** moto (wewa / pistes informelles / ruelles).

## MVP

- Carte Kinshasa (OpenStreetMap + Leaflet)
- Recherche A→B + chips communes
- Toggle **Voiture | Moto** — moto privilégie wewa / informal / narrow ; coûts d’embouteillage distincts pour contourner les files voiture
- Itinéraires **Plus court** vs **Moins embouteillé / Voie libre**
- Couche trafic seedée (Bd 30 Juin, Lumumba, Université, Matadi–Kibala + wewa Kinshasa) + signalements Dexie (taguables **moto**)
- Signalement 1-tap hors ligne : Embouteillage / Accident / Barrage / Route libre
- SSO **Google + Apple** via Clerk (UI + docs si clés absentes — jamais e-mail/mot de passe)
- Lander COI (coût de l’inaction) pour moto-taxis coincés dans les jams
- Légal : `/privacy` `/terms` `/cookies` + bannière consentement · Digni Digital LLC
- `/demo` et `/demo?mode=moto`
- UI français-first, mobile PWA (viewport fixe sur le lander)

> **Honnêteté** : les niveaux d’embouteillage sont **seedés + crowdsourcés en local** (IndexedDB). Ce n’est **pas** une flotte GPS live, ni un partenariat ministériel.

## Stack

Next.js App Router · TypeScript · Tailwind · Leaflet · Dexie · Clerk (opt.) · PWA

## Routes

| Path | Rôle |
|------|------|
| `/` | Lander marketing (COI moto) |
| `/app` | Carte + routage (`?mode=moto`) |
| `/demo` | Démo Gombe → Ndjili (`?mode=moto`) |
| `/sign-in` | SSO Google / Apple |
| `/privacy` `/terms` `/cookies` | Légal |

## Env (OAuth réel)

Copier `.env.example` → `.env.local` :

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

Dans le dashboard Clerk : activer **Google** et **Apple**, **désactiver** e-mail/password.

Sans ces clés, l’app fonctionne ; les boutons SSO affichent les instructions de config.

## Dev

```bash
npm install
npm run icons
npm run dev
```

## Build

```bash
npm run build
```

## Live

- **App**: https://kokende.vercel.app
- **Carte**: https://kokende.vercel.app/app
- **Démo moto**: https://kokende.vercel.app/demo?mode=moto
- **GitHub**: https://github.com/pascodinamic0/kokende

## Module partagé

`src/data/route_segments.ts` — graphe artères + wewa pour voiture et moto (source de vérité ; `arteries.ts` réexporte).
