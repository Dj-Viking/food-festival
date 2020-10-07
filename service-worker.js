//cant hardcode absolute paths here for this to work in dev and production
//since this page is going to be hosted at github.io/projectname subroute
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./assets/img/favicon.ico",
  "./dist/app.bundle.js",
  "./dist/main.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js"
];
const APP_PREFIX = 'FoodFest-';
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION;

//service workers run before the window object is created
// the self keyword used to instantiate listeners on the service worker.
// the context of self refers to the service worker object
// using event.waitUntil to tell the browser to wait until the work is
// complete before terminating the service worker.
// this ensures that the service worker doesn't move on from the
// installing phase until it's finished executing all of its code.

// caches.open used to fued the specific cache by name, then add
// every file in the files-to-cache array to the cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('installing cache : ' + CACHE_NAME);
      caches.open(CACHE_NAME).then(cache => cache.keys()).then(requests => requests.map(request => request.url)).then(console.log)
      return cache.addAll(FILES_TO_CACHE);
    })
    .catch(e => console.log(e))
  );
});
//check the cache in the browser console with this
/**
 * caches.open('cache-name').then(cache => cache.keys()).then(requests => requests.map(request => request.url)).then(console.log)
 */

//activation step, clear out old ata from cache and then 
// tell service worker how to manage caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
    .then(
      keyList => {
        let cacheKeepList = keyList.filter(key => key.indexOf(APP_PREFIX));
        cacheKeepList.push(CACHE_NAME);
        return Promise.all
        (
          keyList.map(
            (key, i) => {
              if (cacheKeepList.indexOf(key) === -1) {
                console.log('deleting cache : ' + keyList[i]);
                return caches.delete(keyList[i]);
              }
            }
          )
        );
      }
    )
    .catch(e => console.log(e))
  );
});

//offline functionality for using cached resources instead of fetching them.
// listen for the fetch event to happen,
// log the URL of the requested resource, and
// begin to define how we will respond to the request
// using respondWith to intercept the fetch request. 
// then check if the request is stored in the cache or not.
// if it is stored in the cache, event.respondWith will deliver
// the resource directly from the cache; otherwise the resource
// will be retrieved normally.
self.addEventListener('fetch', function(event) {
  //console.log('fetch request : ' + event.request.url);  
  event.respondWith(
    caches.match(event.request)
    .then(
      request => {
        //console.log("\x1b[33m", "request being returned from .match(event.request)", "\x1b[00m");
        //console.log(request);
        if (request) {
          console.log('responding with cache : ' + event.request.url);
          return request;
        } else {
          console.log('file is not cached, instead we fetch : ' + event.request.url);
          return fetch(event.request);
        }
        // if (request) request || fetch(event.request);
      }
    )
    .then(response => { console.log(response); return Promise.resolve(response); })
    .catch(e => console.log(e))
  )
});

//service worker is the first code that runs in the application
// even before index.html or any other js file
// so long as the browser supports service workers, the service
// worker will run regardless of whether or not the user is connected
// to the internet. meaning if the app code was updated, the service
// worker will still load the old files.
 