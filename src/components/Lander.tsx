'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Bike, Car, ChevronRight, MapPinned, Shield } from 'lucide-react';
import { Button } from './ui';
import clsx from 'clsx';

const SCREENS = 3;

/**
 * Fixed-viewport mobile lander (Boutik rule): one screen = 100dvh, no page scroll.
 * Desktop may scroll. Cost-of-Inaction voice on CTA screens only.
 */
export function Lander() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const lock = () => {
      if (window.matchMedia('(max-width: 767px)').matches) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
      } else {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      }
    };
    lock();
    window.addEventListener('resize', lock);
    return () => {
      window.removeEventListener('resize', lock);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  const next = useCallback(() => setStep((s) => Math.min(SCREENS - 1, s + 1)), []);
  const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);

  return (
    <div className="md:min-h-dvh md:overflow-auto bg-bg">
      {/* Mobile fixed deck */}
      <div className="md:hidden relative h-dvh w-full overflow-hidden flex flex-col pt-safe pb-safe">
        <header className="shrink-0 flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white font-black">
              K
            </div>
            <span className="font-extrabold tracking-tight">Kokende</span>
          </div>
          <Link href="/app" className="text-sm font-bold text-brand">
            Ouvrir
          </Link>
        </header>

        <div className="relative flex-1 min-h-0 overflow-hidden">
          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${step * 100}%)` }}
          >
            <ScreenHero onNext={next} />
            <ScreenProof onNext={next} onPrev={prev} />
            <ScreenCta onPrev={prev} />
          </div>
        </div>

        <div className="shrink-0 flex justify-center gap-2 py-3">
          {Array.from({ length: SCREENS }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Écran ${i + 1}`}
              onClick={() => setStep(i)}
              className={clsx(
                'h-2 rounded-full transition-all',
                i === step ? 'w-6 bg-brand' : 'w-2 bg-line',
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop classic (may scroll) — no fake reviews */}
      <div className="hidden md:block">
        <DesktopLander />
      </div>
    </div>
  );
}

function ScreenHero({ onNext }: { onNext: () => void }) {
  return (
    <section className="min-w-full h-full flex flex-col px-5 justify-between py-2">
      <div className="flex-1 flex flex-col justify-center">
        <p className="text-xs font-bold uppercase tracking-wider text-brand mb-2">
          Kinshasa-first · FR
        </p>
        <h1 className="text-[1.85rem] font-extrabold leading-tight tracking-tight">
          Moins d&apos;embouteillage.
          <span className="block text-brand">Aussi en moto.</span>
        </h1>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Plus court vs voie libre. En moto, Kokende préfère wewa et ruelles pour
          contourner les files voiture — données seedées + signalements locaux.
        </p>
        <div className="mt-5 flex gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft text-brand px-3 py-1.5 text-xs font-bold">
            <Car className="h-3.5 w-3.5" /> Voiture
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink text-cream px-3 py-1.5 text-xs font-bold">
            <Bike className="h-3.5 w-3.5" /> Moto / wewa
          </span>
        </div>
      </div>
      <Button size="lg" block className="min-h-14" onClick={onNext}>
        Continuer <ChevronRight className="h-5 w-5" />
      </Button>
    </section>
  );
}

function ScreenProof({
  onNext,
  onPrev,
}: {
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <section className="min-w-full h-full flex flex-col px-5 justify-between py-2">
      <div className="flex-1 flex flex-col justify-center gap-4">
        <h2 className="text-xl font-extrabold tracking-tight">Ce que c&apos;est (et n&apos;est pas)</h2>
        <ul className="space-y-3 text-sm">
          <li className="flex gap-3 rounded-2xl border border-line bg-surface p-3.5">
            <MapPinned className="h-5 w-5 shrink-0 text-brand mt-0.5" />
            <div>
              <p className="font-bold">Graphe Kinshasa MVP</p>
              <p className="text-muted text-xs mt-0.5">
                Bd 30 Juin, Lumumba, Université, Matadi–Kibala + wewa seedés.
              </p>
            </div>
          </li>
          <li className="flex gap-3 rounded-2xl border border-line bg-surface p-3.5">
            <Shield className="h-5 w-5 shrink-0 text-ok mt-0.5" />
            <div>
              <p className="font-bold">Honnêteté trafic</p>
              <p className="text-muted text-xs mt-0.5">
                Jam = seed + crowdsource Dexie sur cet appareil. Pas de flotte GPS
                live, pas de partenariat ministériel inventé.
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button size="lg" variant="secondary" className="min-h-14" onClick={onPrev}>
          Retour
        </Button>
        <Button size="lg" className="min-h-14" onClick={onNext}>
          Suite
        </Button>
      </div>
    </section>
  );
}

function ScreenCta({ onPrev }: { onPrev: () => void }) {
  return (
    <section className="min-w-full h-full flex flex-col px-5 justify-between py-2">
      <div className="flex-1 flex flex-col justify-center">
        {/* Cost of Inaction — marketing/CTA only */}
        <p className="text-xs font-bold uppercase tracking-wider text-gold mb-2">
          Coût de l&apos;inaction
        </p>
        <h2 className="text-xl font-extrabold tracking-tight leading-snug">
          Bloqué derrière les voitures sur Lumumba&nbsp;?
        </h2>
        <p className="mt-3 text-sm text-muted leading-relaxed">
          Une course moto coincée dans une file voiture, c&apos;est un client qui
          descend, une course perdue — souvent{' '}
          <strong className="text-ink">2&nbsp;000 à 5&nbsp;000 FC</strong> qui
          s&apos;évaporent. Kokende propose la wewa quand elle existe.
        </p>
        <p className="mt-2 text-xs text-muted">
          Petit geste : ouvrez la carte, basculez sur <strong>Moto</strong>, testez
          Gombe → Ndjili.
        </p>
      </div>
      <div className="space-y-2">
        <Link href="/app?mode=moto" className="block">
          <Button size="lg" block className="min-h-14" variant="dark">
            <Bike className="h-5 w-5" /> Essayer en moto
          </Button>
        </Link>
        <Link href="/app" className="block">
          <Button size="lg" block className="min-h-14">
            <Car className="h-5 w-5" /> Ouvrir Kokende
          </Button>
        </Link>
        <button
          type="button"
          onClick={onPrev}
          className="w-full text-center text-sm font-semibold text-muted py-2 min-h-11"
        >
          Retour
        </button>
      </div>
    </section>
  );
}

function DesktopLander() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center gap-3 mb-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white font-black text-xl">
          K
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Kokende</h1>
          <p className="text-sm text-muted">Navigation anti-embouteillage · Kinshasa</p>
        </div>
      </div>
      <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">
        Voiture ou moto : préférez la voie libre.
      </h2>
      <p className="text-muted leading-relaxed mb-6 max-w-xl">
        En moto, le graphe privilégie wewa, pistes informelles et ruelles pour
        contourner les files voiture. Trafic seedé + signalements locaux — pas une
        flotte GPS live.
      </p>
      <div className="rounded-2xl border border-gold/40 bg-gold-soft/50 p-5 mb-8 max-w-xl">
        <p className="text-xs font-bold uppercase tracking-wider text-gold mb-1">
          Coût de l&apos;inaction
        </p>
        <p className="text-sm leading-relaxed">
          Moto-taxi coincé dans un embouteillage voiture : client qui abandonne,
          course perdue (souvent 2&nbsp;000–5&nbsp;000&nbsp;FC). Un tap sur{' '}
          <strong>Moto</strong> montre la wewa quand elle existe.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 mb-12">
        <Link href="/app?mode=moto">
          <Button size="lg" variant="dark" className="min-h-14">
            <Bike className="h-5 w-5" /> Essayer en moto
          </Button>
        </Link>
        <Link href="/app">
          <Button size="lg" className="min-h-14">
            Ouvrir l&apos;app
          </Button>
        </Link>
        <Link href="/demo?mode=moto">
          <Button size="lg" variant="secondary" className="min-h-14">
            Démo moto
          </Button>
        </Link>
      </div>
      <footer className="border-t border-line pt-6 text-xs text-muted space-y-2">
        <p>
          © {new Date().getFullYear()} Digni Digital LLC · contact@dignidigital.com
        </p>
        <nav className="flex gap-4">
          <Link href="/privacy" className="underline">Confidentialité</Link>
          <Link href="/terms" className="underline">Conditions</Link>
          <Link href="/cookies" className="underline">Cookies</Link>
        </nav>
      </footer>
    </div>
  );
}
