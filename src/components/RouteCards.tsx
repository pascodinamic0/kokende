'use client';

import clsx from 'clsx';
import { Clock, Route, Sparkles } from 'lucide-react';
import type { RouteOption } from '@/lib/routing';
import { JAM_COLORS, JAM_LABELS } from '@/lib/jam';
import { Badge } from './ui';

export function RouteCards({
  routes,
  activeId,
  onSelect,
}: {
  routes: RouteOption[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  if (!routes.length) return null;

  return (
    <div className="space-y-2">
      {routes.map((r) => {
        const active = r.id === activeId;
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onSelect(r.id)}
            className={clsx(
              'w-full text-left rounded-2xl border p-3.5 transition-all',
              active
                ? r.voieLibre
                  ? 'border-ok bg-ok-soft/60 shadow-md ring-1 ring-ok/30'
                  : 'border-info bg-info-soft/50 shadow-md ring-1 ring-info/30'
                : 'border-line bg-surface hover:bg-surface-2',
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={clsx(
                  'mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                  r.voieLibre ? 'bg-ok text-white' : 'bg-info text-white',
                )}
              >
                {r.voieLibre ? <Sparkles className="h-5 w-5" /> : <Route className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[15px]">{r.label}</span>
                  {r.voieLibre && <Badge tone="ok">Voie libre</Badge>}
                  {r.mode === 'shortest' && r.maxJam >= 3 && (
                    <Badge tone="danger">{JAM_LABELS[r.maxJam]}</Badge>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-muted line-clamp-2">{r.why}</p>
                <div className="mt-2 flex items-center gap-3 text-sm font-semibold">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-muted" />
                    {r.durationMin} min
                  </span>
                  <span className="text-muted font-medium">{r.distanceKm} km</span>
                  <span
                    className="ml-auto h-2.5 w-2.5 rounded-full"
                    style={{ background: JAM_COLORS[r.maxJam] }}
                    title={JAM_LABELS[r.maxJam]}
                  />
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
