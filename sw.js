/* ═══════════════════════════════════════════════════
   MANMIN-Ver.1 Service Worker
   건축물 용도변경 판정기 — 오프라인 캐시 지원
   Cache-First 전략: 앱 파일 우선 캐시 제공
═══════════════════════════════════════════════════ */

const CACHE_NAME = 'manmin-use-change-v1';
const CACHE_VERSION = '1.0.0';

/* 사전 캐시 대상 파일 목록 */
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/apple-touch-icon.png'
];

/* ─── Install: 사전 캐시 ─── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

/* ─── Activate: 구 캐시 정리 ─── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

/* ─── Fetch: Cache-First + Network Fallback ─── */
self.addEventListener('fetch', event => {
  /* 외부 폰트·API 요청은 네트워크 우선 */
  if (event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  /* 앱 리소스: 캐시 우선 */
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request).then(response => {
        /* 유효한 응답만 캐시에 저장 */
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, toCache);
        });
        return response;
      }).catch(() => {
        /* 오프라인 + 캐시 없음: index.html 반환 */
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
