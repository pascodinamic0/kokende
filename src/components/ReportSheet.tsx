'use client';

import { useEffect, useMemo, useState } from 'react';
import { segmentsForVehicle, getSegment, type VehicleMode } from '@/data/route_segments';
import {
  REPORT_ICONS,
  REPORT_LABELS,
  addReport,
  type ReportType,
} from '@/lib/db';
import { Button, Sheet, Badge } from './ui';
import clsx from 'clsx';

const TYPES: ReportType[] = ['embouteillage', 'accident', 'barrage', 'route_libre'];

export function ReportSheet({
  open,
  onClose,
  defaultSegmentId,
  vehicle = 'car',
  onReported,
}: {
  open: boolean;
  onClose: () => void;
  defaultSegmentId?: string | null;
  vehicle?: VehicleMode;
  onReported: () => void;
}) {
  const segments = useMemo(() => segmentsForVehicle(vehicle), [vehicle]);
  const [segmentId, setSegmentId] = useState(defaultSegmentId ?? segments[0]?.id ?? '');
  const [type, setType] = useState<ReportType>('embouteillage');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDone(false);
    if (defaultSegmentId && segments.some((s) => s.id === defaultSegmentId)) {
      setSegmentId(defaultSegmentId);
    } else if (segments[0]) {
      setSegmentId(segments[0].id);
    }
  }, [open, defaultSegmentId, segments]);

  async function submit() {
    if (!segmentId) return;
    setSaving(true);
    try {
      await addReport(segmentId, type, { source: vehicle });
      setDone(true);
      onReported();
      setTimeout(() => {
        setDone(false);
        onClose();
      }, 900);
    } finally {
      setSaving(false);
    }
  }

  const seg = getSegment(segmentId);

  return (
    <Sheet open={open} onClose={onClose} title="Signaler sur la route">
      <div className="flex items-center gap-2 mb-3">
        <Badge tone={vehicle === 'moto' ? 'ok' : 'brand'}>
          {vehicle === 'moto' ? 'Source moto' : 'Source voiture'}
        </Badge>
        <span className="text-xs text-muted">1 tap · hors ligne (cet appareil)</span>
      </div>
      <p className="text-sm text-muted mb-4">
        Enrichit la couche embouteillage locale (IndexedDB). Tag{' '}
        <strong>{vehicle === 'moto' ? 'moto' : 'voiture'}</strong> pour le routage.
      </p>

      <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
        Route
      </label>
      <select
        value={segmentId}
        onChange={(e) => setSegmentId(e.target.value)}
        className="w-full rounded-2xl border border-line bg-surface-2 px-3 py-3 text-sm font-medium mb-4 outline-none focus:border-brand min-h-11"
      >
        {segments.map((s) => (
          <option key={s.id} value={s.id}>
            {s.kind !== 'arterial' ? `[${s.kind}] ` : ''}
            {s.name}
          </option>
        ))}
      </select>

      <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
        Type
      </label>
      <div className="grid grid-cols-2 gap-2 mb-5">
        {TYPES.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={clsx(
              'rounded-2xl border px-3 py-3 text-left transition-colors min-h-14',
              type === t
                ? t === 'route_libre'
                  ? 'border-ok bg-ok-soft ring-1 ring-ok/40'
                  : 'border-brand bg-brand-soft ring-1 ring-brand/40'
                : 'border-line bg-surface hover:bg-surface-2',
            )}
          >
            <div className="text-xl">{REPORT_ICONS[t]}</div>
            <div className="mt-1 text-sm font-bold">{REPORT_LABELS[t]}</div>
          </button>
        ))}
      </div>

      {seg && (
        <p className="text-xs text-muted mb-3">
          Signalement sur <span className="font-semibold text-ink">{seg.name}</span>
        </p>
      )}

      <Button block size="lg" onClick={submit} loading={saving} variant={done ? 'ok' : 'primary'}>
        {done ? 'Merci !' : 'Envoyer le signalement'}
      </Button>
    </Sheet>
  );
}
