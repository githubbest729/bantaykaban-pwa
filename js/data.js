// Data catalog. Bank hotlines are intentionally not hardcoded: use the number on your card / official app / BSP directory.
const DIRECTORY='https://www.bsp.gov.ph';
const INSTITUTIONS=[
['BDO Unibank','Universal bank'],['BPI','Universal bank'],['Metrobank','Universal bank'],['Landbank','Government bank'],['UnionBank','Universal bank'],['Security Bank','Universal bank'],['PNB','Universal bank'],['GCash','E-wallet'],['Maya','E-wallet / digital bank'],['GoTyme Bank','Digital bank'],['Tonik','Digital bank'],['SeaBank','Digital bank'],['CIMB Bank PH','Digital bank'],['Coins.ph','E-wallet / crypto'],['PDAX','Crypto exchange']
].map(([name,type])=>({name,type,how:'Freeze via the in-app security/lock option, then call the hotline printed on your card or in the official app Help page. Verify at the BSP directory.'}));
const CPR=[
['Check','Verify links and senders; banks never ask for OTP, PIN or password.'],['Check','Type the bank URL yourself or use the official app only.'],['Protect','Enable biometrics/passkey and app lock; avoid SMS-OTP where a stronger option exists.'],['Protect','Set transaction limits and alerts on every account and e-wallet.'],['Protect','Never share screens, OTPs or card details, even with "bank staff".'],['Report','Call your bank, then CICC 1326, then escalate to BSP Online Buddy (BOB).']];
const CIRCULARS=[
{t:'BSP Circular 1213 (2025)',b:['Stronger multi-factor authentication: biometrics, FIDO2/passkeys, adaptive/behavioral checks over plain SMS/email OTP.','Real-time Fraud Management Systems at supervised institutions.','As a consumer: enable passkeys/biometrics and report unusual alerts immediately.']},
{t:'BSP Circular 1232 (2026)',b:['Cybersecurity Maturity Framework and Control Self-Assessment for supervised institutions.','As a consumer: prefer institutions listed in the BSP directory.']},
{t:'RA 11765 (FPSCPA)',b:['Financial consumer protection framework: fair treatment, disclosure, redress.','Escalate unresolved complaints to your provider, then BSP BOB.']},
{t:'PDIC Insurance',b:['Up to ₱1,000,000 per depositor per bank. Does not cover fraud losses or crypto.']},
{t:'SEC and Capital Markets',b:['Avoid unregistered CASPs and "guaranteed return" schemes. Check SEC advisories before investing.']}];
const LOCKDOWN=['Freeze the card / e-wallet in the official app or by hotline.','Call your bank fraud desk (number on your card) and request account block.','Change passwords; enable passkey/biometrics; log out other devices.','Report to CICC: call 1326 or https://cicc.gov.ph/report','File a formal ticket with BSP Online Buddy: m.me/BangkoSentralngPilipinas or consumeraffairs@bsp.gov.ph','Keep screenshots, reference numbers and transaction IDs.'];
