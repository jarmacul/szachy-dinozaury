// Pomocnik offline (service worker): przy pierwszym otwarciu zapisuje wszystkie pliki na iPadzie,
// potem gra działa bez internetu. Nowa wersja = nowy numer WERSJA (wpisuje go build.py).
const WERSJA = '20261126-101319';
const PLIKI = ["./", "LICENSE-three.txt", "ikony/ikona-1024.png", "ikony/ikona-180.png", "ikony/ikona-192.png", "ikony/ikona-512.png", "index.html", "manifest.webmanifest", "modele/LICENCJA.txt", "modele/apato.glb", "modele/bplus/raptor.bin", "modele/bplus/trex.bin", "modele/bplus/triceratops.bin", "modele/para.glb", "modele/raptor.glb", "modele/stego.glb", "modele/trex.glb", "modele/trike.glb"];
const NAZWA = 'szachy-' + WERSJA;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(NAZWA).then(c => c.addAll(PLIKI)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('szachy-') && k !== NAZWA).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Najpierw kopia z iPada (szybko i offline), a gdy jej nie ma — internet.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return; // chmura (Firebase) — zawsze prosto do internetu
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
