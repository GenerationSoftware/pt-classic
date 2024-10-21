import{s as ne,c as G,n as T,f as Ne,q as Ae}from"./scheduler.0_Y8enYz.js";import{S as se,i as oe,A as H,g as v,x as W,r as $,u as j,v as y,d as b,e as U,t as N,c as I,a as O,b as A,m as C,h as S,j as R,n as q,p as M,q as F,w as V,o as X,z as x,s as z,f as Z,F as Q,G as Te,k as ie,l as ue,B as ce,I as fe}from"./index.BqTO8RJ5.js";import{u as re,m as he,t as Be,G as ke,I as De,l as te,J as ge,b as D,K as le,L as Ue,w as ve,o as Ie,M as Oe,n as Pe,N as Ce,O as ye,P as qe,Q as Me,R as Fe,S as _e}from"./vectorMath.DpS7rrgq.js";import{h as de,u as Ve,C as ze,a as Ze}from"./ConfigModalBanner.KeZZTN-l.js";import{a as $e,d as Le,b as He}from"./txs.b3kgZWoh.js";import{W as we,M as Se}from"./WalletConnectionModal.B3N_n2FQ.js";import{L as K}from"./Loading.D8aoX_PU.js";import{S as We}from"./SuccessPooly.DB4TUsyT.js";import{B as je}from"./BackButton.UF6xSkkz.js";function Ge(s){const e=s.slice(),l=e[17].approval.spender;return e[18]=l,e}function Re(s){const e=s.slice(),l=e[9].dskit.zap.tx({tokenIn:{...e[1],amount:e[0]},swapTo:D.asset,action:{address:D.address,abi:Ie,functionName:"deposit",args:[e[0],Oe[Pe.id]],injectedAmountIndex:4},tokenOut:{address:D.address,minAmount:e[7]},userAddress:e[8]}).then(async t=>(t.approval&&await e[11](t.approval.spender),t));return e[16]=l,e}function Ye(s){let e,l,t,n={ctx:s,current:null,token:null,hasCatch:!0,pending:at,then:et,catch:xe,value:17,blocks:[,,,]};return de(l=s[16],n),{c(){e=H(),n.block.c()},l(o){e=H(),n.block.l(o)},m(o,a){v(o,e,a),n.block.m(o,n.anchor=a),n.mount=()=>e.parentNode,n.anchor=e,t=!0},p(o,a){s=o,n.ctx=s,a&899&&l!==(l=s[16])&&de(l,n)||Ve(n,s,a)},i(o){t||(y(n.block),t=!0)},o(o){for(let a=0;a<3;a+=1){const d=n.blocks[a];$(d)}t=!1},d(o){o&&b(e),n.block.d(o),n.token=null,n=null}}}function Je(s){let e,l,t=s[1].symbol+"",n;return{c(){e=U("button"),l=N("No price data found for "),n=N(t),this.h()},l(o){e=I(o,"BUTTON",{class:!0});var a=O(e);l=A(a,"No price data found for "),n=A(a,t),a.forEach(b),this.h()},h(){C(e,"class","teal-button"),e.disabled=!0},m(o,a){v(o,e,a),S(e,l),S(e,n)},p(o,a){a&2&&t!==(t=o[1].symbol+"")&&R(n,t)},i:T,o:T,d(o){o&&b(e)}}}function Ke(s){let e,l,t;return l=new K({props:{height:".75rem"}}),{c(){e=U("button"),q(l.$$.fragment),this.h()},l(n){e=I(n,"BUTTON",{class:!0});var o=O(e);M(l.$$.fragment,o),o.forEach(b),this.h()},h(){C(e,"class","teal-button"),e.disabled=!0},m(n,o){v(n,e,o),F(l,e,null),t=!0},p:T,i(n){t||(y(l.$$.fragment,n),t=!0)},o(n){$(l.$$.fragment,n),t=!1},d(n){n&&b(e),V(l)}}}function Qe(s){let e,l="Deposit";return{c(){e=U("button"),e.textContent=l,this.h()},l(t){e=I(t,"BUTTON",{class:!0,"data-svelte-h":!0}),X(e)!=="svelte-7w7817"&&(e.textContent=l),this.h()},h(){C(e,"class","teal-button"),e.disabled=!0},m(t,n){v(t,e,n)},p:T,i:T,o:T,d(t){t&&b(e)}}}function Xe(s){let e,l;return e=new we({props:{$$slots:{"button-content":[it]},$$scope:{ctx:s}}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},p(t,n){const o={};n&524288&&(o.$$scope={dirty:n,ctx:t}),e.$set(o)},i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function xe(s){let e,l,t=s[1].symbol+"",n,o,a=D.asset.symbol+"",d;return{c(){e=U("button"),l=N("No swap route found for "),n=N(t),o=N(" -> "),d=N(a),this.h()},l(i){e=I(i,"BUTTON",{class:!0});var r=O(e);l=A(r,"No swap route found for "),n=A(r,t),o=A(r," -> "),d=A(r,a),r.forEach(b),this.h()},h(){C(e,"class","teal-button"),e.disabled=!0},m(i,r){v(i,e,r),S(e,l),S(e,n),S(e,o),S(e,d)},p(i,r){r&2&&t!==(t=i[1].symbol+"")&&R(n,t)},i:T,o:T,d(i){i&&b(e)}}}function et(s){let e,l,t,n;const o=[lt,tt],a=[];function d(r,u){return r[17].approval&&(!r[4]||r[4]!==void 0&&r[4]<r[0])?0:1}function i(r,u){return u===0?Ge(r):r}return e=d(s),l=a[e]=o[e](i(s,e)),{c(){l.c(),t=H()},l(r){l.l(r),t=H()},m(r,u){a[e].m(r,u),v(r,t,u),n=!0},p(r,u){let c=e;e=d(r),e===c?a[e].p(i(r,e),u):(W(),$(a[c],1,1,()=>{a[c]=null}),j(),l=a[e],l?l.p(i(r,e),u):(l=a[e]=o[e](i(r,e)),l.c()),y(l,1),l.m(t.parentNode,t))},i(r){n||(y(l),n=!0)},o(r){$(l),n=!1},d(r){r&&b(t),a[e].d(r)}}}function tt(s){let e,l,t,n,o,a,d;const i=[st,nt],r=[];function u(f,m){return f[6]?0:1}l=u(s),t=r[l]=i[l](s);function c(){return s[15](s[17])}return{c(){e=U("button"),t.c(),this.h()},l(f){e=I(f,"BUTTON",{type:!0,class:!0});var m=O(e);t.l(m),m.forEach(b),this.h()},h(){C(e,"type","submit"),C(e,"class","teal-button"),e.disabled=n=s[6]||s[2]},m(f,m){v(f,e,m),r[l].m(e,null),o=!0,a||(d=x(e,"click",c),a=!0)},p(f,m){s=f;let p=l;l=u(s),l!==p&&(W(),$(r[p],1,1,()=>{r[p]=null}),j(),t=r[l],t||(t=r[l]=i[l](s),t.c()),y(t,1),t.m(e,null)),(!o||m&68&&n!==(n=s[6]||s[2]))&&(e.disabled=n)},i(f){o||(y(t),o=!0)},o(f){$(t),o=!1},d(f){f&&b(e),r[l].d(),a=!1,d()}}}function lt(s){let e,l,t,n,o,a,d;const i=[rt,ot],r=[];function u(f,m){return f[5]?0:1}l=u(s),t=r[l]=i[l](s);function c(){return s[14](s[18])}return{c(){e=U("button"),t.c(),this.h()},l(f){e=I(f,"BUTTON",{type:!0,class:!0});var m=O(e);t.l(m),m.forEach(b),this.h()},h(){C(e,"type","submit"),C(e,"class","teal-button"),e.disabled=n=s[5]||s[2]},m(f,m){v(f,e,m),r[l].m(e,null),o=!0,a||(d=x(e,"click",c),a=!0)},p(f,m){s=f;let p=l;l=u(s),l!==p&&(W(),$(r[p],1,1,()=>{r[p]=null}),j(),t=r[l],t||(t=r[l]=i[l](s),t.c()),y(t,1),t.m(e,null)),(!o||m&36&&n!==(n=s[5]||s[2]))&&(e.disabled=n)},i(f){o||(y(t),o=!0)},o(f){$(t),o=!1},d(f){f&&b(e),r[l].d(),a=!1,d()}}}function nt(s){let e;return{c(){e=N("Deposit")},l(l){e=A(l,"Deposit")},m(l,t){v(l,e,t)},i:T,o:T,d(l){l&&b(e)}}}function st(s){let e,l;return e=new K({props:{height:".75rem"}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function ot(s){let e;return{c(){e=N("Approve")},l(l){e=A(l,"Approve")},m(l,t){v(l,e,t)},i:T,o:T,d(l){l&&b(e)}}}function rt(s){let e,l;return e=new K({props:{height:".75rem"}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function at(s){let e,l,t;return l=new K({props:{height:".75rem"}}),{c(){e=U("button"),q(l.$$.fragment),this.h()},l(n){e=I(n,"BUTTON",{class:!0});var o=O(e);M(l.$$.fragment,o),o.forEach(b),this.h()},h(){C(e,"class","teal-button"),e.disabled=!0},m(n,o){v(n,e,o),F(l,e,null),t=!0},p:T,i(n){t||(y(l.$$.fragment,n),t=!0)},o(n){$(l.$$.fragment,n),t=!1},d(n){n&&b(e),V(l)}}}function it(s){let e,l="Connect Wallet";return{c(){e=U("div"),e.textContent=l,this.h()},l(t){e=I(t,"DIV",{slot:!0,class:!0,"data-svelte-h":!0}),X(e)!=="svelte-1lanmhs"&&(e.textContent=l),this.h()},h(){C(e,"slot","button-content"),C(e,"class","teal-button")},m(t,n){v(t,e,n)},p:T,d(t){t&&b(e)}}}function ut(s){let e,l,t,n;const o=[Xe,Qe,Ke,Je,Ye],a=[];function d(r,u){return!r[9].wallet||!r[8]?0:r[0]?r[7]===void 0?2:r[7]===0n?3:4:1}function i(r,u){return u===4?Re(r):r}return e=d(s),l=a[e]=o[e](i(s,e)),{c(){l.c(),t=H()},l(r){l.l(r),t=H()},m(r,u){a[e].m(r,u),v(r,t,u),n=!0},p(r,[u]){let c=e;e=d(r),e===c?a[e].p(i(r,e),u):(W(),$(a[c],1,1,()=>{a[c]=null}),j(),l=a[e],l?l.p(i(r,e),u):(l=a[e]=o[e](i(r,e)),l.c()),y(l,1),l.m(t.parentNode,t))},i(r){n||(y(l),n=!0)},o(r){$(l),n=!1},d(r){r&&b(t),a[e].d(r)}}}function ct(s,e,l){let t,n,o,a,d,i;G(s,re,h=>l(8,o=h)),G(s,he,h=>l(9,a=h)),G(s,Be,h=>l(13,d=h)),G(s,ke,h=>l(10,i=h));let{amount:r}=e,{token:u}=e,{disabled:c=!1}=e,{onSuccess:f=()=>{}}=e,m,p=!1,_=!1;const E=async h=>{o&&u.address!==Ue&&l(4,m=await a.public.readContract({address:u.address,abi:ve,functionName:"allowance",args:[o,h]}))},w=h=>$e(u.address,h,r,{onSend:()=>{l(5,p=!0)},onSettled:()=>{l(5,p=!1),E(h)}}),g=h=>Le(h.request,{onSend:()=>{l(6,_=!0)},onSuccess:(Y,L)=>{Ce(o,i??[]),f(L.args.assets)},onSettled:()=>{l(6,_=!1),h.approval&&E(h.approval.spender),ye(o)}});return s.$$set=h=>{"amount"in h&&l(0,r=h.amount),"token"in h&&l(1,u=h.token),"disabled"in h&&l(2,c=h.disabled),"onSuccess"in h&&l(3,f=h.onSuccess)},s.$$.update=()=>{s.$$.dirty&2&&De(u),s.$$.dirty&8194&&l(12,t=d[te(u.address)]),s.$$.dirty&4099&&l(7,n=t!==void 0?ge(`${t*parseFloat(le(r,u.decimals))*.95}`,D.decimals):void 0)},[r,u,c,f,m,p,_,n,o,a,i,E,t,d,w,g]}class ft extends se{constructor(e){super(),oe(this,e,ct,ut,ne,{amount:0,token:1,disabled:2,onSuccess:3})}}function _t(s){let e,l,t,n,o,a,d;const i=[ht,bt],r=[];function u(c,f){return c[6]?0:1}return l=u(s),t=r[l]=i[l](s),{c(){e=U("button"),t.c(),this.h()},l(c){e=I(c,"BUTTON",{type:!0,class:!0});var f=O(e);t.l(f),f.forEach(b),this.h()},h(){C(e,"type","submit"),C(e,"class","teal-button"),e.disabled=n=s[6]||s[1]},m(c,f){v(c,e,f),r[l].m(e,null),o=!0,a||(d=x(e,"click",s[11]),a=!0)},p(c,f){let m=l;l=u(c),l!==m&&(W(),$(r[m],1,1,()=>{r[m]=null}),j(),t=r[l],t||(t=r[l]=i[l](c),t.c()),y(t,1),t.m(e,null)),(!o||f&66&&n!==(n=c[6]||c[1]))&&(e.disabled=n)},i(c){o||(y(t),o=!0)},o(c){$(t),o=!1},d(c){c&&b(e),r[l].d(),a=!1,d()}}}function dt(s){let e,l,t,n,o,a,d;const i=[gt,kt],r=[];function u(c,f){return c[5]?0:1}return l=u(s),t=r[l]=i[l](s),{c(){e=U("button"),t.c(),this.h()},l(c){e=I(c,"BUTTON",{type:!0,class:!0});var f=O(e);t.l(f),f.forEach(b),this.h()},h(){C(e,"type","submit"),C(e,"class","teal-button"),e.disabled=n=s[5]||s[1]},m(c,f){v(c,e,f),r[l].m(e,null),o=!0,a||(d=x(e,"click",s[10]),a=!0)},p(c,f){let m=l;l=u(c),l!==m&&(W(),$(r[m],1,1,()=>{r[m]=null}),j(),t=r[l],t||(t=r[l]=i[l](c),t.c()),y(t,1),t.m(e,null)),(!o||f&34&&n!==(n=c[5]||c[1]))&&(e.disabled=n)},i(c){o||(y(t),o=!0)},o(c){$(t),o=!1},d(c){c&&b(e),r[l].d(),a=!1,d()}}}function mt(s){let e,l="Deposit";return{c(){e=U("button"),e.textContent=l,this.h()},l(t){e=I(t,"BUTTON",{class:!0,"data-svelte-h":!0}),X(e)!=="svelte-7w7817"&&(e.textContent=l),this.h()},h(){C(e,"class","teal-button"),e.disabled=!0},m(t,n){v(t,e,n)},p:T,i:T,o:T,d(t){t&&b(e)}}}function pt(s){let e,l;return e=new we({props:{$$slots:{"button-content":[vt]},$$scope:{ctx:s}}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},p(t,n){const o={};n&4096&&(o.$$scope={dirty:n,ctx:t}),e.$set(o)},i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function bt(s){let e;return{c(){e=N("Deposit")},l(l){e=A(l,"Deposit")},m(l,t){v(l,e,t)},i:T,o:T,d(l){l&&b(e)}}}function ht(s){let e,l;return e=new K({props:{height:".75rem"}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function kt(s){let e;return{c(){e=N("Approve")},l(l){e=A(l,"Approve")},m(l,t){v(l,e,t)},i:T,o:T,d(l){l&&b(e)}}}function gt(s){let e,l;return e=new K({props:{height:".75rem"}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function vt(s){let e,l="Connect Wallet";return{c(){e=U("div"),e.textContent=l,this.h()},l(t){e=I(t,"DIV",{slot:!0,class:!0,"data-svelte-h":!0}),X(e)!=="svelte-1lanmhs"&&(e.textContent=l),this.h()},h(){C(e,"slot","button-content"),C(e,"class","teal-button")},m(t,n){v(t,e,n)},p:T,d(t){t&&b(e)}}}function Ct(s){let e,l,t,n;const o=[pt,mt,dt,_t],a=[];function d(i,r){return!i[7].wallet||!i[3]?0:!i[0]||i[4]===void 0?1:i[4]<i[0]?2:3}return e=d(s),l=a[e]=o[e](s),{c(){l.c(),t=H()},l(i){l.l(i),t=H()},m(i,r){a[e].m(i,r),v(i,t,r),n=!0},p(i,[r]){let u=e;e=d(i),e===u?a[e].p(i,r):(W(),$(a[u],1,1,()=>{a[u]=null}),j(),l=a[e],l?l.p(i,r):(l=a[e]=o[e](i),l.c()),y(l,1),l.m(t.parentNode,t))},i(i){n||(y(l),n=!0)},o(i){$(l),n=!1},d(i){i&&b(t),a[e].d(i)}}}function yt(s,e,l){let t,n,o;G(s,re,_=>l(3,t=_)),G(s,he,_=>l(7,n=_)),G(s,ke,_=>l(8,o=_));let{amount:a}=e,{disabled:d=!1}=e,{onSuccess:i=()=>{}}=e,r,u=!1,c=!1;const f=async()=>{t&&l(4,r=await n.public.readContract({address:D.asset.address,abi:ve,functionName:"allowance",args:[t,D.address]}))},m=()=>$e(D.asset.address,D.address,a,{onSend:()=>{l(5,u=!0)},onSettled:()=>{l(5,u=!1),f()}}),p=()=>He(a,{onSend:()=>{l(6,c=!0)},onSuccess:(_,E)=>{Ce(t,o??[]),i(E.args.assets)},onSettled:()=>{l(6,c=!1),f(),ye(t)}});return s.$$set=_=>{"amount"in _&&l(0,a=_.amount),"disabled"in _&&l(1,d=_.disabled),"onSuccess"in _&&l(2,i=_.onSuccess)},s.$$.update=()=>{s.$$.dirty&8&&f()},[a,d,i,t,r,u,c,n,o,f,m,p]}class $t extends se{constructor(e){super(),oe(this,e,yt,Ct,ne,{amount:0,disabled:1,onSuccess:2})}}function me(s){const e=s.slice(),l=e[0]===e[12].length-1?0:e[0]+1;return e[23]=l,e}function wt(s){let e,l="Success!",t,n,o,a=_e(s[7])+"",d,i,r=D.asset.symbol+"",u,c,f,m,p,_,E;f=new We({props:{style:"max-height: 7.5rem; margin: 2rem 0;"}});let w=s[9]&&pe(s);return _=new je({props:{onClick:s[21]}}),{c(){e=U("h3"),e.textContent=l,t=z(),n=U("span"),o=N("You deposited "),d=N(a),i=z(),u=N(r),c=z(),q(f.$$.fragment),m=z(),w&&w.c(),p=z(),q(_.$$.fragment),this.h()},l(g){e=I(g,"H3",{class:!0,"data-svelte-h":!0}),X(e)!=="svelte-1o74v5t"&&(e.textContent=l),t=Z(g),n=I(g,"SPAN",{class:!0});var h=O(n);o=A(h,"You deposited "),d=A(h,a),i=Z(h),u=A(h,r),h.forEach(b),c=Z(g),M(f.$$.fragment,g),m=Z(g),w&&w.l(g),p=Z(g),M(_.$$.fragment,g),this.h()},h(){C(e,"class","success-title svelte-y8hc2o"),C(n,"class","success-info svelte-y8hc2o")},m(g,h){v(g,e,h),v(g,t,h),v(g,n,h),S(n,o),S(n,d),S(n,i),S(n,u),v(g,c,h),F(f,g,h),v(g,m,h),w&&w.m(g,h),v(g,p,h),F(_,g,h),E=!0},p(g,h){(!E||h&128)&&a!==(a=_e(g[7])+"")&&R(d,a),g[9]?w?(w.p(g,h),h&512&&y(w,1)):(w=pe(g),w.c(),y(w,1),w.m(p.parentNode,p)):w&&(W(),$(w,1,1,()=>{w=null}),j());const Y={};h&128&&(Y.onClick=g[21]),_.$set(Y)},i(g){E||(y(f.$$.fragment,g),y(w),y(_.$$.fragment,g),E=!0)},o(g){$(f.$$.fragment,g),$(w),$(_.$$.fragment,g),E=!1},d(g){g&&(b(e),b(t),b(n),b(c),b(m),b(p)),V(f,g),w&&w.d(g),V(_,g)}}}function St(s){let e,l="How much do you want to deposit?",t,n,o,a,d,i,r,u,c,f,m,p,_;const E=[Tt,At],w=[];function g(k,B){return!k[6]||k[4]!==void 0?0:1}o=g(s),a=w[o]=E[o](s);let h=s[12].length>1&&Bt(me(s));const Y=[Ot,It],L=[];function ee(k,B){return k[5]?0:1}return f=ee(s),m=L[f]=Y[f](s),{c(){e=U("span"),e.textContent=l,t=z(),n=U("div"),a.c(),d=z(),h&&h.c(),i=z(),r=U("span"),u=N(s[2]),c=z(),m.c(),p=H(),this.h()},l(k){e=I(k,"SPAN",{"data-svelte-h":!0}),X(e)!=="svelte-128qdzt"&&(e.textContent=l),t=Z(k),n=I(k,"DIV",{class:!0});var B=O(n);a.l(B),B.forEach(b),d=Z(k),h&&h.l(k),i=Z(k),r=I(k,"SPAN",{class:!0});var J=O(r);u=A(J,s[2]),J.forEach(b),c=Z(k),m.l(k),p=H(),this.h()},h(){C(n,"class","input svelte-y8hc2o"),Q(n,"wallet-connected",!!s[6]),C(r,"class","error svelte-y8hc2o"),Q(r,"wallet-connected",!!s[6])},m(k,B){v(k,e,B),v(k,t,B),v(k,n,B),w[o].m(n,null),v(k,d,B),h&&h.m(k,B),v(k,i,B),v(k,r,B),S(r,u),v(k,c,B),L[f].m(k,B),v(k,p,B),_=!0},p(k,B){let J=o;o=g(k),o===J?w[o].p(k,B):(W(),$(w[J],1,1,()=>{w[J]=null}),j(),a=w[o],a?a.p(k,B):(a=w[o]=E[o](k),a.c()),y(a,1),a.m(n,null)),(!_||B&64)&&Q(n,"wallet-connected",!!k[6]),k[12].length>1&&h.p(me(k),B),(!_||B&4)&&R(u,k[2]),(!_||B&64)&&Q(r,"wallet-connected",!!k[6]);let P=f;f=ee(k),f===P?L[f].p(k,B):(W(),$(L[P],1,1,()=>{L[P]=null}),j(),m=L[f],m?m.p(k,B):(m=L[f]=Y[f](k),m.c()),y(m,1),m.m(p.parentNode,p))},i(k){_||(y(a),y(h),y(m),_=!0)},o(k){$(a),$(h),$(m),_=!1},d(k){k&&(b(e),b(t),b(n),b(d),b(i),b(r),b(c),b(p)),w[o].d(),h&&h.d(k),L[f].d(k)}}}function pe(s){let e,l,t;function n(a){s[20](a)}let o={title:"Account Setup",$$slots:{"modal-content":[Nt],"button-content":[Et]},$$scope:{ctx:s}};return s[8]!==void 0&&(o.close=s[8]),e=new Se({props:o}),Ne.push(()=>Te(e,"close",n)),{c(){q(e.$$.fragment)},l(a){M(e.$$.fragment,a)},m(a,d){F(e,a,d),t=!0},p(a,d){const i={};d&16777472&&(i.$$scope={dirty:d,ctx:a}),!l&&d&256&&(l=!0,i.close=a[8],Ae(()=>l=!1)),e.$set(i)},i(a){t||(y(e.$$.fragment,a),t=!0)},o(a){$(e.$$.fragment,a),t=!1},d(a){V(e,a)}}}function Et(s){let e,l,t;return l=new ze({}),{c(){e=U("div"),q(l.$$.fragment),this.h()},l(n){e=I(n,"DIV",{slot:!0,class:!0});var o=O(e);M(l.$$.fragment,o),o.forEach(b),this.h()},h(){C(e,"slot","button-content"),C(e,"class","account-setup-prompt svelte-y8hc2o")},m(n,o){v(n,e,o),F(l,e,null),t=!0},p:T,i(n){t||(y(l.$$.fragment,n),t=!0)},o(n){$(l.$$.fragment,n),t=!1},d(n){n&&b(e),V(l)}}}function Nt(s){let e,l;return e=new Ze({props:{slot:"modal-content",onSuccess:s[8]}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},p(t,n){const o={};n&256&&(o.onSuccess=t[8]),e.$set(o)},i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function At(s){let e,l;return e=new K({props:{height:"1rem"}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},p:T,i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function Tt(s){let e,l=!s[5]&&D.asset.isUsdEquivalent?"$":"",t,n,o,a,d=(s[5]||!D.asset.isUsdEquivalent?s[3].symbol:"")+"",i,r,u,c,f,m=s[6]&&be(s);return{c(){e=U("label"),t=N(l),n=z(),o=U("input"),a=z(),i=N(d),r=z(),m&&m.c(),u=H(),this.h()},l(p){e=I(p,"LABEL",{class:!0});var _=O(e);t=A(_,l),n=Z(_),o=I(_,"INPUT",{placeholder:!0,class:!0}),a=Z(_),i=A(_,d),_.forEach(b),r=Z(p),m&&m.l(p),u=H(),this.h()},h(){C(o,"placeholder","0.00"),C(o,"class","svelte-y8hc2o"),ce(o,"width",`${s[13](s[1]||"0.00")}ch`),C(e,"class","svelte-y8hc2o"),Q(e,"placeholder-color",!s[1])},m(p,_){v(p,e,_),S(e,t),S(e,n),S(e,o),fe(o,s[1]),S(e,a),S(e,i),v(p,r,_),m&&m.m(p,_),v(p,u,_),c||(f=x(o,"input",s[18]),c=!0)},p(p,_){_&32&&l!==(l=!p[5]&&D.asset.isUsdEquivalent?"$":"")&&R(t,l),_&2&&o.value!==p[1]&&fe(o,p[1]),_&2&&ce(o,"width",`${p[13](p[1]||"0.00")}ch`),_&40&&d!==(d=(p[5]||!D.asset.isUsdEquivalent?p[3].symbol:"")+"")&&R(i,d),_&2&&Q(e,"placeholder-color",!p[1]),p[6]?m?m.p(p,_):(m=be(p),m.c(),m.m(u.parentNode,u)):m&&(m.d(1),m=null)},i:T,o:T,d(p){p&&(b(e),b(r),b(u)),m&&m.d(p),c=!1,f()}}}function be(s){let e,l,t=!s[5]&&D.asset.isUsdEquivalent?"$":"",n,o,a,d=(s[5]||!D.asset.isUsdEquivalent?s[3].symbol:"")+"",i,r;return{c(){e=U("span"),l=N("of "),n=N(t),o=N(s[11]),a=z(),i=N(d),r=N(" available"),this.h()},l(u){e=I(u,"SPAN",{class:!0});var c=O(e);l=A(c,"of "),n=A(c,t),o=A(c,s[11]),a=Z(c),i=A(c,d),r=A(c," available"),c.forEach(b),this.h()},h(){C(e,"class","svelte-y8hc2o")},m(u,c){v(u,e,c),S(e,l),S(e,n),S(e,o),S(e,a),S(e,i),S(e,r)},p(u,c){c&32&&t!==(t=!u[5]&&D.asset.isUsdEquivalent?"$":"")&&R(n,t),c&2048&&R(o,u[11]),c&40&&d!==(d=(u[5]||!D.asset.isUsdEquivalent?u[3].symbol:"")+"")&&R(i,d)},d(u){u&&b(e)}}}function Bt(s){let e,l,t,n,o=s[12][s[23]].symbol+"",a,d,i,r,u,c,f;function m(){return s[19](s[23])}return r=new Se({props:{title:"Zapping",buttonStyle:"height: .9rem;",$$slots:{"modal-content":[Ut],"button-content":[Dt]},$$scope:{ctx:s}}}),{c(){e=U("div"),l=U("button"),t=U("em"),n=N("Deposit "),a=N(o),d=N(" instead"),i=z(),q(r.$$.fragment),this.h()},l(p){e=I(p,"DIV",{class:!0});var _=O(e);l=I(_,"BUTTON",{type:!0,class:!0});var E=O(l);t=I(E,"EM",{class:!0});var w=O(t);n=A(w,"Deposit "),a=A(w,o),d=A(w," instead"),w.forEach(b),E.forEach(b),i=Z(_),M(r.$$.fragment,_),_.forEach(b),this.h()},h(){C(t,"class","svelte-y8hc2o"),C(l,"type","button"),C(l,"class","svelte-y8hc2o"),C(e,"class","switch-token svelte-y8hc2o")},m(p,_){v(p,e,_),S(e,l),S(l,t),S(t,n),S(t,a),S(t,d),S(e,i),F(r,e,null),u=!0,c||(f=x(l,"click",m),c=!0)},p(p,_){s=p,(!u||_&1)&&o!==(o=s[12][s[23]].symbol+"")&&R(a,o);const E={};_&16777216&&(E.$$scope={dirty:_,ctx:s}),r.$set(E)},i(p){u||(y(r.$$.fragment,p),u=!0)},o(p){$(r.$$.fragment,p),u=!1},d(p){p&&b(e),V(r),c=!1,f()}}}function Dt(s){let e,l;return{c(){e=ie("svg"),l=ie("path"),this.h()},l(t){e=ue(t,"svg",{slot:!0,height:!0,viewBox:!0,fill:!0,xmlns:!0});var n=O(e);l=ue(n,"path",{"fill-rule":!0,d:!0,fill:!0}),O(l).forEach(b),n.forEach(b),this.h()},h(){C(l,"fill-rule","evenodd"),C(l,"d","M24 12.5C24 15.6826 22.7357 18.7348 20.4853 20.9853C18.2348 23.2357 15.1826 24.5 12 24.5C8.8174 24.5 5.76516 23.2357 3.51472 20.9853C1.26428 18.7348 0 15.6826 0 12.5C0 9.3174 1.26428 6.26516 3.51472 4.01472C5.76516 1.76428 8.8174 0.5 12 0.5C15.1826 0.5 18.2348 1.76428 20.4853 4.01472C22.7357 6.26516 24 9.3174 24 12.5ZM12 8C11.7364 7.99974 11.4775 8.06893 11.2492 8.2006C11.0209 8.33226 10.8313 8.52176 10.6995 8.75C10.6043 8.92681 10.4747 9.08273 10.3181 9.20849C10.1616 9.33426 9.98143 9.42731 9.78828 9.48215C9.59512 9.53699 9.39292 9.55249 9.19366 9.52773C8.9944 9.50297 8.80214 9.43846 8.62828 9.33802C8.45441 9.23758 8.30248 9.10325 8.1815 8.943C8.06051 8.78275 7.97293 8.59985 7.92394 8.40512C7.87496 8.2104 7.86556 8.00782 7.89632 7.8094C7.92708 7.61098 7.99736 7.42075 8.103 7.25C8.59833 6.39217 9.36286 5.72174 10.278 5.34269C11.1932 4.96364 12.2079 4.89716 13.1647 5.15354C14.1215 5.40992 14.967 5.97484 15.57 6.7607C16.1731 7.54656 16.5 8.50943 16.5 9.5C16.5003 10.4309 16.2119 11.339 15.6746 12.0993C15.1374 12.8595 14.3776 13.4345 13.5 13.745V14C13.5 14.3978 13.342 14.7794 13.0607 15.0607C12.7794 15.342 12.3978 15.5 12 15.5C11.6022 15.5 11.2206 15.342 10.9393 15.0607C10.658 14.7794 10.5 14.3978 10.5 14V12.5C10.5 12.1022 10.658 11.7206 10.9393 11.4393C11.2206 11.158 11.6022 11 12 11C12.3978 11 12.7794 10.842 13.0607 10.5607C13.342 10.2794 13.5 9.89782 13.5 9.5C13.5 9.10218 13.342 8.72064 13.0607 8.43934C12.7794 8.15804 12.3978 8 12 8ZM12 20C12.3978 20 12.7794 19.842 13.0607 19.5607C13.342 19.2794 13.5 18.8978 13.5 18.5C13.5 18.1022 13.342 17.7206 13.0607 17.4393C12.7794 17.158 12.3978 17 12 17C11.6022 17 11.2206 17.158 10.9393 17.4393C10.658 17.7206 10.5 18.1022 10.5 18.5C10.5 18.8978 10.658 19.2794 10.9393 19.5607C11.2206 19.842 11.6022 20 12 20Z"),C(l,"fill","#C8ADFF"),C(e,"slot","button-content"),C(e,"height",".875rem"),C(e,"viewBox","0 0 24 25"),C(e,"fill","none"),C(e,"xmlns","http://www.w3.org/2000/svg")},m(t,n){v(t,e,n),S(e,l)},p:T,d(t){t&&b(e)}}}function Ut(s){let e,l,t=D.asset.symbol+"",n,o,a=D.asset.symbol+"",d,i;return{c(){e=U("span"),l=N("If you choose to deposit any asset other than "),n=N(t),o=N(", your deposit will be automatically swapped to "),d=N(a),i=N(" at the best rates we can find, and then deposited into PoolTogether in the same transaction."),this.h()},l(r){e=I(r,"SPAN",{slot:!0,class:!0});var u=O(e);l=A(u,"If you choose to deposit any asset other than "),n=A(u,t),o=A(u,", your deposit will be automatically swapped to "),d=A(u,a),i=A(u," at the best rates we can find, and then deposited into PoolTogether in the same transaction."),u.forEach(b),this.h()},h(){C(e,"slot","modal-content"),C(e,"class","svelte-y8hc2o")},m(r,u){v(r,e,u),S(e,l),S(e,n),S(e,o),S(e,d),S(e,i)},p:T,d(r){r&&b(e)}}}function It(s){let e,l;return e=new $t({props:{amount:s[10],onSuccess:s[14],disabled:!!s[2]}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},p(t,n){const o={};n&1024&&(o.amount=t[10]),n&4&&(o.disabled=!!t[2]),e.$set(o)},i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function Ot(s){let e,l;return e=new ft({props:{amount:s[10],token:s[3],onSuccess:s[14],disabled:!!s[2]}}),{c(){q(e.$$.fragment)},l(t){M(e.$$.fragment,t)},m(t,n){F(e,t,n),l=!0},p(t,n){const o={};n&1024&&(o.amount=t[10]),n&8&&(o.token=t[3]),n&4&&(o.disabled=!!t[2]),e.$set(o)},i(t){l||(y(e.$$.fragment,t),l=!0)},o(t){$(e.$$.fragment,t),l=!1},d(t){V(e,t)}}}function Pt(s){let e,l,t,n;const o=[St,wt],a=[];function d(i,r){return i[7]?1:0}return l=d(s),t=a[l]=o[l](s),{c(){e=U("div"),t.c(),this.h()},l(i){e=I(i,"DIV",{class:!0});var r=O(e);t.l(r),r.forEach(b),this.h()},h(){C(e,"class","card svelte-y8hc2o")},m(i,r){v(i,e,r),a[l].m(e,null),n=!0},p(i,[r]){let u=l;l=d(i),l===u?a[l].p(i,r):(W(),$(a[u],1,1,()=>{a[u]=null}),j(),t=a[l],t?t.p(i,r):(t=a[l]=o[l](i),t.c()),y(t,1),t.m(e,null))},i(i){n||(y(t),n=!0)},o(i){$(t),n=!1},d(i){i&&b(e),a[l].d()}}}function qt(s,e,l){let t,n,o,a,d,i,r,u,c,f;G(s,qe,P=>l(16,u=P)),G(s,re,P=>l(6,c=P)),G(s,Me,P=>l(17,f=P));const m=[D.asset,...Fe.tokenOptions];let p=0,_,E="",w=0n,g;const h=()=>{var P;_&&o!==void 0?Number.isNaN(Number(_))?l(2,E="Enter a valid number"):parseFloat(_)<0?l(2,E="Enter a valid positive number"):((P=_.split(".")[1])==null?void 0:P.length)>t.decimals?l(2,E="Too many decimals"):parseFloat(le(o,t.decimals))<parseFloat(_)?l(2,E=`Not enough ${t.symbol} in wallet`):l(2,E=""):l(2,E="")},Y=P=>P.split("").reduce((Ee,ae)=>Ee+(ae==="."||ae===","?.5:1),0),L=P=>{l(7,w=P),l(1,_="")};function ee(){_=this.value,l(1,_)}const k=P=>l(0,p=P);function B(P){g=P,l(8,g)}const J=()=>l(7,w=0n);return s.$$.update=()=>{s.$$.dirty&1&&l(3,t=m[p]),s.$$.dirty&8&&l(5,n=te(t.address)!==te(D.asset.address)),s.$$.dirty&131080&&l(4,o=f[te(t.address)]),s.$$.dirty&24&&l(15,a=Math.floor(parseFloat(le(o??0n,t.decimals))*10**t.decimals)/10**t.decimals),s.$$.dirty&32808&&l(11,d=a.toLocaleString("en",{minimumFractionDigits:n?0:D.asset.isUsdEquivalent?2:D.asset.displayDecimals,maximumFractionDigits:n?t.decimals<=6?2:4:D.asset.isUsdEquivalent?2:D.asset.displayDecimals??4})),s.$$.dirty&82&&h(),s.$$.dirty&30&&l(10,i=_&&o!==void 0&&!E?ge(_,t.decimals):0n),s.$$.dirty&65536&&l(9,r=!!u&&(!u.isPrizeHookSet||!u.isSwapperSet))},[p,_,E,t,o,n,c,w,g,r,i,d,m,Y,L,a,u,f,ee,k,B,J]}class Gt extends se{constructor(e){super(),oe(this,e,qt,Pt,ne,{})}}export{Gt as D};