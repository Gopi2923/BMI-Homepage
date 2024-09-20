const CACHE_NAME = 'vitals-check-cache-v1';
const urlsToCache = [
  '/',
  '/public/index.html',
  '/src/Assets/logo.png',
  '/src/Assets/click.gif',
  '/src/Assets/qr-img-40.jpeg',
  '/src/Assets/qr-img-99.jpeg',
];

// Install the service worker and cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch requests and serve cached files if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request)
        .then((response) => {
          return response || caches.match('/offline.html'); // Serve offline page if the resource is not cached
        });
    })
  );
});

// Activate the service worker and clean old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
