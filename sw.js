/* MANMIN-Ver.1 Service Worker — Cache-First */
const CACHE = 'manmin-uc-v1';
const PRECACHE = ['./', './index.html', './manifest.json',
  './icons/icon-192x192.png', './icons/icon-512x512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (/fonts\.googleapis|fonts\.gstatic|cdnjs\.cloudflare/.test(e.request.url)) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request))); return;
  }
  e.respondWith(caches.match(e.request).then(cached => {
    if (cached) return cached;
    return fetch(e.request).then(res => {
      if (!res || res.status !== 200 || res.type !== 'basic') return res;
      caches.open(CACHE).then(c => c.put(e.request, res.clone()));
      return res;
    }).catch(() => { if (e.request.mode === 'navigate') return caches.match('./index.html'); });
  }));
});
