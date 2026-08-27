const CACHE = 'essence-life-shell-v45-smart-day';
self.addEventListener('install', event => { event.waitUntil(self.skipWaiting()) });
self.addEventListener('activate', event => { event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()])) });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(async () => (await caches.match(event.request)) || (event.request.mode === 'navigate' ? await caches.match('/') : undefined) || Response.error()));
});
self.addEventListener('push',event=>{let data={};try{data=event.data?.json()||{}}catch{};event.waitUntil(self.registration.showNotification(data.title||'Essence Life',{body:data.body||'Você tem um lembrete esperando por você ✨',icon:'/icon-192.png',badge:'/icon-192.png',tag:data.tag||'essence-push-reminder',data:{url:data.url||'/app'}}))});
self.addEventListener('notificationclick',event=>{event.notification.close();const target=event.notification.data?.url||'/app';event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{const opened=list.find(client=>'focus' in client);if(opened){opened.navigate(target);return opened.focus()}return clients.openWindow(target)}))});