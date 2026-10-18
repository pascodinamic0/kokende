import Link from 'next/link';
import type { ReactNode } from 'react';

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-bg">
      <header className="sticky top-0 z-10 border-b border-line bg-surface/95 backdrop-blur pt-safe">
        <div className="mx-auto max-w-2xl flex items-center gap-3 px-4 py-3">
          <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white font-black text-sm">
            K
          </Link>
          <div className="min-w-0">
            <p className="text-xs text-muted font-medium">Kokende</p>
            <h1 className="text-base font-extrabold truncate">{title}</h1>
          </div>
          <Link href="/app" className="ml-auto text-sm font-bold text-brand">
            App
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8 prose-legal">
        {children}
      </main>
      <footer className="hidden md:block border-t border-line mt-8">
        <div className="mx-auto max-w-2xl px-4 py-6 text-xs text-muted space-y-2">
          <p>Digni Digital LLC · contact@dignidigital.com</p>
          <nav className="flex gap-4">
            <Link href="/privacy" className="underline">Confidentialité</Link>
            <Link href="/terms" className="underline">Conditions</Link>
            <Link href="/cookies" className="underline">Cookies</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
