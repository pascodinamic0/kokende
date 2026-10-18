'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  AlertTriangle,
  Layers,
  LocateFixed,
  Menu,
  Radio,
} from 'lucide-react';
import { getPlace } from '@/data/communes';
import { getSegment, type VehicleMode } from '@/data/route_segments';
import { db, getRecentReports } from '@/lib/db';
import { aggregateJamLevels } from '@/lib/jam';
import { computeRoutes, type RouteOption } from '@/lib/routing';
import { SearchBar } from './SearchBar';
import { RouteCards } from './RouteCards';
import { ReportSheet } from './ReportSheet';
import { JamLegend } from './JamLegend';
import { VehicleToggle } from './VehicleToggle';
import { AuthButton } from './AuthButton';
import { IconButton, Button, Badge } from './ui';
import clsx from 'clsx';

const MapView = dynamic(() => import('./MapView'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-surface-2 text-sm text-muted">
      Chargement de la carte…
    </div>
  ),
});

const VEHICLE_KEY = 'kokende-vehicle';

export interface KokendeAppProps {
  /** Prefill for demo */
  initialOrigin?: string | null;
  initialDest?: string | null;
  demoBanner?: boolean;
  /** Prefill vehicle mode (demo moto path). */
  initialVehicle?: VehicleMode;
}

export function KokendeApp({
  initialOrigin = null,
  initialDest = null,
  demoBanner = false,
  initialVehicle,
}: KokendeAppProps) {
  const [originId, setOriginId] = useState<string | null>(initialOrigin ?? null);
  const [destId, setDestId] = useState<string | null>(initialDest ?? null);
  const [vehicle, setVehicle] = useState<VehicleMode>(initialVehicle ?? 'car');
  const [showJam, setShowJam] = useState(true);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSeg, setReportSeg] = useState<string | null>(null);
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (initialVehicle) {
      setVehicle(initialVehicle);
      return;
    }
    try {
      const saved = localStorage.getItem(VEHICLE_KEY);
      if (saved === 'moto' || saved === 'car') setVehicle(saved);
    } catch {
      /* ignore */
    }
  }, [initialVehicle]);

  const setVehiclePersist = useCallback((v: VehicleMode) => {
    setVehicle(v);
    try {
      localStorage.setItem(VEHICLE_KEY, v);
    } catch {
      /* ignore */
    }
  }, []);

  const reportsRaw = useLiveQuery(() => getRecentReports(8), [tick]);
  const reports = useMemo(() => reportsRaw ?? [], [reportsRaw]);
  const jamLevels = useMemo(() => aggregateJamLevels(reports), [reports]);

  const routes = useMemo(() => {
    if (!originId || !destId) return [] as RouteOption[];
    return computeRoutes(originId, destId, jamLevels, vehicle);
  }, [originId, destId, jamLevels, vehicle]);

  useEffect(() => {
    if (routes.length) {
      const preferred = routes.find((r) => r.voieLibre) ?? routes[0]!;
      setActiveRouteId(preferred.id);
      setPanelOpen(true);
    } else {
      setActiveRouteId(null);
    }
  }, [routes]);

  const activeRoute = routes.find((r) => r.id === activeRouteId) ?? null;
  const alternateRoute =
    routes.find((r) => r.id !== activeRouteId) ?? null;

  const origin = originId ? getPlace(originId)?.coords ?? null : null;
  const destination = destId ? getPlace(destId)?.coords ?? null : null;

  const refresh = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    void db.reports.count();
  }, []);

  const motoReports = reports.filter((r) => r.source === 'moto').length;

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-bg">
      <div className="absolute inset-0 z-0">
        <MapView
          jamLevels={jamLevels}
          showJamLayer={showJam}
          activeRoute={activeRoute}
          alternateRoute={alternateRoute}
          origin={origin}
          destination={destination}
          vehicle={vehicle}
          onSegmentClick={(id) => {
            setReportSeg(id);
            setReportOpen(true);
          }}
        />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 pt-safe">
        <div className="pointer-events-auto px-3 pt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-2xl bg-surface/95 border border-line shadow-card backdrop-blur px-3 py-2"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand text-white font-black text-sm">
                K
              </div>
              <div>
                <div className="text-sm font-extrabold leading-none tracking-tight">Kokende</div>
                <div className="text-[10px] font-medium text-muted">
                  Kinshasa · {vehicle === 'moto' ? 'moto / wewa' : 'moins d\'embouteillage'}
                </div>
              </div>
            </Link>
            <div className="ml-auto flex gap-2">
              <AuthButton />
              <IconButton
                label="Couche trafic"
                onClick={() => setShowJam((v) => !v)}
                className={clsx(showJam && 'ring-2 ring-brand/40')}
              >
                <Layers className="h-5 w-5" />
              </IconButton>
              <Link href={vehicle === 'moto' ? '/demo?mode=moto' : '/demo'} className="contents">
                <IconButton label="Démo">
                  <Radio className="h-5 w-5" />
                </IconButton>
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            <VehicleToggle value={vehicle} onChange={setVehiclePersist} />
          </div>

          {demoBanner && (
            <div className="rounded-2xl bg-ink text-cream px-3.5 py-2.5 text-sm shadow-card flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
              <div>
                <strong className="font-bold">Mode démo</strong>
                {vehicle === 'moto' ? ' moto' : ''} — Gombe → Aéroport Ndjili.
                {vehicle === 'moto'
                  ? ' Préfère wewa / ruelles pour contourner Lumumba.'
                  : ' Données trafic '}
                {vehicle === 'car' && (
                  <>
                    <em>seedées + signalements locaux</em>, pas une flotte GPS live.
                  </>
                )}
                {vehicle === 'moto' && (
                  <> Trafic <em>seedé + local</em> — pas de flotte GPS.</>
                )}
              </div>
            </div>
          )}

          <SearchBar
            originId={originId}
            destId={destId}
            onOrigin={setOriginId}
            onDest={setDestId}
            onSwap={() => {
              setOriginId(destId);
              setDestId(originId);
            }}
          />
        </div>
      </div>

      <div className="absolute right-3 z-10" style={{ top: 'auto', bottom: panelOpen ? '42%' : '7.5rem' }}>
        <div className="flex flex-col items-end gap-2">
          <JamLegend />
          <IconButton label="Recentrer Kinshasa" onClick={() => {}}>
            <LocateFixed className="h-5 w-5" />
          </IconButton>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 pb-safe">
        <div className="mx-auto max-w-lg px-3 pb-3">
          <div className="rounded-3xl bg-surface/97 border border-line shadow-2xl backdrop-blur overflow-hidden">
            <button
              type="button"
              className="w-full flex items-center justify-center pt-2 pb-1"
              onClick={() => setPanelOpen((v) => !v)}
              aria-label="Réduire le panneau"
            >
              <span className="h-1 w-10 rounded-full bg-line" />
            </button>

            <div className={clsx('px-4 pb-4 transition-all', panelOpen ? 'block' : 'hidden')}>
              {!originId || !destId ? (
                <div className="py-2 text-center">
                  <p className="font-bold">Choisissez A → B</p>
                  <p className="text-sm text-muted mt-1">
                    {vehicle === 'moto'
                      ? 'En moto, Kokende privilégie wewa et ruelles pour contourner les files voiture.'
                      : 'Touchez une commune ou cherchez un lieu. Plus court vs voie libre.'}
                  </p>
                  <div className="mt-3 flex gap-2 justify-center flex-wrap">
                    <Badge tone="brand">OSM / Leaflet</Badge>
                    <Badge tone="warn">Trafic démo</Badge>
                    {vehicle === 'moto' && <Badge tone="ok">Wewa</Badge>}
                  </div>
                </div>
              ) : routes.length === 0 ? (
                <p className="text-sm text-muted py-3 text-center">
                  Pas d&apos;itinéraire sur le graphe MVP entre ces points. Essayez Gombe → Ndjili aéroport.
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-extrabold text-base">Itinéraires</h2>
                    <span className="text-xs text-muted">
                      {reports.length} signalement{reports.length !== 1 ? 's' : ''}
                      {motoReports > 0 ? ` · ${motoReports} moto` : ''}
                    </span>
                  </div>
                  <RouteCards
                    routes={routes}
                    activeId={activeRouteId}
                    onSelect={setActiveRouteId}
                  />
                  {activeRoute?.voieLibre && (
                    <p className="mt-2 text-xs text-ok font-medium leading-relaxed">
                      ✅ Voie libre recommandée : {activeRoute.why}
                    </p>
                  )}
                </>
              )}

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setReportSeg(activeRoute?.segmentIds[0] ?? null);
                    setReportOpen(true);
                  }}
                >
                  <Menu className="h-4 w-4" />
                  Signaler
                </Button>
                <Button
                  onClick={() => {
                    if (!originId || !destId) {
                      setOriginId('gombe');
                      setDestId('airport');
                    }
                  }}
                >
                  {originId && destId ? 'Recalculer' : 'Démo Gombe → Ndjili'}
                </Button>
              </div>

              <p className="mt-3 text-[10px] text-center text-muted leading-snug">
                Honnêteté : sévérité seedée + signalements Dexie
                {vehicle === 'moto' ? ' (tagués moto)' : ''}. Pas de flotte GPS live.
                {reportSeg && getSegment(reportSeg)
                  ? ` · Dernier axe : ${getSegment(reportSeg)!.name}`
                  : ''}
              </p>

              {/* Desktop-only mini legal — hidden on mobile per Boutik rules */}
              <nav className="mt-2 hidden md:flex justify-center gap-3 text-[10px] text-muted">
                <Link href="/privacy" className="underline">Confidentialité</Link>
                <Link href="/terms" className="underline">Conditions</Link>
                <Link href="/cookies" className="underline">Cookies</Link>
              </nav>
            </div>

            {!panelOpen && (
              <div className="px-4 pb-3 flex items-center justify-between">
                <span className="text-sm font-bold">
                  {activeRoute
                    ? `${activeRoute.label} · ${activeRoute.durationMin} min`
                    : 'Kokende'}
                </span>
                <Button size="sm" variant="soft" onClick={() => setPanelOpen(true)}>
                  Ouvrir
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportSheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        defaultSegmentId={reportSeg}
        vehicle={vehicle}
        onReported={refresh}
      />
    </div>
  );
}
