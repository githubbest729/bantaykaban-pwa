(function(){
const $=s=>document.querySelector(s),K='bk_';
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(K+k))??d}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem(K+k,JSON.stringify(v))}catch(e){}};
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js',{scope:'/bantaykaban-pwa/'}).catch(()=>{}));
// Modes: light, dark, sunlight, battery
const MODES={light:'',dark:'dark',sunlight:'sunlight-mode',battery:'battery-saver-mode'},TC={light:'#0b2a5b',dark:'#0a1226',sunlight:'#ffffff',battery:'#000000'};
function mode(m){document.body.className=MODES[m];$('meta[name=theme-color]').content=TC[m];set('mode',m);document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m))}
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>mode(b.dataset.mode));mode(get('mode','light'));
// CPR checklist
const done=get('cpr',[]);$('#cpr').innerHTML=CPR.map((c,i)=>`<label class="i"><input type="checkbox" style="width:auto" data-i="${i}" ${done.includes(i)?'checked':''}><span><b>${c[0]}:</b> ${c[1]}</span></label>`).join('');
$('#cpr').onchange=e=>{const a=[...document.querySelectorAll('#cpr input:checked')].map(x=>+x.dataset.i);set('cpr',a);$('#prog').textContent=a.length+'/'+CPR.length+' done'};$('#prog').textContent=done.length+'/'+CPR.length+' done';
// Circulars
$('#circ').innerHTML=CIRCULARS.map(c=>`<details><summary>${c.t}</summary><ul>${c.b.map(x=>`<li>${x}</li>`).join('')}</ul></details>`).join('');
// Directory search
function draw(q){const r=INSTITUTIONS.filter(i=>(i.name+i.type).toLowerCase().includes(q.toLowerCase()));$('#dir').innerHTML=r.map(i=>`<details><summary>${i.name} <span class="m">· ${i.type}</span></summary><p>${i.how}</p><a href="${DIRECTORY}">BSP directory</a></details>`).join('')||'<p class="m">No match.</p>'}
$('#q').oninput=e=>draw(e.target.value);draw('');
// Lockdown
$('#steps').innerHTML=LOCKDOWN.map(s=>`<li>${s}</li>`).join('');
const M=id=>$(id).classList;$('#lock').onclick=()=>M('#mlock').add('on');$('#a2hs').onclick=()=>M('#mhome').add('on');
document.querySelectorAll('.close').forEach(b=>b.onclick=()=>b.closest('.modal').classList.remove('on'));
if(location.hash==='#lockdown')M('#mlock').add('on');
const ios=/iphone|ipad/i.test(navigator.userAgent);$('#hometext').textContent=ios?'In Safari tap Share, then "Add to Home Screen".':'In Chrome tap the menu (⋮), then "Install app" or "Add to Home screen".';
// Share
async function share(text){const d={title:'BantayKaban',text,url:'https://githubbest729.github.io/bantaykaban-pwa/'};try{if(navigator.share)await navigator.share(d);else{await navigator.clipboard.writeText(text+' '+d.url);alert('Copied to clipboard')}}catch(e){}}
$('#share').onclick=()=>share('Scam emergency? Call CICC 1326, then BSP Online Buddy (BOB). Check the BantayKaban checklist:');
$('#sharel').onclick=()=>share('Emergency lockdown steps:\n'+LOCKDOWN.map((s,i)=>(i+1)+'. '+s).join('\n'));
})();
