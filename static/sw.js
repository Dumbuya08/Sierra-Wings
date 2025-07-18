/**
 * SierraWings Service Worker
 * Handles caching and offline functionality for PWA
 */

const CACHE_NAME = 'sierrawings-v1.0.0';
const urlsToCache = [
    '/',
    '/static/css/medical-theme.css',
    '/static/css/gamification.css',
    '/static/js/main.js',
    '/static/js/gamification.js',
    '/static/js/toast.js',
    '/static/js/pwa.js',
    '/static/images/icon-72x72.png',
    '/static/images/icon-96x96.png',
    '/static/images/icon-128x128.png',
    '/static/images/icon-144x144.png',
    '/static/images/icon-152x152.png',
    '/static/images/icon-192x192.png',
    '/static/images/icon-384x384.png',
    '/static/images/icon-512x512.png',
    '/static/images/sierrawings-logo.png',
    '/static/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate event - update cache
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
        })
    );
});

// Push notification handler
self.addEventListener('push', (event) => {
    if (event.data) {
        const notificationData = event.data.json();
        
        const options = {
            body: notificationData.body,
            icon: '/static/images/icon-192x192.png',
            badge: '/static/images/icon-96x96.png',
            data: notificationData.data,
            actions: [
                {
                    action: 'view',
                    title: 'View',
                    icon: '/static/images/icon-72x72.png'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(notificationData.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});