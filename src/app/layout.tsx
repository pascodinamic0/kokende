import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://kokende.vercel.app';

const splash = [
  [375, 667, 2],
  [390, 844, 3],
  [393, 852, 3],
  [430, 932, 3],
  [360, 780, 3],
].map(([w, h, d]) => ({
  url: `/splash/splash-${w! * d!}x${h! * d!}.png`,
  media: `(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${d}) and (orientation: portrait)`,
}));

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'Kokende — Navigation voiture & moto anti-embouteillage à Kinshasa',
    template: '%s · Kokende',
  },
  description:
    'Kokende (Lingala : aller) : itinéraires A→B voiture ou moto. En moto, privilégie wewa et ruelles. OSM, signalements locaux, français-first. Trafic seedé + crowdsource — pas de flotte GPS live.',
  applicationName: 'Kokende',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Kokende',
    statusBarStyle: 'default',
    startupImage: splash,
  },
  other: { 'apple-mobile-web-app-capable': 'yes' },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  openGraph: {
    title: 'Kokende — Voiture & moto, moins d’embouteillage à Kinshasa',
    description:
      'Plus court vs voie libre. Mode moto : wewa / ruelles. Signalements locaux. Pas de flotte GPS live.',
    locale: 'fr_CD',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#e11d48',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
