// BantayKaban service worker - scope /bantaykaban-pwa/
const V='bantaykaban-v1',B='/bantaykaban-pwa/';
const CORE=['','index.html','offline.html','css/styles.css','js/app.js','js/data.js','favicon.svg','manifest.webmanifest','icons/icon-192.png'].map(p=>B+p);
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET'||!r.url.startsWith(self.location.origin))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x}).catch(()=>caches.match(r).then(m=>m||caches.match(B+'offline.html'))));return}
 e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(x=>{const c=x.clone();caches.open(V).then(h=>h.put(r,c));return x}).catch(()=>m);return m||n}));
});
