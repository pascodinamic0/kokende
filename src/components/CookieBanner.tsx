'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from './ui';

const KEY = 'kokende-cookie-consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: 1, at: Date.now() }));
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[3000] p-3 pb-safe pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-lg rounded-2xl border border-line bg-surface/98 shadow-2xl backdrop-blur px-4 py-3.5">
        <p className="text-sm font-semibold leading-snug">
          Cookies essentiels &amp; préférences locales
        </p>
        <p className="mt-1 text-xs text-muted leading-relaxed">
          Kokende stocke le consentement, les signalements (IndexedDB) et le mode
          Voiture/Moto sur cet appareil. Pas de publicité tierce. Détails :{' '}
          <Link href="/cookies" className="underline font-semibold text-brand">
            Cookies
          </Link>
          ,{' '}
          <Link href="/privacy" className="underline font-semibold text-brand">
            Confidentialité
          </Link>
          .
        </p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" onClick={accept} className="flex-1 min-h-11">
            Accepter
          </Button>
          <Link href="/cookies" className="flex-1">
            <Button size="sm" variant="secondary" block className="min-h-11">
              En savoir plus
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
