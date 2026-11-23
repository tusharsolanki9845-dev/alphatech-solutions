/* AlphaTech Solutions — cache only this application's namespace */
const CACHE = "alphatech-business-v8";
const CACHE_PREFIX = "alphatech-";
const SHELL = ["./", "./index.html", "./style.css", "./script.js", "./manifest.webmanifest", "./assets/founder.jpg", "./assets/icon-192.png", "./assets/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const accept = req.headers.get("accept") || "";
  const isHTML = req.mode === "navigate" || accept.includes("text/html");
  if (isHTML) {
    event.respondWith(fetch(req).then((res) => {
      if (res.ok) caches.open(CACHE).then((cache) => cache.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req).then((cached) => cached || caches.match("./index.html"))));
    return;
  }

  event.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => {
    if (res.ok) caches.open(CACHE).then((cache) => cache.put(req, res.clone()));
    return res;
  })));
});
