// Sovelluksen tiedostot välimuistiin, jotta sovellus aukeaa myös ilman verkkoa.
const CACHE = 'leffakaynnit-v16';
// Versionumero samaksi kuin index.html:n app.js?v= ja style.css?v=, nosta molemmat julkaistessa
const ASSETS = ['./', 'index.html', 'style.css?v=16', 'app.js?v=16', 'manifest.webmanifest', 'icon.svg'];

// cache: 'reload' ohittaa selaimen HTTP-välimuistin (GitHub Pages: max-age 10 min),
// ettei uuteen versioon tallennu vanhoja tiedostoja
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Verkko ensin, välimuisti varalla – päivitykset tulevat heti kun verkko toimii.
// no-cache: tarkistetaan aina palvelimelta, ettei HTML ja app.js ole eri versioita.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request.url, { cache: 'no-cache' })
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
