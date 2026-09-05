const CACHE_NAME = 'skillbridge-pwa-v2';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png'
];

// Install event - Cache static assets safely with Promise.allSettled
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline assets');
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.log('Asset cache skipped for:', url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - Network-First with safe Cache fallback
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API routes
  if (url.pathname.startsWith('/api/')) return;

  // Skip Vite dev server internals, HMR, source files, and external schemas
  if (
    url.pathname.includes('@vite') ||
    url.pathname.includes('@fs') ||
    url.pathname.includes('@id') ||
    url.pathname.includes('/src/') ||
    url.pathname.includes('node_modules') ||
    url.pathname.includes('hot-update') ||
    !url.protocol.startsWith('http')
  ) {
    return;
  }

  // Network-First with safe Cache fallback for all static & navigation requests
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Clone and cache successful basic responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache).catch(() => {});
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        // Network failed (offline) -> Look in cache
        const cached = await caches.match(event.request);
        if (cached) return cached;
        if (event.request.mode === 'navigate') {
          const fallback = (await caches.match('/')) || (await caches.match('/index.html'));
          if (fallback) return fallback;
        }
        return new Response('Network offline. Please reconnect to access SkillBridge.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        });
      })
  );
});
