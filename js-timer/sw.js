'use strict';

var version = 'jstimer-static-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(version)
      .then(function(cache) {
        return cache.addAll([
          'public/css/style.css',
          'public/js/timer.js',
          'public/assets/ring.mp3'
        ]);
      })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);
  console.log(requestUrl);

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
