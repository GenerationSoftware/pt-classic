const s=location.pathname.split("/").slice(0,-1).join("/"),p=[s+"/_app/immutable/entry/app.BLOQuVHI.js",s+"/_app/immutable/nodes/0.DbZiRbQV.js",s+"/_app/immutable/assets/0.BqLpGGQJ.css",s+"/_app/immutable/nodes/1.CYPgvdE0.js",s+"/_app/immutable/nodes/2.kvzlIo-J.js",s+"/_app/immutable/assets/2.DKV3EJdh.css",s+"/_app/immutable/nodes/3.B-B17cou.js",s+"/_app/immutable/assets/3.xdVXrGnb.css",s+"/_app/immutable/nodes/4.DFuZhzgD.js",s+"/_app/immutable/assets/4.DhFmVoJX.css",s+"/_app/immutable/nodes/5.DtV-uCzk.js",s+"/_app/immutable/assets/5.C2SEPwkZ.css",s+"/_app/immutable/nodes/6.BBBtB2w9.js",s+"/_app/immutable/assets/6.DWcjGI53.css",s+"/_app/immutable/assets/BackButton.UmthfXVw.css",s+"/_app/immutable/chunks/BackButton.DnufDsem.js",s+"/_app/immutable/assets/Confetti.CMdB0EhX.css",s+"/_app/immutable/chunks/Confetti.Byt4YXA7.js",s+"/_app/immutable/assets/ConfigModalBanner.HG6IbBJI.css",s+"/_app/immutable/chunks/ConfigModalBanner.CG09YgvU.js",s+"/_app/immutable/assets/DepositCard.gVd0X8ta.css",s+"/_app/immutable/chunks/DepositCard.Cup8Fx0Q.js",s+"/_app/immutable/assets/Loading.Jj6PGg9g.css",s+"/_app/immutable/chunks/Loading.BgkMO5iK.js",s+"/_app/immutable/assets/WalletConnectionModal.qw-cFW7b.css",s+"/_app/immutable/chunks/WalletConnectionModal.jbhDg1oT.js",s+"/_app/immutable/chunks/entry.B3TOaZIE.js",s+"/_app/immutable/chunks/index.-yqi0WvP.js",s+"/_app/immutable/chunks/index.BX6i05FA.js",s+"/_app/immutable/chunks/index.C0C0tZ2p.js",s+"/_app/immutable/chunks/preload-helper.C1FmrZbK.js",s+"/_app/immutable/chunks/scheduler.BtZbm0j3.js",s+"/_app/immutable/chunks/stores.DVPm4r5o.js",s+"/_app/immutable/chunks/vectorMath.D1-glhvy.js",s+"/_app/immutable/entry/start.Qfg_E7sn.js",s+"/_app/immutable/chunks/ccip.BofXx1oo.js"],m=[s+"/.nojekyll",s+"/abstract-pooly.jpg",s+"/background.svg",s+"/favicon.ico",s+"/fonts/inter/inter-bold.woff",s+"/fonts/inter/inter-medium.woff",s+"/fonts/inter/inter-regular.woff",s+"/fonts/inter/inter-semibold.woff",s+"/icons/account.svg",s+"/icons/check.svg",s+"/icons/double-right.svg",s+"/icons/down.svg",s+"/icons/hamburger.svg",s+"/icons/help.svg",s+"/icons/left.svg",s+"/icons/sparkle.svg",s+"/icons/trophy.svg",s+"/icons/up.svg",s+"/icons/user.svg",s+"/icons/wallet.svg",s+"/manifest.json",s+"/pooltogether-small.svg",s+"/pooltogether-square.svg",s+"/pooltogether.svg",s+"/pooly.svg",s+"/success-pooly.svg"],l="0.2.0",n=`ptc-cache-${l}`,o=[...p,...m];self.addEventListener("install",a=>{async function t(){await(await caches.open(n)).addAll(o)}a.waitUntil(t())});self.addEventListener("activate",a=>{const t=async()=>{for(const e of await caches.keys())e!==n&&await caches.delete(e)};a.waitUntil(t())});self.addEventListener("fetch",a=>{if(a.request.method!=="GET")return;const t=async()=>{const e=new URL(a.request.url),c=await caches.open(n);if(o.includes(e.pathname)){const i=await c.match(e.pathname);if(i)return i}return await fetch(a.request)};a.respondWith(t())});
