var cacheName = 'weatherApp-v2';
var dataCacheName = 'weatherData-v2';
var filesToCache = [
    '/js/controllers.js',
    '/js/directives.js',
    '/js/routes.js',
    '/js/script.js',
    '/js/services.js',
    '/directives/weatherReport.htm',
    '/pages/forecast.htm',
    '/pages/home.htm',
    '/index.html',
    '/'
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
      	console.log('key: ' + key);
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
  console.log('[Service Worker] Fetch', e.request.url);
  var dataUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?appid=fb667e32eb6a1b247b8463c26b2dedec';
  if (e.request.url.indexOf(dataUrl) > -1) {
      e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        return fetch(e.request).then(function(response){
             cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
      e.respondWith(
      caches.match(e.request).then(function(response) {
        if(response)
          console.log(e.request.url + ' is from cache');
        return response || fetch(e.request);
      })
    );
  }
});