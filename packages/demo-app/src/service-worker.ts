/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

// Phase 7 Week 1 - Advanced Caching Strategies
const CACHE_NAME = 'rhuds-v1';
const STATIC_CACHE = 'rhuds-static-v1';
const API_CACHE = 'rhuds-api-v1';
const IMAGE_CACHE = 'rhuds-images-v1';

const ASSETS_TO_CACHE = ['/', '/index.html', '/styles/global.css', '/styles/cold-war-theme.css'];

// Cache expiration times (in milliseconds)
const CACHE_EXPIRATION = {
  static: 31536000000, // 1 year
  api: 300000, // 5 minutes
  images: 2592000000, // 30 days
  html: 3600000, // 1 hour
};

// Background sync tag
const BACKGROUND_SYNC_TAG = 'rhuds-sync';

// Install event - cache assets
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE).catch(() => {
          console.warn('Some assets could not be cached during install');
        });
      }),
      caches.open(STATIC_CACHE),
      caches.open(API_CACHE),
      caches.open(IMAGE_CACHE),
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          const validCaches = [CACHE_NAME, STATIC_CACHE, API_CACHE, IMAGE_CACHE];
          if (!validCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request: Request, cacheName: string): Promise<Response> {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || fetchPromise;
}

// Cache-first strategy
async function cacheFirst(request: Request, cacheName: string): Promise<Response> {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request: Request, cacheName: string): Promise<Response> {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Fetch event - implement advanced caching strategies
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Static assets - cache-first strategy
  if (
    request.url.includes('.js') ||
    request.url.includes('.css') ||
    request.url.includes('.woff') ||
    request.url.includes('.woff2') ||
    request.url.includes('.ttf') ||
    request.url.includes('.eot')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Images - cache-first strategy
  if (
    request.url.includes('.png') ||
    request.url.includes('.jpg') ||
    request.url.includes('.jpeg') ||
    request.url.includes('.gif') ||
    request.url.includes('.svg') ||
    request.url.includes('.webp')
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // API calls - stale-while-revalidate strategy
  if (request.url.includes('/api/')) {
    event.respondWith(staleWhileRevalidate(request, API_CACHE));
    return;
  }

  // HTML pages - network-first strategy
  event.respondWith(networkFirst(request, CACHE_NAME));
});

// Handle messages from clients
self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Background sync event
self.addEventListener('sync', (event: any) => {
  if (event.tag === BACKGROUND_SYNC_TAG) {
    event.waitUntil(
      (async () => {
        try {
          // Sync pending requests
          const cache = await caches.open(API_CACHE);
          const requests = await cache.keys();

          for (const request of requests) {
            try {
              const response = await fetch(request);
              if (response.ok) {
                await cache.put(request, response);
              }
            } catch (error) {
              console.error('Background sync failed for:', request.url);
            }
          }
        } catch (error) {
          console.error('Background sync error:', error);
        }
      })()
    );
  }
});

// Push notification event
self.addEventListener('push', (event: any) => {
  if (!event.data) return;

  const data = event.data.json();
  const options: NotificationOptions = {
    body: data.body || 'New notification',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.tag || 'notification',
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(self.registration.showNotification(data.title || 'RHUDS Pro', options));
});

// Notification click event
self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return (client as any).focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

export {};
