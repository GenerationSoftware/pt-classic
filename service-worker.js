const s=location.pathname.split("/").slice(0,-1).join("/"),p=[s+"/_app/immutable/entry/app.B7fw3ImZ.js",s+"/_app/immutable/nodes/0.CMrE47bK.js",s+"/_app/immutable/assets/0.BqLpGGQJ.css",s+"/_app/immutable/nodes/1.D7QxxT6M.js",s+"/_app/immutable/nodes/2.BPm_r-yM.js",s+"/_app/immutable/assets/2.DKV3EJdh.css",s+"/_app/immutable/nodes/3.DnvGzecb.js",s+"/_app/immutable/assets/3.xdVXrGnb.css",s+"/_app/immutable/nodes/4.Drg1zVMl.js",s+"/_app/immutable/assets/4.DhFmVoJX.css",s+"/_app/immutable/nodes/5.BDVz7TGO.js",s+"/_app/immutable/assets/5.C2SEPwkZ.css",s+"/_app/immutable/nodes/6.2yVXv1UI.js",s+"/_app/immutable/assets/6.DWcjGI53.css",s+"/_app/immutable/assets/BackButton.UmthfXVw.css",s+"/_app/immutable/chunks/BackButton.DnufDsem.js",s+"/_app/immutable/assets/Confetti.CMdB0EhX.css",s+"/_app/immutable/chunks/Confetti.5_7GVyPY.js",s+"/_app/immutable/assets/ConfigModalBanner.HG6IbBJI.css",s+"/_app/immutable/chunks/ConfigModalBanner.Bu0G18h0.js",s+"/_app/immutable/assets/DepositCard.gVd0X8ta.css",s+"/_app/immutable/chunks/DepositCard.CWIqqoP3.js",s+"/_app/immutable/assets/Loading.Jj6PGg9g.css",s+"/_app/immutable/chunks/Loading.BgkMO5iK.js",s+"/_app/immutable/assets/WalletConnectionModal.qw-cFW7b.css",s+"/_app/immutable/chunks/WalletConnectionModal.Ba90tibY.js",s+"/_app/immutable/chunks/entry.BMq6tPz7.js",s+"/_app/immutable/chunks/index.-yqi0WvP.js",s+"/_app/immutable/chunks/index.BX6i05FA.js",s+"/_app/immutable/chunks/index.C0C0tZ2p.js",s+"/_app/immutable/chunks/preload-helper.C1FmrZbK.js",s+"/_app/immutable/chunks/scheduler.BtZbm0j3.js",s+"/_app/immutable/chunks/stores.CwqamzrY.js",s+"/_app/immutable/chunks/vectorMath.BWa9UD17.js",s+"/_app/immutable/entry/start.Bi_eXdr-.js",s+"/_app/immutable/chunks/ccip.bgCGRDP6.js"],m=[s+"/.nojekyll",s+"/abstract-pooly.jpg",s+"/background.svg",s+"/favicon.ico",s+"/fonts/inter/inter-bold.woff",s+"/fonts/inter/inter-medium.woff",s+"/fonts/inter/inter-regular.woff",s+"/fonts/inter/inter-semibold.woff",s+"/icons/account.svg",s+"/icons/check.svg",s+"/icons/double-right.svg",s+"/icons/down.svg",s+"/icons/hamburger.svg",s+"/icons/help.svg",s+"/icons/left.svg",s+"/icons/sparkle.svg",s+"/icons/trophy.svg",s+"/icons/up.svg",s+"/icons/user.svg",s+"/icons/wallet.svg",s+"/manifest.json",s+"/pooltogether-small.svg",s+"/pooltogether-square.svg",s+"/pooltogether.svg",s+"/pooly.svg",s+"/success-pooly.svg"],l="0.2.1",n=`ptc-cache-${l}`,c=[...p,...m];self.addEventListener("install",a=>{async function t(){await(await caches.open(n)).addAll(c)}a.waitUntil(t())});self.addEventListener("activate",a=>{const t=async()=>{for(const e of await caches.keys())e!==n&&await caches.delete(e)};a.waitUntil(t())});self.addEventListener("fetch",a=>{if(a.request.method!=="GET")return;const t=async()=>{const e=new URL(a.request.url),o=await caches.open(n);if(c.includes(e.pathname)){const i=await o.match(e.pathname);if(i)return i}return await fetch(a.request)};a.respondWith(t())});