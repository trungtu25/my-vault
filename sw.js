// Service Worker cho Personal Vault — chỉ lo việc cache file app để chạy
// offline. KHÔNG can thiệp vào localStorage/IndexedDB — dữ liệu vault
// của bạn hoàn toàn nằm ngoài phạm vi của file này.

const CACHE_NAME = 'vault-cache-v2';
const APP_SHELL = ['./', './index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Chiến lược: ưu tiên trả cache ngay lập tức (mở nhanh, chạy được cả offline),
// đồng thời âm thầm tải bản mới nhất từ mạng để cập nhật cache cho lần sau.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200 && event.request.url.startsWith(self.location.origin)) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
