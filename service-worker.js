const CACHE_NAME = 'uvs-stats-cache-v1.3.5'; // Increment version to force update
const urlsToCache = [
  './',
  './index.html',
  './styles/main.css',
  './scripts/app.js',
  './manifest.json',

// icons & images

  'icons/settings.svg',
  'icons/history.svg',
  'icons/button_plus.svg',
  'icons/button_minus.svg',
  'icons/Off.svg','icons/High.svg','icons/Mid.svg','icons/Low.svg',
  'icons/yellow-star.svg',
  'icons/block-reset.svg',
  'icons/player-half.svg','icons/player-full.svg',
  'icons/rival-full.svg','icons/rival-half.svg',
  'icons/chevron-down.svg',
  'icons/home-screen.svg','icons/share.svg','icons/rotate-device.svg',
  'icons/intro_settings.svg','icons/intro-reset.svg','icons/intro_dmg1.svg','icons/intro_dmg2.svg',
  'icons/bmc-button.svg',
  'icons/appicon_ios.png', 'icons/appicon_android.png',
  'icons/bg.png',
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Activate new SW immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );

  self.clients.claim(); 
});

self.addEventListener('fetch', event => {
  // Network-first for HTML/CSS/JS, fallback to cache
  if (event.request.method === 'GET' &&
      (event.request.destination === 'document' ||
       event.request.destination === 'script' ||
       event.request.destination === 'style')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Update cache with latest
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Default: cache-first
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});


