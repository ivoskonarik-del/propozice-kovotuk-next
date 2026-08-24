self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);
  // Only intercept same-origin HTML (page navigations + Next.js RSC fetches)
  if (url.origin !== self.location.origin) return;
  const isHtml = req.destination === 'document'
    || (req.headers.get('accept') || '').includes('text/html')
    || url.pathname.endsWith('/')
    || url.pathname.endsWith('.html');
  if (!isHtml) return;
  event.respondWith(
    fetch(req.url, { cache: 'no-store' })
      .catch(() => caches.match(req))
  );
});
