const cacheName = 'static-restaurant-reviews-v5';
const indexURL = 'http://localhost:8000/';
//Caching data on install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
           return cache.addAll([
                '/index.html',
                '/restaurant.html',
                '/css/styles_tablet.css',
                '/css/styles_restaurant_small.css',
                '/css/styles.css',
                '/js/main.js',
                '/js/dbhelper.js',
                '/js/restaurant_info.js',
                '/data/restaurants.json'
            ]);
        })
    );
});


//Deleting old versions of cache on activation of the new service worker.
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if(key != cacheName) caches.delete(key);
                })
            )
        })
    )
});

//responding with cached data...
self.addEventListener('fetch', event => {

    const url = event.request.url;
    if (url === indexURL || url === indexURL.slice(0, indexURL.length-1))
        event.respondWith(
            caches.open(cacheName).then(cache => {
                return cache.match('/index.html').then(resp => resp);
            })
        )
    else if (url.endsWith('restaurant.html?id=', event.request.url.length-1))
        event.respondWith(
            caches.open(cacheName).then(cache => {
                return cache.match('/restaurant.html').then(resp => resp);
            })
        )
    else if(!url.startsWith('https://maps.googleapis.com'))
        event.respondWith(
            caches.open(cacheName).then(cache => {
                return cache.match(event.request.url).then(resp => {
                    return resp || fetch(event.request.url).catch(err => {
                       console.log(err);
                    });
                });
            })
        )
});