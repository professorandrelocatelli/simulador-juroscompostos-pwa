const CACHE_NAME = 'simulador-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
  // O CSS e o JavaScript estão embutidos no index.html, então serão salvos juntos.
];

self.addEventListener('install', event => {
  // Instala o Service Worker e armazena os arquivos no cache
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto: Arquivos essenciais salvos.');
        return cache.addAll(urlsToCache).catch(error => {
            console.error('Falha ao salvar arquivos no cache:', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
  // Intercepta requisições: se o arquivo estiver no cache, usa o cache; senão, busca na rede.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Retorna a versão em cache
        }
        return fetch(event.request); // Busca na rede
      })
  );
});

self.addEventListener('activate', event => {
  // Limpa caches antigos
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Deleta caches obsoletos
          }
        })
      );
    })
  );
});