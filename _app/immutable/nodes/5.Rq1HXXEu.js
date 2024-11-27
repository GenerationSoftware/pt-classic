import{s as L,c as N,n as S}from"../chunks/scheduler.0_Y8enYz.js";import{S as V,i as z,A as E,g as p,x as q,r as k,u as O,v,d,e as g,c as w,a as R,m as y,z as M,o as A,t as C,b as $,n as U,p as D,q as T,w as Y,s as B,f as x,D as Q,h as b,j as F}from"../chunks/index.BqTO8RJ5.js";import{g as W}from"../chunks/entry.DV2MeoWe.js";import{u as X,Y as ee,m as te,Z as I,_ as se,$ as le,a0 as ne,O as re,t as oe,l as G,b as P,K as ae,k as H}from"../chunks/vectorMath.cE2fEfcG.js";import{c as ce}from"../chunks/txs.Bi_Dz7d8.js";import{L as J}from"../chunks/Loading.D8aoX_PU.js";import{S as ie}from"../chunks/SuccessPooly.DB4TUsyT.js";import{B as ue}from"../chunks/BackButton.UF6xSkkz.js";function fe(i){let e,t,s,r,f,o,u;const l=[de,me],n=[];function c(a,_){return a[2]?0:1}return t=c(i),s=n[t]=l[t](i),{c(){e=g("button"),s.c(),this.h()},l(a){e=w(a,"BUTTON",{type:!0,class:!0});var _=R(e);s.l(_),_.forEach(d),this.h()},h(){y(e,"type","submit"),y(e,"class","teal-button"),e.disabled=r=i[2]||i[0]},m(a,_){p(a,e,_),n[t].m(e,null),f=!0,o||(u=M(e,"click",i[7]),o=!0)},p(a,_){let m=t;t=c(a),t!==m&&(q(),k(n[m],1,1,()=>{n[m]=null}),O(),s=n[t],s||(s=n[t]=l[t](a),s.c()),v(s,1),s.m(e,null)),(!f||_&5&&r!==(r=a[2]||a[0]))&&(e.disabled=r)},i(a){f||(v(s),f=!0)},o(a){k(s),f=!1},d(a){a&&d(e),n[t].d(),o=!1,u()}}}function _e(i){let e,t="Claim Bonuses";return{c(){e=g("button"),e.textContent=t,this.h()},l(s){e=w(s,"BUTTON",{"data-svelte-h":!0}),A(e)!=="svelte-5mc5b6"&&(e.textContent=t),this.h()},h(){e.disabled=!0},m(s,r){p(s,e,r)},p:S,i:S,o:S,d(s){s&&d(e)}}}function me(i){let e;return{c(){e=C("Claim Bonuses")},l(t){e=$(t,"Claim Bonuses")},m(t,s){p(t,e,s)},i:S,o:S,d(t){t&&d(e)}}}function de(i){let e,t;return e=new J({props:{height:".75rem"}}),{c(){U(e.$$.fragment)},l(s){D(e.$$.fragment,s)},m(s,r){T(e,s,r),t=!0},i(s){t||(v(e.$$.fragment,s),t=!0)},o(s){k(e.$$.fragment,s),t=!1},d(s){Y(e,s)}}}function pe(i){let e,t,s,r;const f=[_e,fe],o=[];function u(l,n){var c;return!l[4].wallet||!l[3]||!((c=l[5])!=null&&c.length)?0:1}return e=u(i),t=o[e]=f[e](i),{c(){t.c(),s=E()},l(l){t.l(l),s=E()},m(l,n){o[e].m(l,n),p(l,s,n),r=!0},p(l,[n]){let c=e;e=u(l),e===c?o[e].p(l,n):(q(),k(o[c],1,1,()=>{o[c]=null}),O(),t=o[e],t?t.p(l,n):(t=o[e]=f[e](l),t.c()),v(t,1),t.m(s.parentNode,s))},i(l){r||(v(t),r=!0)},o(l){k(t),r=!1},d(l){l&&d(s),o[e].d(l)}}}function he(i,e,t){let s,r,f,o;N(i,X,_=>t(3,s=_)),N(i,ee,_=>t(8,r=_)),N(i,te,_=>t(4,f=_)),N(i,I,_=>t(5,o=_));let{disabled:u=!1}=e,{onSuccess:l=()=>{}}=e,n=!1;const c=async()=>{r&&s&&(I.set(await se(r,s)),le.set(await ne(r,s)))},a=()=>ce(o,{onSend:()=>{t(2,n=!0)},onSuccess:()=>{c(),l()},onSettled:()=>{t(2,n=!1),re(s)}});return i.$$set=_=>{"disabled"in _&&t(0,u=_.disabled),"onSuccess"in _&&t(1,l=_.onSuccess)},[u,l,n,s,f,o,c,a]}class be extends V{constructor(e){super(),z(this,e,he,pe,L,{disabled:0,onSuccess:1})}}function K(i,e,t){const s=i.slice();s[8]=e[t];const r=s[4](s[8]);s[9]=r;const f=s[9].toLocaleString("en",{maximumFractionDigits:4});return s[10]=f,s}function ke(i){let e,t="Success!",s,r,f="You claimed your available bonus rewards",o,u,l;return u=new ie({props:{style:"max-height: 7.5rem; margin: 2rem 0 1rem;"}}),{c(){e=g("h3"),e.textContent=t,s=B(),r=g("span"),r.textContent=f,o=B(),U(u.$$.fragment),this.h()},l(n){e=w(n,"H3",{class:!0,"data-svelte-h":!0}),A(e)!=="svelte-1o74v5t"&&(e.textContent=t),s=x(n),r=w(n,"SPAN",{class:!0,"data-svelte-h":!0}),A(r)!=="svelte-127eczs"&&(r.textContent=f),o=x(n),D(u.$$.fragment,n),this.h()},h(){y(e,"class","success-title svelte-9sh31a"),y(r,"class","success-info svelte-9sh31a")},m(n,c){p(n,e,c),p(n,s,c),p(n,r,c),p(n,o,c),T(u,n,c),l=!0},p:S,i(n){l||(v(u.$$.fragment,n),l=!0)},o(n){k(u.$$.fragment,n),l=!1},d(n){n&&(d(e),d(s),d(r),d(o)),Y(u,n)}}}function ve(i){let e,t,s,r;const f=[we,ge],o=[];function u(l,n){return l[0]&&l[2]?0:1}return e=u(i),t=o[e]=f[e](i),{c(){t.c(),s=E()},l(l){t.l(l),s=E()},m(l,n){o[e].m(l,n),p(l,s,n),r=!0},p(l,n){let c=e;e=u(l),e===c?o[e].p(l,n):(q(),k(o[c],1,1,()=>{o[c]=null}),O(),t=o[e],t?t.p(l,n):(t=o[e]=f[e](l),t.c()),v(t,1),t.m(s.parentNode,s))},i(l){r||(v(t),r=!0)},o(l){k(t),r=!1},d(l){l&&d(s),o[e].d(l)}}}function ge(i){let e,t;return e=new J({props:{height:"1rem"}}),{c(){U(e.$$.fragment)},l(s){D(e.$$.fragment,s)},m(s,r){T(e,s,r),t=!0},p:S,i(s){t||(v(e.$$.fragment,s),t=!0)},o(s){k(e.$$.fragment,s),t=!1},d(s){Y(e,s)}}}function we(i){let e,t,s,r;const f=[Ce,ye],o=[];function u(l,n){return l[0].length>0?0:1}return e=u(i),t=o[e]=f[e](i),{c(){t.c(),s=E()},l(l){t.l(l),s=E()},m(l,n){o[e].m(l,n),p(l,s,n),r=!0},p(l,n){let c=e;e=u(l),e===c?o[e].p(l,n):(q(),k(o[c],1,1,()=>{o[c]=null}),O(),t=o[e],t?t.p(l,n):(t=o[e]=f[e](l),t.c()),v(t,1),t.m(s.parentNode,s))},i(l){r||(v(t),r=!0)},o(l){k(t),r=!1},d(l){l&&d(s),o[e].d(l)}}}function ye(i){let e,t="You don't have any bonus rewards to claim";return{c(){e=g("span"),e.textContent=t,this.h()},l(s){e=w(s,"SPAN",{class:!0,"data-svelte-h":!0}),A(e)!=="svelte-tcl0lh"&&(e.textContent=t),this.h()},h(){y(e,"class","rewards-title svelte-9sh31a")},m(s,r){p(s,e,r)},p:S,i:S,o:S,d(s){s&&d(e)}}}function Ce(i){let e,t,s,r,f;function o(a,_){return P.asset.isUsdEquivalent?Se:$e}let l=o()(i),n=H(i[0]),c=[];for(let a=0;a<n.length;a+=1)c[a]=Z(K(i,n,a));return r=new be({props:{onSuccess:i[7]}}),{c(){l.c(),e=B(),t=g("div");for(let a=0;a<c.length;a+=1)c[a].c();s=B(),U(r.$$.fragment),this.h()},l(a){l.l(a),e=x(a),t=w(a,"DIV",{class:!0});var _=R(t);for(let m=0;m<c.length;m+=1)c[m].l(_);_.forEach(d),s=x(a),D(r.$$.fragment,a),this.h()},h(){y(t,"class","rewards-list svelte-9sh31a")},m(a,_){l.m(a,_),p(a,e,_),p(a,t,_);for(let m=0;m<c.length;m+=1)c[m]&&c[m].m(t,null);p(a,s,_),T(r,a,_),f=!0},p(a,_){if(l.p(a,_),_&17){n=H(a[0]);let h;for(h=0;h<n.length;h+=1){const j=K(a,n,h);c[h]?c[h].p(j,_):(c[h]=Z(j),c[h].c(),c[h].m(t,null))}for(;h<c.length;h+=1)c[h].d(1);c.length=n.length}const m={};_&2&&(m.onSuccess=a[7]),r.$set(m)},i(a){f||(v(r.$$.fragment,a),f=!0)},o(a){k(r.$$.fragment,a),f=!1},d(a){a&&(d(e),d(t),d(s)),l.d(a),Q(c,a),Y(r,a)}}}function $e(i){let e,t,s,r,f,o=P.asset.symbol+"",u,l;return{c(){e=g("span"),t=C("You have "),s=g("strong"),r=C(i[3]),f=B(),u=C(o),l=C(" in bonus rewards to claim"),this.h()},l(n){e=w(n,"SPAN",{class:!0});var c=R(e);t=$(c,"You have "),s=w(c,"STRONG",{class:!0});var a=R(s);r=$(a,i[3]),f=x(a),u=$(a,o),a.forEach(d),l=$(c," in bonus rewards to claim"),c.forEach(d),this.h()},h(){y(s,"class","svelte-9sh31a"),y(e,"class","rewards-title svelte-9sh31a")},m(n,c){p(n,e,c),b(e,t),b(e,s),b(s,r),b(s,f),b(s,u),b(e,l)},p(n,c){c&8&&F(r,n[3])},d(n){n&&d(e)}}}function Se(i){let e,t,s,r,f,o;return{c(){e=g("span"),t=C("You have "),s=g("strong"),r=C("$"),f=C(i[3]),o=C(" in bonus rewards to claim"),this.h()},l(u){e=w(u,"SPAN",{class:!0});var l=R(e);t=$(l,"You have "),s=w(l,"STRONG",{class:!0});var n=R(s);r=$(n,"$"),f=$(n,i[3]),n.forEach(d),o=$(l," in bonus rewards to claim"),l.forEach(d),this.h()},h(){y(s,"class","svelte-9sh31a"),y(e,"class","rewards-title svelte-9sh31a")},m(u,l){p(u,e,l),b(e,t),b(e,s),b(s,r),b(s,f),b(e,o)},p(u,l){l&8&&F(f,u[3])},d(u){u&&d(e)}}}function Z(i){let e,t,s="Unclaimed Reward",r,f,o=i[10]+"",u,l,n=i[8].token.symbol+"",c,a;return{c(){e=g("div"),t=g("span"),t.textContent=s,r=B(),f=g("span"),u=C(o),l=B(),c=C(n),a=B(),this.h()},l(_){e=w(_,"DIV",{class:!0});var m=R(e);t=w(m,"SPAN",{class:!0,"data-svelte-h":!0}),A(t)!=="svelte-6bi1xx"&&(t.textContent=s),r=x(m),f=w(m,"SPAN",{class:!0});var h=R(f);u=$(h,o),l=x(h),c=$(h,n),h.forEach(d),a=x(m),m.forEach(d),this.h()},h(){y(t,"class","svelte-9sh31a"),y(f,"class","svelte-9sh31a"),y(e,"class","reward-item svelte-9sh31a")},m(_,m){p(_,e,m),b(e,t),b(e,r),b(e,f),b(f,u),b(f,l),b(f,c),b(e,a)},p(_,m){m&1&&o!==(o=_[10]+"")&&F(u,o),m&1&&n!==(n=_[8].token.symbol+"")&&F(c,n)},d(_){_&&d(e)}}}function Be(i){let e,t,s,r;const f=[ve,ke],o=[];function u(l,n){return l[1]?1:0}return t=u(i),s=o[t]=f[t](i),{c(){e=g("div"),s.c(),this.h()},l(l){e=w(l,"DIV",{class:!0});var n=R(e);s.l(n),n.forEach(d),this.h()},h(){y(e,"class","card svelte-9sh31a")},m(l,n){p(l,e,n),o[t].m(e,null),r=!0},p(l,[n]){let c=t;t=u(l),t===c?o[t].p(l,n):(q(),k(o[c],1,1,()=>{o[c]=null}),O(),s=o[t],s?s.p(l,n):(s=o[t]=f[t](l),s.c()),v(s,1),s.m(e,null))},i(l){r||(v(s),r=!0)},o(l){k(s),r=!1},d(l){l&&d(e),o[t].d()}}}function xe(i,e,t){let s,r,f,o,u;N(i,oe,a=>t(6,o=a)),N(i,I,a=>t(0,u=a));let l=!1;const n=a=>parseFloat(ae(Object.values(a.epochs).reduce((_,m)=>_+m,0n),a.token.decimals)),c=()=>t(1,l=!0);return i.$$.update=()=>{i.$$.dirty&65&&t(5,s=(u==null?void 0:u.reduce((a,_)=>{const m=n(_),h=o[G(_.token.address)]??0;return a+m*h},0))??0),i.$$.dirty&32&&t(3,r=s.toLocaleString("en",{minimumFractionDigits:P.asset.isUsdEquivalent?2:P.asset.displayDecimals??4,maximumFractionDigits:P.asset.isUsdEquivalent?2:P.asset.displayDecimals??4})),i.$$.dirty&65&&t(2,f=u==null?void 0:u.every(a=>o[G(a.token.address)]!==void 0))},[u,l,f,r,n,s,o,c]}class Re extends V{constructor(e){super(),z(this,e,xe,Be,L,{})}}function Ne(i){let e,t="Claim Bonus Rewards",s,r,f,o,u;return r=new Re({}),o=new ue({props:{onClick:i[0]}}),{c(){e=g("h2"),e.textContent=t,s=B(),U(r.$$.fragment),f=B(),U(o.$$.fragment),this.h()},l(l){e=w(l,"H2",{class:!0,"data-svelte-h":!0}),A(e)!=="svelte-78ytfr"&&(e.textContent=t),s=x(l),D(r.$$.fragment,l),f=x(l),D(o.$$.fragment,l),this.h()},h(){y(e,"class","svelte-u2ggcq")},m(l,n){p(l,e,n),p(l,s,n),T(r,l,n),p(l,f,n),T(o,l,n),u=!0},p:S,i(l){u||(v(r.$$.fragment,l),v(o.$$.fragment,l),u=!0)},o(l){k(r.$$.fragment,l),k(o.$$.fragment,l),u=!1},d(l){l&&(d(e),d(s),d(f)),Y(r,l),Y(o,l)}}}function Pe(i){return[()=>W("/account")]}class Fe extends V{constructor(e){super(),z(this,e,Pe,Ne,L,{})}}export{Fe as component};