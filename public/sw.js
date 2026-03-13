// ─── VERSION: Change this on EVERY deploy to kill old caches ─────────────────
const CACHE_VERSION = 'v3';
const CACHE_NAME = `g-limit-studio-${CACHE_VERSION}`;

const STATIC_CACHE = ['/offline'];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE))
      .catch((err) => console.warn('[SW] Install failed:', err))
  );
  // Take over immediately — don't wait for old SW to die naturally
  self.skipWaiting();
});

// ─── Activate: nuke ALL old caches immediately ────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Delete all old caches
      caches.keys().then((names) =>
        Promise.all(
          names
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Nuking old cache:', name);
              return caches.delete(name);
            })
        )
      ),
      // Take control of ALL open tabs immediately without reload
      self.clients.claim(),
    ])
  );

  // Tell all open clients to reload so they get the fresh SW immediately
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'SW_UPDATED' });
    });
  });
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip cross-origin (API calls go straight to network)
  if (url.origin !== self.location.origin) return;

  // ⚠️ NEVER cache Next.js JS/CSS chunks — they change every deploy
  if (url.pathname.startsWith('/_next/')) return;

  // HTML pages: always network first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).catch(() => caches.match('/offline'))
    );
    return;
  }

  // Static assets only (images, fonts, icons)
  if (url.pathname.match(/\.(png|jpg|jpeg|webp|avif|gif|svg|ico|woff|woff2|ttf)$/)) {
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

  // Everything else: network only
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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
