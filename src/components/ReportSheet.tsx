'use client';

import { useEffect, useState } from 'react';
import { SEGMENTS, getSegment } from '@/data/arteries';
import {
  REPORT_ICONS,
  REPORT_LABELS,
  addReport,
  type ReportType,
} from '@/lib/db';
import { Button, Sheet } from './ui';
import clsx from 'clsx';

const TYPES: ReportType[] = ['embouteillage', 'accident', 'barrage', 'route_libre'];

export function ReportSheet({
  open,
  onClose,
  defaultSegmentId,
  onReported,
}: {
  open: boolean;
  onClose: () => void;
  defaultSegmentId?: string | null;
  onReported: () => void;
}) {
  const [segmentId, setSegmentId] = useState(defaultSegmentId ?? SEGMENTS[0]?.id ?? '');
  const [type, setType] = useState<ReportType>('embouteillage');
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (open && defaultSegmentId) setSegmentId(defaultSegmentId);
    if (open) setDone(false);
  }, [open, defaultSegmentId]);

  async function submit() {
    if (!segmentId) return;
    setSaving(true);
    try {
      await addReport(segmentId, type);
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
      <p className="text-sm text-muted mb-4">
        Un tap pour enrichir la couche embouteillage locale (stockée sur cet appareil).
      </p>

      <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1.5">
        Route
      </label>
      <select
        value={segmentId}
        onChange={(e) => setSegmentId(e.target.value)}
        className="w-full rounded-2xl border border-line bg-surface-2 px-3 py-3 text-sm font-medium mb-4 outline-none focus:border-brand"
      >
        {SEGMENTS.map((s) => (
          <option key={s.id} value={s.id}>
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
              'rounded-2xl border px-3 py-3 text-left transition-colors',
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
