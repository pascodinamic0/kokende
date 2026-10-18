import type { Metadata } from 'next';
import Link from 'next/link';
import { clerkEnabled } from '@/lib/auth/config';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connexion Kokende — Google ou Apple uniquement.',
};

export default function SignInPage() {
  if (clerkEnabled()) {
    return <ClerkSignInLazy />;
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-bg px-4 pt-safe pb-safe">
      <div className="w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-card">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white font-black text-lg mb-4">
          K
        </div>
        <h1 className="text-xl font-extrabold tracking-tight">Connexion</h1>
        <p className="mt-2 text-sm text-muted leading-relaxed">
          Google et Apple uniquement — pas d&apos;e-mail / mot de passe.
        </p>
        <div className="mt-5 space-y-2 opacity-60">
          <div className="rounded-2xl border border-line px-4 py-3.5 text-sm font-bold text-center min-h-14 flex items-center justify-center">
            Continuer avec Google
          </div>
          <div className="rounded-2xl bg-ink text-cream px-4 py-3.5 text-sm font-bold text-center min-h-14 flex items-center justify-center">
            Continuer avec Apple
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-gold-soft border border-gold/30 px-3.5 py-3 text-xs text-ink leading-relaxed">
          <p className="font-bold mb-1">Configurer Clerk</p>
          <ol className="list-decimal pl-4 space-y-1 text-muted">
            <li>
              Créer une application Clerk, activer <strong>Google</strong> et{' '}
              <strong>Apple</strong> (désactiver e-mail/password).
            </li>
            <li>
              Définir <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> et{' '}
              <code>CLERK_SECRET_KEY</code> (voir <code>.env.example</code>).
            </li>
            <li>Redéployer sur Vercel.</li>
          </ol>
        </div>
        <Link
          href="/app"
          className="mt-5 block text-center text-sm font-bold text-brand min-h-11 leading-[2.75rem]"
        >
          Retour à l&apos;app
        </Link>
      </div>
    </div>
  );
}

async function ClerkSignInLazy() {
  const { SignIn } = await import('@clerk/nextjs');
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg px-4">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-in"
        forceRedirectUrl="/app"
      />
    </div>
  );
}
