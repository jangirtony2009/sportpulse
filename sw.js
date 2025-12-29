const CACHE_NAME = 'glowup-beauty-v1.0.0';
const urlsToCache = [
  '/',
  '/assets/css/styles.css',
  '/assets/js/app.js',
  '/assets/data/newsData.js',
  '/site.webmanifest',
  '/offline.html'
];

// Install service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('GlowUp Beauty cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event with network-first strategy for content
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Skip Google Analytics and AdSense requests
  if (url.hostname.includes('google-analytics.com') || 
      url.hostname.includes('googlesyndication.com') ||
      url.hostname.includes('googletagmanager.com')) return;

  // Handle different types of requests
  if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
    // Cache-first for static assets
    event.respondWith(cacheFirst(request));
  } else if (url.pathname.includes('/assets/data/') || url.pathname === '/') {
    // Network-first for content and data
    event.respondWith(networkFirst(request));
  } else if (url.hostname.includes('unsplash.com') || url.hostname.includes('images.')) {
    // Cache-first for images with longer TTL
    event.respondWith(cacheFirstWithLongTTL(request));
  } else {
    // Default network-first strategy
    event.respondWith(networkFirst(request));
  }
});

// Cache-first strategy
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache-first failed:', error);
    return new Response('Offline content unavailable', { status: 503 });
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      const offlinePage = await caches.match('/offline.html');
      if (offlinePage) {
        return offlinePage;
      }
    }
    
    return new Response('Content unavailable offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Cache-first with longer TTL for images
async function cacheFirstWithLongTTL(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Check if cached response is still fresh (24 hours)
      const cacheDate = cachedResponse.headers.get('sw-cache-date');
      if (cacheDate) {
        const age = Date.now() - parseInt(cacheDate);
        if (age < 24 * 60 * 60 * 1000) { // 24 hours
          return cachedResponse;
        }
      }
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseClone = networkResponse.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cache-date', Date.now().toString());
      
      const modifiedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, modifiedResponse);
    }
    return networkResponse;
  } catch (error) {
    console.log('Image cache failed:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Image unavailable', { status: 503 });
  }
}

// Background sync for analytics (if supported)
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

async function syncAnalytics() {
  // Sync any pending analytics data when back online
  console.log('Syncing analytics data...');
}

// Push notification support (for future newsletter updates)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'New skincare tips available!',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    tag: 'glowup-beauty-notification',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'GlowUp Beauty', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.openWindow(url)
  );
});
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      }).catch(() => {
        // Return offline page for navigation requests
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
        
        // Return fallback for images
        if (event.request.destination === 'image') {
          return new Response(`
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150">
              <rect width="200" height="150" fill="#1f2937"/>
              <text x="100" y="75" text-anchor="middle" fill="#9ca3af" font-family="Arial" font-size="14">
                Image unavailable
              </text>
            </svg>
          `, {
            headers: { 'Content-Type': 'image/svg+xml' }
          });
        }
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Background sync for news updates
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Update news data in the background
      fetch('/assets/data/newsData.js')
        .then(response => response.text())
        .then(data => {
          return caches.open(CACHE_NAME)
            .then(cache => cache.put('/assets/data/newsData.js', new Response(data)));
        })
        .catch(err => console.log('Background sync failed:', err))
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New sports update available!',
    icon: '/android-chrome-192x192.png',
    badge: '/android-chrome-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Read More',
        icon: '/android-chrome-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/android-chrome-192x192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SportPulse', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
