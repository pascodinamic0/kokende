'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserRound } from 'lucide-react';
import { IconButton, Button, Sheet } from './ui';

const HAS_CLERK =
  typeof process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY === 'string' &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.length > 0;

/**
 * Google + Apple SSO only. Never offers email/password.
 * When Clerk keys are missing, opens a sheet with setup docs.
 */
export function AuthButton() {
  const [open, setOpen] = useState(false);

  if (HAS_CLERK) {
    // Dynamic Clerk UI — loaded only when publishable key exists (build-safe).
    return <ClerkAuthControls />;
  }

  return (
    <>
      <IconButton label="Connexion" onClick={() => setOpen(true)}>
        <UserRound className="h-5 w-5" />
      </IconButton>
      <Sheet open={open} onClose={() => setOpen(false)} title="Connexion">
        <p className="text-sm text-muted mb-4">
          Kokende utilise uniquement <strong>Google</strong> et <strong>Apple</strong>.
          Pas d&apos;inscription e-mail / mot de passe.
        </p>
        <div className="space-y-2 mb-4">
          <Button
            block
            variant="secondary"
            disabled
            className="opacity-70"
            aria-disabled
          >
            Continuer avec Google
          </Button>
          <Button
            block
            variant="dark"
            disabled
            className="opacity-70"
            aria-disabled
          >
            Continuer avec Apple
          </Button>
        </div>
        <div className="rounded-2xl bg-gold-soft/80 border border-gold/30 px-3.5 py-3 text-sm text-ink">
          <p className="font-bold mb-1">SSO en attente de clés</p>
          <p className="text-muted text-xs leading-relaxed">
            Ajoutez <code className="text-[11px]">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> et{' '}
            <code className="text-[11px]">CLERK_SECRET_KEY</code>, activez Google + Apple
            dans le tableau Clerk, puis redéployez. Voir{' '}
            <Link href="/cookies" className="underline font-semibold text-brand">
              .env.example
            </Link>{' '}
            dans le dépôt.
          </p>
        </div>
        <Button block variant="ghost" className="mt-3" onClick={() => setOpen(false)}>
          Fermer
        </Button>
      </Sheet>
    </>
  );
}

function ClerkAuthControls() {
  // Lazy require pattern avoided — use Link to /sign-in which mounts Clerk
  return (
    <Link href="/sign-in" className="contents">
      <IconButton label="Connexion">
        <UserRound className="h-5 w-5" />
      </IconButton>
    </Link>
  );
}
