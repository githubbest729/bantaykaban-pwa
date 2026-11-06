// BantayKaban service worker - scope /bantaykaban-pwa/
const V='bantaykaban-v2',B='/bantaykaban-pwa/';
const CORE=['','index.html','offline.html','css/styles.css','js/app.js','js/data.js','favicon.svg','manifest.webmanifest','icons/icon-192.png'].map(p=>B+p);
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const put=(r,x)=>{if(x&&x.ok){const c=x.clone();caches.open(V).then(h=>h.put(r,c)).catch(()=>{})}return x};
const offline=()=>caches.match(B+'offline.html').then(m=>m||new Response('Offline. CICC hotline: 1326',{status:503,headers:{'Content-Type':'text/plain'}}));
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET'||!r.url.startsWith(self.location.origin))return;
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>put(r,x)).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match(B)).then(m=>m||offline())));return}
 e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(x=>put(r,x)).catch(()=>m||Response.error());return m||n}));
});
