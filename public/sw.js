// ─── IMPORTANT: Change this version string on EVERY deploy ───────────────────
// This forces the old cache to be deleted and rebuilt fresh
const CACHE_VERSION = 'v2'; // ← increment this each time you deploy
const CACHE_NAME = `g-limit-studio-${CACHE_VERSION}`;

// Only cache the bare minimum — NOT JS bundles (Next.js handles those)
const STATIC_CACHE = [
  '/offline',
];

// ─── Install: cache only offline page ────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE))
      .catch((err) => console.warn('[SW] Install cache failed:', err))
  );
  self.skipWaiting();
});

// ─── Activate: delete ALL old caches ─────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch: Network first for HTML/JS/CSS, cache fallback for images ─────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests
  if (request.method !== 'GET') return;

  // 2. Skip cross-origin API requests entirely — let them go straight to network
  if (url.origin !== self.location.origin) return;

  // 3. Skip Next.js build chunks — NEVER cache these, Next.js manages them
  if (url.pathname.startsWith('/_next/')) return;

  // 4. For HTML pages: Network first, fallback to offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('/offline'))
    );
    return;
  }

  // 5. For static assets (images, fonts, icons): Cache first, then network
  if (
    url.pathname.match(/\.(png|jpg|jpeg|webp|avif|gif|svg|ico|woff|woff2|ttf)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200) return response;
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // 6. Everything else: network only
});

// ─── Push notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: { dateOfArrival: Date.now(), primaryKey: 1 },
  };
  event.waitUntil(
    self.registration.showNotification('G-Limit Studio', options)
  );
});

// ─── Notification click ───────────────────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
