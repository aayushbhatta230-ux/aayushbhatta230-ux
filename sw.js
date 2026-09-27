/**
 * Service Worker for Aayush Bhatta's Portfolio PWA
 * Enables offline browsing, fast asset caching, and standalone homescreen experience.
 */

const CACHE_NAME = 'aayush-portfolio-v2';

const STATIC_PRECACHE = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './site.webmanifest',
  './favicon.ico',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/images/icon-maskable-192.png',
  './assets/images/icon-maskable-512.png',
  './assets/images/apple-touch-icon.png',
  './assets/images/favicon-32x32.png',
  './assets/images/favicon-16x16.png',
  './assets/images/spiderman.png',
  './assets/images/mirror_candid.png',
  './assets/images/golden_sunset.png',
  './assets/images/mountain_bw.png',
  './assets/images/forest_nature.png'
];

// Install: Pre-cache core portfolio assets for instant offline availability
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Purge obsolete cache versions and take immediate control
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-first with network fallback & runtime caching for fonts/assets
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Exclude unsupported schemes
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately, but revalidate in background if online
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {
          // Offline, cached version already returned
        });
        return cachedResponse;
      }

      // Not in cache: fetch from network and cache for offline usage
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic' && networkResponse.type !== 'cors') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Cache fonts, scripts, stylesheets, and images for offline use
          if (
            url.origin === location.origin ||
            url.hostname.includes('fonts.googleapis.com') ||
            url.hostname.includes('fonts.gstatic.com')
          ) {
            cache.put(event.request, responseToCache);
          }
        });

        return networkResponse;
      }).catch(() => {
        // If navigation request fails when offline, serve cached index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
