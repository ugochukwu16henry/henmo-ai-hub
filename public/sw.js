const CACHE_NAME = 'henmo-ai-v1'
const STATIC_CACHE = [
  '/',
  '/chat',
  '/memory',
  '/settings',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE))
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) return response
        
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) return response
          
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseToCache))
          
          return response
        })
      })
  )
})