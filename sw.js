importScripts('js/sw-utils.js');
const STATIC_CACHE = "static-v3"
const DINAMIC_CACHE = "dinamic-v1"
const INMUTABLE_CACHE = "inmutable-v1"

const APP_SCHELL = [
    //'/',    
    'css/style.css',
    'img/avatars/hulk.jpg',
    'img/favicon.ico',
    'js/app.js',
    'js/sw-utils.js'
];
const APP_SCHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css'    
];

self.addEventListener('install', e => {
    const cacheStatic = caches.open( STATIC_CACHE).then(cache => cache.addAll(APP_SCHELL));
    const cacheInmutable = caches.open( INMUTABLE_CACHE).then(cache => cache.addAll(APP_SCHELL_INMUTABLE));
    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));

});
self.addEventListener('activate', e => {
    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if(key != STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            } 
        });
    });
    e.waitUntil(respuesta);
});
self.addEventListener('fetch', e => {
    const respuesta = caches.match(e.request).then(res => {
        if(res){
            return res;
        }else{
            return fetch(e.request).then(newRes => {
                return actualizaCacheDinamico(DINAMIC_CACHE,e.request,newRes);
            });
        }
    });
    e.respondWith(respuesta);
});