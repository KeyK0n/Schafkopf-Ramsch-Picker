// Add PWA capabilities
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('sw-cache')
            .then(function(cache) {
                return cache.addAll([
                    'index.html',
                    'css/style.css',
                    'js/index.js',
                    'resources/karten/background.png',
                    'resources/karten/schellen_unter.png',
                    'resources/karten/herz_unter.png',
                    'resources/karten/blatt_unter.png',
                    'resources/karten/eichel_unter.png',
                    'resources/karten/schellen_ober.png',
                    'resources/karten/herz_ober.png',
                    'resources/karten/blatt_ober.png',
                    'resources/karten/eichel_ober.png',
                    'resources/karten/schellen_zehner.png',
                    'resources/karten/herz_zehner.png',
                    'resources/karten/blatt_zehner.png',
                    'resources/karten/eichel_zehner.png',
                    'resources/karten/schellen_ass.png',
                    'resources/karten/herz_ass.png',
                    'resources/karten/blatt_ass.png',
                    'resources/karten/eichel_ass.png',
                    'resources/karten/herz_koenig.png',
                    'resources/karten/schellen_koenig.png',
                    'resources/karten/blatt_koenig.png',
                    'resources/karten/eichel_koenig.png',
                    'resources/karten/herz_neuner.png',
                ]);
            }
        )
    )
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetch(event.request);
            })
    )
});