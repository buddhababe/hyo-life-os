const CACHE_NAME = "hyo-life-os-v1-9";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./data/method-updates.json",
  "./css/style.css",
  "./js/data.js",
  "./js/storage.js",
  "./js/evolution.js",
  "./js/crypto.js",
  "./js/auth.js",
  "./js/app.js",
  "./assets/icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
