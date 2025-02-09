import { getVersion } from "./version.js";

const CACHE_NAME_PREFIX = "my-app-cache-";
let CACHE_NAME = CACHE_NAME_PREFIX + "default"; // Temporary value before fetching version

const urlsToCache = [
  "index.html",
  "css/style.css",
  "js/index.js",
  "resources/karten/background.png",
  "resources/karten/schellen_unter.png",
  "resources/karten/herz_unter.png",
  "resources/karten/blatt_unter.png",
  "resources/karten/eichel_unter.png",
  "resources/karten/schellen_ober.png",
  "resources/karten/herz_ober.png",
  "resources/karten/blatt_ober.png",
  "resources/karten/eichel_ober.png",
  "resources/karten/schellen_zehner.png",
  "resources/karten/herz_zehner.png",
  "resources/karten/blatt_zehner.png",
  "resources/karten/eichel_zehner.png",
  "resources/karten/schellen_ass.png",
  "resources/karten/herz_ass.png",
  "resources/karten/blatt_ass.png",
  "resources/karten/eichel_ass.png",
  "resources/karten/herz_koenig.png",
  "resources/karten/schellen_koenig.png",
  "resources/karten/blatt_koenig.png",
  "resources/karten/eichel_koenig.png",
  "resources/karten/herz_neuner.png",
  "version.js",
  "version.json", // Ensure the version file is cached
];

// Install Event: Cache Files with Versioned Cache Name
self.addEventListener("install", (event) => {
  event.waitUntil(
    getVersion().then((version) => {
      CACHE_NAME = `${CACHE_NAME_PREFIX}${version}`;
      return caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache));
    })
  );
  self.skipWaiting();
});

// Activate Event: Delete Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    getVersion().then((version) => {
      const expectedCacheName = `${CACHE_NAME_PREFIX}${version}`;
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== expectedCacheName) {
              return caches.delete(cache);
            }
          })
        );
      });
    })
  );
  self.clients.claim();
});

// Fetch Event: Serve from Cache or Fetch from Network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
