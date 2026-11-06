(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],K='bk_',URL_='https://githubbest729.github.io/bantaykaban-pwa/';
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(K+k))??d}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem(K+k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js',{scope:'/bantaykaban-pwa/'}).catch(()=>{}));
// Toast + clipboard
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)}
async function copy(text,msg){try{await navigator.clipboard.writeText(text)}catch(e){const a=document.createElement('textarea');a.value=text;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(_){}a.remove()}toast(msg||'Copied to clipboard!')}
// tel: mobile = dialer, desktop = copy number + toast
const coarse=matchMedia('(pointer:coarse)').matches;
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="tel:"]');if(!a)return;const n=a.getAttribute('href').slice(4);if(coarse){toast('Dialing '+n+'…')}else{e.preventDefault();copy(n,'Hotline copied to clipboard!')}});
// Display modes
const MODES={light:'',dark:'dark',sunlight:'sunlight-mode',battery:'battery-saver-mode'},TC={light:'#0b2a5b',dark:'#070d1c',sunlight:'#ffffff',battery:'#000000'};
function mode(m){if(!MODES.hasOwnProperty(m))m='light';document.body.className=MODES[m];$('meta[name=theme-color]').content=TC[m];set('mode',m);$$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m))}
$$('[data-mode]').forEach(b=>b.onclick=()=>mode(b.dataset.mode));mode(get('mode','light'));
// Defense meter + CPR toggles
const C=2*Math.PI*44;let done=get('cpr',[]);
function meter(){const p=Math.round(done.length/CPR.length*100);$('#rf').style.strokeDashoffset=C*(1-p/100);$('#pct').textContent=p+'%';$('#prog').textContent=done.length+' of '+CPR.length+' defenses active'}
$('#cpr').innerHTML=CPR.map((c,i)=>`<label class="sw"><input type="checkbox" data-i="${i}" ${done.includes(i)?'checked':''}><span class="tr"></span><span><b>${c[0]}</b> · ${esc(c[1])}</span></label>`).join('');
$('#cpr').onchange=e=>{const l=e.target.closest('label');done=$$('#cpr input:checked').map(x=>+x.dataset.i);set('cpr',done);meter();if(e.target.checked){l.classList.remove('pulse');void l.offsetWidth;l.classList.add('pulse');if(navigator.vibrate)navigator.vibrate(15)}};
meter();
$('#reset').onclick=()=>open('#mreset');$('#yes').onclick=()=>{done=[];set('cpr',[]);$$('#cpr input').forEach(x=>x.checked=false);meter();close('#mreset');toast('Checklist reset')};
// Circulars
$('#circ').innerHTML=CIRCULARS.map(c=>`<details><summary>${esc(c.t)}</summary><ul>${c.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`).join('');
// Bank bento directory
const COL={'BDO Unibank':'#0b3a8f','BPI':'#c8102e','Metrobank':'#1f4e9c','Landbank':'#0a7d3b','UnionBank':'#e8731a','Security Bank':'#0087cf','PNB':'#00529b','GCash':'#0069ff','Maya':'#00a84a','GoTyme Bank':'#0aa5c0','Tonik':'#6a1bd1','SeaBank':'#ff5a1f','CIMB Bank PH':'#d81921','Coins.ph':'#1a6bff','PDAX':'#0d1b3d'};
function draw(q){const r=INSTITUTIONS.filter(i=>(i.name+' '+i.type).toLowerCase().includes(q.trim().toLowerCase()));
$('#dir').innerHTML=r.length?r.map((i,n)=>`<article class="bk" style="--c:${COL[i.name]||'#0a47d1'}"><h3>${esc(i.name)}</h3><span class="tag">${esc(i.type)}</span><p id="h${n}" hidden>${esc(i.how)}</p><div class="row"><button class="p" data-t="h${n}" aria-expanded="false">Freeze steps</button><a class="btn" href="${DIRECTORY}">Verify at BSP</a></div></article>`).join(''):`<p class="m">No institutions found. <a href="${DIRECTORY}">Check the BSP Consumer Assistance Directory</a></p>`}
$('#q').oninput=e=>draw(e.target.value);draw('');
$('#dir').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;const p=$('#'+b.dataset.t);p.hidden=!p.hidden;b.setAttribute('aria-expanded',!p.hidden)};
// Scam checker (client-side heuristics)
const RULES=[
[/\b(otp|one[- ]time (pin|password)|verification code|mpin|pin\b|password|cvv|card number)/i,3,'Asks for an OTP, PIN, password or card details. Real banks never do.'],
[/(bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy|is\.gd|shorturl|ow\.ly|s\.id)/i,2,'Uses a shortened link that hides the real destination.'],
[/https?:\/\/\d{1,3}(\.\d{1,3}){3}/i,3,'Link uses a raw IP address instead of a real domain.'],
[/https?:\/\/[^\s]*\.(xyz|top|click|icu|vip|cc|tk|ml|ga|cf|gq|buzz|live|site|online|shop)\b/i,2,'Link ends in a domain type often used by scammers.'],
[/\b(suspend|suspended|deactivat|blocked|locked|restricted|expire|within \d+ ?(hours?|hrs?|mins?)|immediately|urgent|final notice|act now)/i,2,'Creates urgency or threatens account suspension.'],
[/\b(congratulations|you (have )?won|winner|claim (your )?(prize|reward)|free (load|money|gcash)|ayuda|cash ?out promo|raffle)/i,2,'Promises a prize, ayuda or free money.'],
[/\b(job offer|part[- ]time|work from home|per day|investment|guaranteed (return|profit)|double your|crypto signal)/i,2,'Offers easy income or guaranteed investment returns.'],
[/\b(verify|update|confirm|reactivate)\b.*\b(account|wallet|kyc|sim|details)/i,2,'Asks you to verify or update your account through a link.'],
[/^http:\/\//im,1,'Link is not secure (http, not https).']];
const BRANDS={gcash:/gcash\.com$/,maya:/(maya\.ph|paymaya\.com)$/,bdo:/bdo\.com\.ph$/,bpi:/bpi\.com\.ph$/,bsp:/bsp\.gov\.ph$/,metrobank:/metrobank\.com\.ph$/,unionbank:/unionbankph\.com$/,landbank:/landbank\.com$/};
function analyze(t){const f=[];let s=0;RULES.forEach(([re,w,m])=>{if(re.test(t)){s+=w;f.push(m)}});
(t.match(/https?:\/\/[^\s/]+/gi)||[]).forEach(u=>{const h=u.replace(/^https?:\/\//i,'').toLowerCase();for(const b in BRANDS){if(h.includes(b)&&!BRANDS[b].test(h.replace(/^www\./,''))){s+=3;f.push('Link imitates '+b.toUpperCase()+' but is not its official domain ('+h+').')}}});
if(/\b(gcash|maya|bdo|bpi|bsp|metrobank|unionbank|landbank)\b/i.test(t)&&/https?:\/\//i.test(t)&&!/\b(official|bsp\.gov\.ph)\b/i.test(t)&&!f.some(x=>/imitates/.test(x))){s+=1;f.push('Mentions a bank or e-wallet with a link. Open the official app instead of the link.')}
return{s,f}}
$('#chk').onclick=()=>{const t=$('#scam').value.trim();const v=$('#verdict');if(!t){v.innerHTML='<p class="m">Paste a message or link first.</p>';return}
const{s,f}=analyze(t);const k=s>=5?['bad','Likely a scam']:s>=2?['warn','Suspicious']:['ok','No red flags found'];
v.innerHTML=`<div class="v ${k[0]}"><h3>${k[1]}</h3>${f.length?'<ul>'+f.map(x=>`<li>${esc(x)}</li>`).join('')+'</ul>':'<p class="m">This is only a quick pattern check, not a guarantee. Never share OTPs and open banks via their official app.</p>'}${s>=2?'<p class="m">Do not click or reply. Report to CICC 1326 or cicc.gov.ph/report.</p>':''}</div>`};
$('#clr').onclick=()=>{$('#scam').value='';$('#verdict').innerHTML=''};
// Sheets
const open=id=>{$(id).classList.add('on');document.body.style.overflow='hidden'};
const close=id=>{(id?[$(id)]:$$('.sheet.on')).forEach(s=>s.classList.remove('on'));if(!$$('.sheet.on').length)document.body.style.overflow=''};
$$('.sheet').forEach(s=>s.addEventListener('click',e=>{if(e.target===s||e.target.closest('.close'))close()}));
addEventListener('keydown',e=>{if(e.key==='Escape')close()});
// Emergency lockdown
const STEPS=[
{t:'Freeze your app / card',d:'Use the lock or freeze option in the official bank or e-wallet app. Change your password.',c:'EMERGENCY: I need to freeze my account/card immediately due to suspected fraud.'},
{t:'Call your bank hotline',d:'Use the number on the back of your card or inside the official app. Ask to block the account.',c:'My account was compromised. Please block my account and card now and note my complaint.',a:['Find my bank','#dir-s']},
{t:'Report to CICC 1326',d:'Call the 24/7 hotline or report online. Keep screenshots and transaction IDs.',c:'1326',a:['Call 1326','tel:1326']},
{t:'Escalate to BSP Online Buddy',d:'If your bank does not help, file with BSP Online Buddy (BOB).',c:'consumeraffairs@bsp.gov.ph',a:['Messenger','https://www.m.me/BangkoSentralngPilipinas']}];
$('#steps').innerHTML=STEPS.map((s,i)=>`<li><b>${esc(s.t)}</b><span class="m">${esc(s.d)}</span><div class="row"><button data-c="${i}">Copy</button>${s.a?`<a class="btn p ${s.a[1].startsWith('tel')?'tel':''}" href="${s.a[1]}" ${s.a[1][0]==='#'?'data-go':''}>${s.a[0]}</a>`:''}</div></li>`).join('');
$('#steps').onclick=e=>{const b=e.target.closest('[data-c]');if(b)copy(STEPS[b.dataset.c].c,'Copied for quick escalation!');if(e.target.closest('[data-go]'))close()};
$('#copyall').onclick=()=>copy(STEPS.map((s,i)=>(i+1)+'. '+s.t+': '+s.d).join('\n'),'All steps copied!');
$('#lock').onclick=()=>open('#mlock');if(location.hash==='#lockdown')open('#mlock');
// Help / install
const ios=/iphone|ipad/i.test(navigator.userAgent);let dp=null;
$('#hometext').textContent=ios?'Install: tap Share in Safari, then "Add to Home Screen".':'Install: use your browser menu, then "Install app" or "Add to Home screen".';
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#install').hidden=false});
$('#install').onclick=async()=>{if(dp){dp.prompt();dp=null;$('#install').hidden=true}};
$('#help').onclick=$('#a2hs').onclick=()=>open('#mhelp');
if(!get('seen',false)){set('seen',true);setTimeout(()=>open('#mhelp'),700)}
// Tabs highlight
const tabs=$$('.tabs a[href^="#"]');
tabs.forEach(a=>a.addEventListener('click',()=>{tabs.forEach(x=>x.classList.toggle('on',x===a))}));
// Share
async function share(text){const d={title:'BantayKaban',text,url:URL_};try{if(navigator.share)await navigator.share(d);else copy(text+' '+URL_,'Link copied to clipboard!')}catch(e){if(e.name!=='AbortError')toast('Could not share')}}
$('#share').onclick=()=>share('Scam emergency? Call CICC 1326, then BSP Online Buddy (BOB). Check the BantayKaban checklist:');
$('#sharel').onclick=()=>share('Emergency lockdown steps:\n'+STEPS.map((s,i)=>(i+1)+'. '+s.t).join('\n'));
})();
