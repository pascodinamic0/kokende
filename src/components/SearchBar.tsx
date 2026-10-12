'use client';

import { useMemo, useState } from 'react';
import { MapPin, Navigation, X, ArrowUpDown } from 'lucide-react';
import { COMMUNE_CHIPS, getPlace, searchPlaces, type Place } from '@/data/communes';
import { Chip } from './ui';
import clsx from 'clsx';

export interface SearchBarProps {
  originId: string | null;
  destId: string | null;
  onOrigin: (id: string | null) => void;
  onDest: (id: string | null) => void;
  onSwap: () => void;
  focusField?: 'origin' | 'dest';
}

export function SearchBar({
  originId,
  destId,
  onOrigin,
  onDest,
  onSwap,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<'origin' | 'dest' | null>(null);

  const results = useMemo(() => (editing ? searchPlaces(query) : []), [editing, query]);
  const origin = originId ? getPlace(originId) : null;
  const dest = destId ? getPlace(destId) : null;

  function pick(p: Place) {
    if (editing === 'origin') onOrigin(p.id);
    else if (editing === 'dest') onDest(p.id);
    setEditing(null);
    setQuery('');
  }

  function chipTarget(id: string) {
    if (!originId) onOrigin(id);
    else if (!destId) onDest(id);
    else onDest(id);
  }

  return (
    <div className="space-y-3">
      <div className="rounded-3xl bg-surface/95 border border-line shadow-card backdrop-blur p-3">
        <div className="flex gap-2">
          <div className="flex flex-col items-center pt-3 pb-1 gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-ink" />
            <span className="w-px flex-1 bg-line" />
            <MapPin className="h-3.5 w-3.5 text-brand" />
          </div>
          <div className="flex-1 space-y-1.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                setEditing('origin');
                setQuery('');
              }}
              className={clsx(
                'w-full text-left rounded-xl px-3 py-2.5 transition-colors',
                editing === 'origin' ? 'bg-brand-soft' : 'hover:bg-surface-2',
              )}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Départ</div>
              <div className="truncate font-semibold text-[15px]">
                {origin?.name ?? 'Où partez-vous ?'}
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing('dest');
                setQuery('');
              }}
              className={clsx(
                'w-full text-left rounded-xl px-3 py-2.5 transition-colors',
                editing === 'dest' ? 'bg-brand-soft' : 'hover:bg-surface-2',
              )}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted">Arrivée</div>
              <div className="truncate font-semibold text-[15px]">
                {dest?.name ?? 'Où allez-vous ?'}
              </div>
            </button>
          </div>
          <button
            type="button"
            aria-label="Inverser"
            onClick={onSwap}
            className="self-center shrink-0 h-10 w-10 rounded-xl border border-line bg-surface-2 flex items-center justify-center text-muted hover:text-ink"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
        </div>

        {editing && (
          <div className="mt-2 border-t border-line pt-2">
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Commune, aéroport, lieu…"
                className="w-full rounded-xl bg-surface-2 border border-line pl-9 pr-9 py-2.5 text-sm outline-none focus:border-brand"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted"
                onClick={() => {
                  setEditing(null);
                  setQuery('');
                }}
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="mt-1 max-h-48 overflow-y-auto">
              {results.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => pick(p)}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-surface-2 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4 text-muted shrink-0" />
                    <span className="font-medium text-sm">{p.name}</span>
                    <span className="ml-auto text-[11px] text-muted capitalize">{p.kind}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {COMMUNE_CHIPS.map((id) => {
          const p = getPlace(id);
          if (!p) return null;
          const active = originId === id || destId === id;
          return (
            <Chip key={id} active={active} onClick={() => chipTarget(id)}>
              {p.name.replace('Aéroport ', '')}
            </Chip>
          );
        })}
      </div>
    </div>
  );
}
