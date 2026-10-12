/* Kokende service worker — generated at build */
const VERSION = '__VERSION__';
const PRECACHE = __PRECACHE__;
const CACHE = `kokende-${VERSION}`;
const TILE_CACHE = `kokende-tiles-${VERSION}`;
const TILE_MAX = 80;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => (k.startsWith('kokende-') && k !== CACHE && k !== TILE_CACHE))
          .map((k) => caches.delete(k)),
      ),
    ).then(() => self.clients.claim()),
  );
});

function isOsmTile(url) {
  return /tile\.openstreetmap\.org/.test(url.hostname);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Lite OSM tile cache (network-first, capped)
  if (isOsmTile(url)) {
    event.respondWith(
      caches.open(TILE_CACHE).then(async (cache) => {
        try {
          const res = await fetch(request);
          if (res.ok) {
            cache.put(request, res.clone());
            const keys = await cache.keys();
            if (keys.length > TILE_MAX) {
              await cache.delete(keys[0]);
            }
          }
          return res;
        } catch {
          const cached = await cache.match(request);
          if (cached) return cached;
          throw new Error('offline tile miss');
        }
      }),
    );
    return;
  }

  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/'))),
    );
    return;
  }

  if (
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/splash/') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.webp') ||
    url.pathname === '/manifest.webmanifest'
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          }),
      ),
    );
  }
});
