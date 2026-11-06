(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],K='bk_',URL_='https://githubbest729.github.io/bantaykaban-pwa/';
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(K+k))??d}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem(K+k,JSON.stringify(v))}catch(e){}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const still=()=>document.body.classList.contains('battery-saver-mode')||matchMedia('(prefers-reduced-motion:reduce)').matches;
// Service worker + island status
if('serviceWorker'in navigator){addEventListener('load',()=>navigator.serviceWorker.register('sw.js',{scope:'/bantaykaban-pwa/'}).then(()=>navigator.serviceWorker.ready).then(()=>island()).catch(()=>{}));navigator.serviceWorker.addEventListener('controllerchange',island)}
function island(){$('#islt').textContent=(navigator.serviceWorker&&navigator.serviceWorker.controller)?'Shield Active • Offline Cached':'Shield Active • Caching…'}island();
// Toast + clipboard
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2300)}
async function copy(text,msg){try{await navigator.clipboard.writeText(text)}catch(e){const a=document.createElement('textarea');a.value=text;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(_){}a.remove()}toast(msg||'✓ Copied to clipboard')}
// Universal dialer: mobile = native tel:, desktop = copy number + pill toast
const coarse=matchMedia('(pointer:coarse)').matches;
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="tel:"]');if(!a)return;const n=a.dataset.n||a.getAttribute('href').slice(4);if(coarse)toast('Dialing '+n+'…');else{e.preventDefault();copy(n,'✓ Copied '+n+' to clipboard')}});
// Dynamic island
const isl=$('#isl'),ib=$('#islb'),id_=$('#isld');
function island_(o){isl.classList.toggle('open',o);ib.setAttribute('aria-expanded',o);id_.hidden=!o}
ib.onclick=()=>island_(!isl.classList.contains('open'));
document.addEventListener('click',e=>{if(!isl.contains(e.target))island_(false)});
// Display engines
const MODES={light:'',dark:'dark',sunlight:'sunlight-mode',battery:'battery-saver-mode'},TC={light:'#eaf0fb',dark:'#0A0D14',sunlight:'#ffffff',battery:'#000000'};
const mq=matchMedia('(prefers-color-scheme:dark)');
function mode(m){if(m!=='auto'&&!MODES.hasOwnProperty(m))m='auto';const eff=m==='auto'?(mq.matches?'dark':'light'):m;document.body.className=MODES[eff];$('meta[name=theme-color]').content=TC[eff];set('mode',m);$$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===m))}
$$('[data-mode]').forEach(b=>b.onclick=()=>mode(b.dataset.mode));mq.addEventListener&&mq.addEventListener('change',()=>{if(get('mode','auto')==='auto')mode('auto')});mode(get('mode','auto'));
// Vault readiness gauge
const CIRC=2*Math.PI*44;let done=get('cpr',[]),shown=0;
function count(to){const f=shown;shown=to;if(still()){$('#pct').textContent=to;return}const t0=performance.now();(function s(t){const k=Math.min(1,(t-t0)/700),v=Math.round(f+(to-f)*(1-Math.pow(1-k,3)));$('#pct').textContent=v;if(k<1)requestAnimationFrame(s)})(t0)}
function meter(){const p=Math.round(done.length/CPR.length*100),L=document.body.classList.contains('battery-saver-mode')?36:48;
$('#rf').style.strokeDashoffset=CIRC*(1-p/100);$('#rf').style.setProperty('--rc',`hsl(${Math.round(38+(152-38)*p/100)} 85% ${L}%)`);count(p);
$('#gs').textContent=p===100?'Vault Secured':p>=50?'Getting Stronger':'Exposed';$('#prog').textContent=done.length+' of '+CPR.length+' defenses active'}
$('#cpr').innerHTML=CPR.map((c,i)=>`<label class="sw"><input type="checkbox" data-i="${i}" ${done.includes(i)?'checked':''}><span class="tr"><svg><use href="#i-check"/></svg></span><span><b>${c[0]}</b> · ${esc(c[1])}</span></label>`).join('');
$('#cpr').onchange=e=>{const l=e.target.closest('label');done=$$('#cpr input:checked').map(x=>+x.dataset.i);set('cpr',done);meter();if(e.target.checked){l.classList.remove('pulse');void l.offsetWidth;l.classList.add('pulse');if(navigator.vibrate)navigator.vibrate(12)}};
meter();new MutationObserver(meter).observe(document.body,{attributes:true,attributeFilter:['class']});
$('#reset').onclick=()=>open('#mreset');$('#yes').onclick=()=>{done=[];set('cpr',[]);$$('#cpr input').forEach(x=>x.checked=false);meter();close('#mreset');toast('✓ Checklist reset')};
$('#circ').innerHTML=CIRCULARS.map(c=>`<details><summary>${esc(c.t)}</summary><ul>${c.b.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details>`).join('');
// Bank action cards
const META={'BDO Unibank':['#0b2a6b','Universal','https://www.bdo.com.ph'],'BPI':['#8c1230','Heritage','https://www.bpi.com.ph'],'Metrobank':['#1f4e9c','Universal','https://www.metrobank.com.ph'],'Landbank':['#0a7d3b','Government','https://www.landbank.com'],'UnionBank':['#e8731a','Universal','https://www.unionbankph.com'],'Security Bank':['#0087cf','Universal','https://www.securitybank.com'],'PNB':['#00529b','Universal','https://www.pnb.com.ph'],'GCash':['#0a5cff','Fast Pay','https://www.gcash.com'],'Maya':['#00c05a','Digital Bank','https://www.maya.ph'],'GoTyme Bank':['#0aa5c0','Digital','https://www.gotyme.com.ph'],'Tonik':['#6a1bd1','Digital','https://www.tonikbank.com'],'SeaBank':['#ff5a1f','Digital','https://www.seabank.ph'],'CIMB Bank PH':['#d81921','Digital','https://www.cimbbank.com.ph'],'Coins.ph':['#1a6bff','Crypto','https://coins.ph'],'PDAX':['#0d1b3d','Crypto','https://www.pdax.ph']};
const glyph=t=>/crypto/i.test(t)?'coin':/e-wallet/i.test(t)?'wallet':/digital/i.test(t)?'digi':'bank';
const script=n=>`URGENT: My ${n} account may be compromised. Please freeze my account/card now and log my fraud report.`;
function draw(q){const r=INSTITUTIONS.filter(i=>(i.name+' '+i.type).toLowerCase().includes(q.trim().toLowerCase()));
$('#dir').innerHTML=r.length?r.map((i,n)=>{const m=META[i.name]||['#1a5cff',i.type,DIRECTORY];return `<article class="bk" style="--c:${m[0]}"><span class="rib">${esc(m[1])}</span><div class="bh"><span class="gl"><svg class="ic"><use href="#i-${glyph(i.type)}"/></svg></span><div><h3>${esc(i.name)}</h3><small>${esc(i.type)}</small></div></div><p id="h${n}" hidden>${esc(i.how)}</p><div class="row"><button class="d" data-t="h${n}" data-s="${esc(i.name)}" aria-expanded="false">Emergency Freeze</button><a class="btn" href="${m[2]}" target="_blank" rel="noopener">Official site</a><button data-c="${esc(i.name)}">Copy</button></div></article>`}).join(''):`<p class="m w2">No institutions found. <a href="${DIRECTORY}">Check the BSP Consumer Assistance Directory</a></p>`}
$('#q').oninput=e=>draw(e.target.value);draw('');
$('#dir').onclick=e=>{const b=e.target.closest('[data-t]'),c=e.target.closest('[data-c]');if(b){const p=$('#'+b.dataset.t);p.hidden=!p.hidden;b.setAttribute('aria-expanded',!p.hidden);if(!p.hidden)copy(script(b.dataset.s),'✓ Freeze request copied. Call the number on your card.')}if(c)copy(script(c.dataset.c),'✓ Freeze request copied')};
// Phishing sandbox
const RULES=[
[/\b(otp|one[- ]time (pin|password)|verification code|mpin|pin\b|password|cvv|card number)/gi,3,'Asks for an OTP, PIN, password or card details. Banks never do.'],
[/\b(bit\.ly|tinyurl\.com|t\.co|cutt\.ly|rb\.gy|is\.gd|shorturl\.at|ow\.ly|s\.id)\S*/gi,2,'Shortened link hides the real destination.'],
[/https?:\/\/\d{1,3}(\.\d{1,3}){3}\S*/gi,3,'Link uses a raw IP address.'],
[/https?:\/\/[^\s/]*\.(xyz|top|click|icu|vip|cc|tk|ml|ga|cf|gq|buzz|live|site|online|shop)\b\S*/gi,2,'Link uses a domain type common in scams (.xyz, .top and similar).'],
[/\b(suspend(ed)?|deactivat\w*|blocked|locked|restricted|expire[sd]?|within \d+ ?(hours?|hrs?|mins?)|immediately|urgent|final notice|act now)\b/gi,2,'Urgency or threat of account suspension.'],
[/\b(congratulations|you (have )?won|winner|claim (your )?(prize|reward)|free (load|money|gcash)|ayuda|raffle)\b/gi,2,'Prize, ayuda or free-money bait.'],
[/\b(work from home|part[- ]time job|per day|guaranteed (return|profit)|double your|crypto signal)\b/gi,2,'Easy-income or guaranteed-return pitch.'],
[/\b(verify|update|confirm|reactivate)\b[^.!?\n]{0,40}\b(account|wallet|kyc|sim|details)\b/gi,2,'Pushes you to verify or update your account via a message.'],
[/\bhttp:\/\/\S+/gi,1,'Link is not secure (http).']];
const BR={gcash:/gcash\.com$/,maya:/(maya\.ph|paymaya\.com)$/,bdo:/bdo\.com\.ph$/,bpi:/bpi\.com\.ph$/,bsp:/bsp\.gov\.ph$/,metrobank:/metrobank\.com\.ph$/,unionbank:/unionbankph\.com$/,landbank:/landbank\.com$/};
function scan(snd,t){const R=[],F=[];let s=0;
RULES.forEach(([re,w,m])=>{re.lastIndex=0;let x,h=false;while((x=re.exec(t))){h=true;R.push([x.index,x.index+x[0].length]);if(!x[0].length)re.lastIndex++}if(h){s+=w;F.push(m)}});
const re=/https?:\/\/[^\s/]+\S*/gi;let x;while((x=re.exec(t))){const host=x[0].replace(/^https?:\/\//i,'').split(/[\/?#]/)[0].toLowerCase().replace(/^www\./,'');for(const b in BR){if(host.includes(b)&&!BR[b].test(host)){s+=3;F.push('Link imitates '+b.toUpperCase()+' but "'+host+'" is not its official domain.');R.push([x.index,x.index+x[0].length])}}}
const bank=/\b(gcash|maya|bdo|bpi|bsp|metrobank|unionbank|landbank)\b/i.test(t);const n=(snd||'').replace(/[\s-]/g,'');
if(bank&&/^(\+?63|0)9\d{9}$/.test(n)){s+=2;F.push('A bank or e-wallet is named but the sender is a plain mobile number. Banks usually text from registered sender names.')}
if(bank&&/https?:\/\//i.test(t)&&!F.some(f=>/imitates/.test(f))){s+=1;F.push('Bank or e-wallet name plus a link. Open the official app instead.')}
return{s,F,R}}
function mark(t,R){R.sort((a,b)=>a[0]-b[0]);const M=[];R.forEach(r=>{const l=M[M.length-1];if(l&&r[0]<=l[1])l[1]=Math.max(l[1],r[1]);else M.push(r.slice())});let o='',p=0;M.forEach(([a,b])=>{o+=esc(t.slice(p,a))+'<mark>'+esc(t.slice(a,b))+'</mark>';p=b});return o+esc(t.slice(p))}
$('#chk').onclick=()=>{const t=$('#scam').value.trim(),v=$('#verdict');if(!t){v.innerHTML='<p class="m">Paste a message or link first.</p>';return}
const{s,F,R}=scan($('#snd').value,t),k=s>=5?['bad','High Risk']:s>=2?['warn','Suspicious']:['ok','Clean Pattern'];
v.innerHTML=`<div class="v ${k[0]}"><span class="badge">${k[1]}</span>${F.length?'<ul>'+F.map(f=>`<li>${esc(f)}</li>`).join('')+'</ul>':'<p class="m">No known scam patterns found. This is a pattern check, not a guarantee. Never share OTPs.</p>'}${R.length?`<div class="hl">${mark(t,R)}</div>`:''}${s>=2?'<p class="m">Do not click or reply. Report to CICC 1326 or cicc.gov.ph/report.</p>':''}</div>`};
$('#clr').onclick=()=>{$('#scam').value='';$('#snd').value='';$('#verdict').innerHTML=''};
// Sheets
function open(id){$(id).classList.add('on');document.body.style.overflow='hidden'}
function close(id){(id?[$(id)]:$$('.sheet.on')).forEach(s=>s.classList.remove('on'));if(!$$('.sheet.on').length)document.body.style.overflow=''}
$$('.sheet').forEach(s=>s.addEventListener('click',e=>{if(e.target===s||e.target.closest('.close'))close()}));
addEventListener('keydown',e=>{if(e.key==='Escape'){close();island_(false)}});
// Lockdown
const STEPS=[
{t:'Freeze your app / card',d:'Use the lock or freeze option in the official bank or e-wallet app. Change your password.',c:'EMERGENCY: I need to freeze my account/card immediately due to suspected fraud.'},
{t:'Call your bank hotline',d:'Use the number on the back of your card or in the official app. Ask to block the account.',c:'My account was compromised. Please block my account and card now and note my complaint.',a:['Find my bank','#dir-s']},
{t:'Report to CICC 1326',d:'Call the 24/7 hotline or report online. Keep screenshots and transaction IDs.',c:'1326',a:['Call 1326','tel:1326']},
{t:'Escalate to BSP Online Buddy',d:'If your bank does not help, file with BSP Online Buddy (BOB).',c:'consumeraffairs@bsp.gov.ph',a:['Messenger','https://www.m.me/BangkoSentralngPilipinas']}];
$('#steps').innerHTML=STEPS.map((s,i)=>`<li><b>${esc(s.t)}</b><span class="m">${esc(s.d)}</span><div class="row"><button data-c="${i}">Copy</button>${s.a?`<a class="btn p ${s.a[1].startsWith('tel')?'tel':''}" href="${s.a[1]}" data-n="1326" ${s.a[1][0]==='#'?'data-go':''}>${s.a[0]}</a>`:''}</div></li>`).join('');
$('#steps').onclick=e=>{const b=e.target.closest('[data-c]');if(b)copy(STEPS[b.dataset.c].c,'✓ Copied for quick escalation');if(e.target.closest('[data-go]'))close()};
$('#copyall').onclick=()=>copy(STEPS.map((s,i)=>(i+1)+'. '+s.t+': '+s.d).join('\n'),'✓ All steps copied');
$('#lock').onclick=()=>open('#mlock');$('#lock2').onclick=()=>{island_(false);open('#mlock')};if(location.hash==='#lockdown')open('#mlock');
// Install guide
const ios=/iphone|ipad/i.test(navigator.userAgent);let dp=null;
$('#hometext').textContent=ios?'Tap Share in Safari, then "Add to Home Screen".':'Use your browser menu, then "Install app" or "Add to Home screen".';
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;$('#install').hidden=false});
$('#install').onclick=()=>{if(dp){dp.prompt();dp=null;$('#install').hidden=true}};$('#a2hs').onclick=()=>open('#mhelp');
// Dock active section
const tabs=$$('.dock a');tabs.forEach(a=>a.addEventListener('click',()=>tabs.forEach(x=>x.classList.toggle('on',x===a))));
if('IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)tabs.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+en.target.id))}),{rootMargin:'-35% 0px -55% 0px'});['cpr-s','dir-s','scam-s','set-s'].forEach(i=>io.observe($('#'+i)))}
// Share
async function share(text){const d={title:'BantayKaban',text,url:URL_};try{if(navigator.share)await navigator.share(d);else copy(text+' '+URL_,'✓ Link copied to clipboard')}catch(e){if(e.name!=='AbortError')toast('Could not share')}}
$('#share').onclick=()=>share('Scam emergency? Call CICC 1326, then BSP Online Buddy (BOB). Check the BantayKaban checklist:');
$('#sharel').onclick=()=>share('Emergency lockdown steps:\n'+STEPS.map((s,i)=>(i+1)+'. '+s.t).join('\n'));
})();
