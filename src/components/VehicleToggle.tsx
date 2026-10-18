'use client';

import clsx from 'clsx';
import { Bike, Car } from 'lucide-react';
import type { VehicleMode } from '@/data/route_segments';

export function VehicleToggle({
  value,
  onChange,
}: {
  value: VehicleMode;
  onChange: (v: VehicleMode) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Mode de déplacement"
      className="inline-flex rounded-2xl border border-line bg-surface/95 p-1 shadow-card backdrop-blur"
    >
      {(
        [
          { id: 'car' as const, label: 'Voiture', Icon: Car },
          { id: 'moto' as const, label: 'Moto', Icon: Bike },
        ] as const
      ).map(({ id, label, Icon }) => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(id)}
            className={clsx(
              'inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3.5 text-sm font-bold transition-colors',
              active
                ? id === 'moto'
                  ? 'bg-ink text-cream'
                  : 'bg-brand text-brand-ink'
                : 'text-muted hover:text-ink hover:bg-surface-2',
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
