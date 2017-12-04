var cacheName = 'pwa-example-v1';
var dataCacheName = 'pwa-example-data-v1';

var filesToCache = [
  '/',
  '/index.html',
  '/javascripts/common.js',
  '/stylesheets/common.css',
  '/images/logo.png',
  '/images/button-a.png',
  '/images/button-b.png',
  '/images/button-c.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);

  var dataUrl = "https://api.kenle.info/pwa-example/api/announcement";

  //Intercept data requests and cache the data
  if (e.request.url.indexOf(dataUrl) > -1) {
    e.respondWith(
      //Open the data cache
      caches.open(dataCacheName).then(function (cache) {
        //Fetching the data with fetch API
        return fetch(e.request).then(function (response) {
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function (response) {
        return response || fetch(e.request);
      })
    );
  }
});