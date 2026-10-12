# Kokende

**Kokende** (Lingala : *to go*) — PWA de navigation Kinshasa-first qui préfère la **voie libre** à la distance minimale.

## MVP

- Carte Kinshasa (OpenStreetMap + Leaflet)
- Recherche A→B + chips communes (Gombe, Limete, Ngaliema, Kintambo, Lemba, Masina, Ndjili…)
- Itinéraires **Plus court** vs **Moins embouteillé / Voie libre**
- Couche trafic seedée (Bd 30 Juin, Lumumba, Université, Matadi–Kibala) + signalements Dexie
- Signalement 1-tap : Embouteillage / Accident / Barrage / Route libre
- `/demo` — Gombe → Aéroport Ndjili
- UI français-first, mobile PWA, cache tuiles OSM léger

> **Honnêteté** : les niveaux d’embouteillage sont **seedés + crowdsourcés en local** (IndexedDB). Ce n’est pas une flotte GPS live.

## Stack

Next.js App Router · TypeScript · Tailwind · Leaflet · Dexie · PWA

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

## Démo

Ouvrir `/demo` pour le trajet Gombe → Ndjili (Lumumba saturé vs alternate Matete).
