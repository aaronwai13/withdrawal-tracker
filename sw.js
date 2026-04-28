const VERSION = '2026.04.29.1';
const CACHE = `withdrawal-tracker-v${VERSION}`;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([
      './',
      './index.html',
      './manifest.json?v=2026.04.29.1',
      './icon-192-v2026.04.14.13.png',
      './apple-touch-icon-v2026.04.14.13.png',
      './icon-v2026.04.14.13.svg'
    ]))
  );
  // 唔 skipWaiting — 等用戶確認先切換
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Firebase / Google 請求：直接網絡，唔快取
  if (e.request.url.includes('firebaseio.com') ||
      e.request.url.includes('googleapis.com') ||
      e.request.url.includes('gstatic.com')) {
    return;
  }
  if (e.request.mode === 'navigate') {
    // 主頁面：網絡優先（確保拿到最新版）
    e.respondWith(
      fetch(e.request).then(res => {
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      }).catch(() => caches.match(e.request))
    );
    return;
  }
  // 其他靜態資源：緩存優先，首次 fetch 同時寫入緩存
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).then(res => {
        caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        return res;
      })
    )
  );
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (e.data && e.data.type === 'GET_VERSION') e.ports[0]?.postMessage({ version: VERSION });
});
