'use client';

import { useEffect, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { segmentsForVehicle, type VehicleMode, type JamLevel } from '@/data/route_segments';
import { KINSHASA_CENTER, DEFAULT_ZOOM, type LatLng } from '@/data/communes';
import { JAM_COLORS, JAM_LABELS } from '@/lib/jam';
import { KIND_LABELS } from '@/data/route_segments';
import type { RouteOption } from '@/lib/routing';
import 'leaflet/dist/leaflet.css';

function FitBounds({ coords }: { coords: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length < 2) return;
    const b = L.latLngBounds(coords.map((c) => L.latLng(c[0], c[1])));
    map.fitBounds(b, { padding: [60, 60], maxZoom: 14 });
  }, [coords, map]);
  return null;
}

function pinIcon(color: string, label: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};color:#fff;font-weight:800;font-size:11px;
      width:28px;height:28px;border-radius:50% 50% 50% 4px;transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 4px 12px rgba(0,0,0,.25);border:2px solid #fff;
    "><span style="transform:rotate(45deg)">${label}</span></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
  });
}

export interface MapViewProps {
  jamLevels: Map<string, JamLevel>;
  showJamLayer: boolean;
  activeRoute?: RouteOption | null;
  alternateRoute?: RouteOption | null;
  origin?: LatLng | null;
  destination?: LatLng | null;
  vehicle?: VehicleMode;
  onSegmentClick?: (segmentId: string) => void;
  className?: string;
}

export default function MapView({
  jamLevels,
  showJamLayer,
  activeRoute,
  alternateRoute,
  origin,
  destination,
  vehicle = 'car',
  onSegmentClick,
  className,
}: MapViewProps) {
  const segments = useMemo(() => segmentsForVehicle(vehicle), [vehicle]);

  const fitCoords = useMemo(() => {
    if (activeRoute?.coords?.length) return activeRoute.coords;
    if (origin && destination) return [origin, destination];
    return [];
  }, [activeRoute, origin, destination]);

  return (
    <MapContainer
      center={KINSHASA_CENTER}
      zoom={DEFAULT_ZOOM}
      className={className ?? 'h-full w-full'}
      zoomControl={false}
      attributionControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      {showJamLayer &&
        segments.map((seg) => {
          const lvl = jamLevels.get(seg.id) ?? seg.seedJam;
          const isWewa = seg.kind !== 'arterial';
          return (
            <Polyline
              key={`jam-${seg.id}`}
              positions={seg.coords}
              pathOptions={{
                color: JAM_COLORS[lvl],
                weight: isWewa ? 4 : 5,
                opacity: isWewa ? 0.7 : 0.85,
                dashArray: isWewa ? '4 6' : undefined,
                lineCap: 'round',
              }}
              eventHandlers={{
                click: () => onSegmentClick?.(seg.id),
              }}
            >
              <Popup>
                <strong>{seg.name}</strong>
                <br />
                {KIND_LABELS[seg.kind]} · Trafic : {JAM_LABELS[lvl]}
              </Popup>
            </Polyline>
          );
        })}

      {alternateRoute && alternateRoute.id !== activeRoute?.id && (
        <Polyline
          positions={alternateRoute.coords}
          pathOptions={{
            color: '#94a3b8',
            weight: 5,
            opacity: 0.55,
            dashArray: '8 10',
            lineCap: 'round',
          }}
        />
      )}

      {activeRoute && (
        <Polyline
          positions={activeRoute.coords}
          pathOptions={{
            color: activeRoute.voieLibre ? '#16a34a' : '#0ea5e9',
            weight: 7,
            opacity: 0.95,
            lineCap: 'round',
          }}
        />
      )}

      {origin && (
        <Marker position={origin} icon={pinIcon('#0f172a', 'A')}>
          <Popup>Départ</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={destination} icon={pinIcon('#e11d48', 'B')}>
          <Popup>Arrivée</Popup>
        </Marker>
      )}

      {origin && (
        <CircleMarker
          center={origin}
          radius={6}
          pathOptions={{ color: '#0f172a', fillColor: '#0f172a', fillOpacity: 1 }}
        />
      )}

      {fitCoords.length >= 2 && <FitBounds coords={fitCoords} />}
    </MapContainer>
  );
}
