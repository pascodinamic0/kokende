'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { CookieBanner } from './CookieBanner';

const HAS_CLERK = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-brand flex items-center justify-center text-white text-2xl font-black shadow-lg">
            K
          </div>
          <p className="text-sm font-semibold text-muted">Kokende</p>
        </div>
      </div>
    );
  }

  const body = (
    <>
      {children}
      <CookieBanner />
    </>
  );

  if (HAS_CLERK) {
    return <ClerkWrap>{body}</ClerkWrap>;
  }

  return body;
}

function ClerkWrap({ children }: { children: ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { ClerkProvider } = require('@clerk/nextjs') as typeof import('@clerk/nextjs');
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-in"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
