/* Service worker - Evrix Financeiro
   Cache só dos arquivos do próprio app (abre rápido e funciona o "shell" offline).
   Dados do Supabase e CDNs NÃO são cacheados. */
const CACHE = 'evrix-fin-v2';
const ARQUIVOS = ['./', './index.html', './mobile.css', './banco.css', './pwa.css', './app.js', './banco.js', './pwa.js', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ARQUIVOS.map(a => c.add(a)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
    const req = e.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== location.origin) return; // Supabase, Chart.js etc. vão direto pra rede
    // rede primeiro (sempre pega a versão nova); se estiver offline, usa o cache
    e.respondWith(
        fetch(req).then(res => {
            if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
            return res;
        }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
});
