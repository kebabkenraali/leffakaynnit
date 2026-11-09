// Sovelluksen tiedostot välimuistiin, jotta sovellus aukeaa myös ilman verkkoa.
const CACHE = 'leffakaynnit-v20';
// Versionumero samaksi kuin index.html:n app.js?v= ja style.css?v=, nosta molemmat julkaistessa
const ASSETS = [
  './',
  'index.html',
  'style.css?v=20',
  'app.js?v=20',
  'manifest.webmanifest',
  'icon.svg',
  'tests.html',
  'tests.js?v=20',
  // Excel-lukija välimuistiin, jotta tuonti toimii myös ilman verkkoa
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
];

// cache: 'reload' ohittaa selaimen HTTP-välimuistin (GitHub Pages: max-age 10 min),
// ettei uuteen versioon tallennu vanhoja tiedostoja
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) =>
        c.addAll(
          ASSETS.map((u) => new Request(u, { cache: 'reload' }))
        )
          .catch(() => {}) // ulkoinen resurssi (XLSX) saattaa epäonnistua offline-asennuksen yhteydessä
      )
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
// Ulkoinen Excel-lukija (cdnjs) sen sijaan välimuistista ensin: toimii myös offline.
const XLSX_URL = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (url.href === XLSX_URL) {
    e.respondWith(
      caches.match(XLSX_URL).then((hit) =>
        hit ||
        fetch(e.request).then((res) => {
          caches.open(CACHE).then((c) => c.put(XLSX_URL, res.clone()));
          return res;
        })
      )
    );
    return;
  }
  if (url.origin !== location.origin) return;
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
