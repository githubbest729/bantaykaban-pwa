// npm i jszip sharp && node generate-zip.js  -> bantaykaban-pwa.zip
const fs=require('fs'),JSZip=require('jszip'),sharp=require('sharp');
(async()=>{const z=new JSZip();
for(const f of ['index.html','manifest.webmanifest','sw.js','offline.html','favicon.svg','css/styles.css','js/app.js','js/data.js','images/og-image.svg'])z.file(f,fs.readFileSync(f));
const svg=fs.readFileSync('favicon.svg');
const ic=async(n,s,pad)=>{let b=sharp(svg).resize(s-pad*2,s-pad*2);if(pad)b=sharp({create:{width:s,height:s,channels:4,background:'#0b2a5b'}}).composite([{input:await b.png().toBuffer(),gravity:'center'}]);z.file(n,await b.png().toBuffer())};
await ic('icons/icon-192.png',192,0);await ic('icons/icon-512.png',512,0);await ic('icons/apple-touch-icon.png',180,0);await ic('icons/icon-maskable-192.png',192,24);await ic('icons/icon-maskable-512.png',512,64);
z.file('images/og-image.png',await sharp(fs.readFileSync('images/og-image.svg')).resize(1200,630).png().toBuffer());
fs.writeFileSync('bantaykaban-pwa.zip',await z.generateAsync({type:'nodebuffer'}));console.log('done')})();
