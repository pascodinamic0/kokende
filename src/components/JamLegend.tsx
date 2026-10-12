'use client';

import { JAM_COLORS, JAM_LABELS } from '@/lib/jam';
import type { JamLevel } from '@/data/arteries';

export function JamLegend({ compact }: { compact?: boolean }) {
  const levels = [0, 1, 2, 3, 4] as JamLevel[];
  return (
    <div
      className={
        compact
          ? 'flex items-center gap-1.5'
          : 'flex flex-wrap items-center gap-2 rounded-2xl bg-surface/95 px-3 py-2 shadow-card border border-line/80 backdrop-blur'
      }
    >
      {!compact && <span className="text-xs font-bold text-muted mr-1">Trafic</span>}
      {levels.map((l) => (
        <div key={l} className="flex items-center gap-1" title={JAM_LABELS[l]}>
          <span
            className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
            style={{ background: JAM_COLORS[l] }}
          />
          {!compact && <span className="text-[11px] font-medium text-muted">{JAM_LABELS[l]}</span>}
        </div>
      ))}
    </div>
  );
}
