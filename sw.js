const cacheName = 'static-restaurant-reviews-v4';
const indexURL = 'https://atwamahmoud.github.io/mws-restaurant-stage-1/';
//Caching data on install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
           return cache.addAll([
                'https://atwamahmoud.github.io/mws-restaurant-stage-1/index.html',
                'https://atwamahmoud.github.io/mws-restaurant-stage-1/restaurant.html',
                'https://atwamahmoud.github.io/mws-restaurant-stage-1/css/styles.css',
                'https://atwamahmoud.github.io/mws-restaurant-stage-1/js/main.js',
                'https://atwamahmoud.github.io/mws-restaurant-stage-1/js/dbhelper.js',
                'https://atwamahmoud.github.io/mws-restaurant-stage-1/js/restaurant_info.js',
                'https://atwamahmoud.github.io/mws-restaurant-stage-1/data/restaurants.json'
            ]);
        }).catch(err => {
            console.log(err);
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
        }).catch(err => {
            console.log(err);
        })
    )
});

//responding with cached data...
self.addEventListener('fetch', event => {

    const url = event.request.url;
    if (url === indexURL || url === indexURL.slice(0, indexURL.length-1) || url === indexURL + 'index.html')
        event.respondWith(
            caches.open(cacheName).then(cache => {
                return cache.match('https://atwamahmoud.github.io/mws-restaurant-stage-1/index.html').then(resp => resp);
            }).catch(err => {
                console.log(err);
            })
        )
    else if (url.endsWith('restaurant.html?id=', event.request.url.length-1))
        event.respondWith(
            caches.open(cacheName).then(cache => {
                return cache.match('https://atwamahmoud.github.io/mws-restaurant-stage-1/restaurant.html').then(resp => resp);
            }).catch(err => {
                console.log(err);
            })
        )
    else if(!url.startsWith('https://maps.googleapis.com'))
        event.respondWith(
            caches.open(cacheName).then(cache => {
                return cache.match(event.request.url).then(resp => {
                    return resp || fetch(event.request.url)
                }).catch(err => {
                    console.log(err);
                })
            })
        )
});
