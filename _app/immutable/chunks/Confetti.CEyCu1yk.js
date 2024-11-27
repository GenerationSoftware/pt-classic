import{s as M,n as m,c as k,g as v}from"./scheduler.0_Y8enYz.js";import{S as w,i as x,A as f,g as d,d as h,D as T,H as N,E as S}from"./index.BqTO8RJ5.js";import{k as _}from"./vectorMath.cE2fEfcG.js";import{w as C}from"./index.ZgqNSX5q.js";function q(a,o){const n={},t={},e={$$scope:1};let r=a.length;for(;r--;){const i=a[r],l=o[r];if(l){for(const s in i)s in l||(t[s]=1);for(const s in l)e[s]||(n[s]=l[s],e[s]=1);a[r]=l}else for(const s in i)e[s]=1}for(const i in t)i in n||(n[i]=void 0);return n}function z(a){return typeof a=="object"&&a!==null?a:{}}function g(a,o,n){const t=a.slice();return t[1]=o[n],t}function b(a){let o,n;return{c(){o=new N(!1),n=f(),this.h()},l(t){o=S(t,!1),n=f(),this.h()},h(){o.a=n},m(t,e){o.m(p,t,e),d(t,n,e)},p:m,d(t){t&&(h(n),o.d())}}}function y(a){let o=a[1],n,t=b();return{c(){t.c(),n=f()},l(e){t.l(e),n=f()},m(e,r){t.m(e,r),d(e,n,r)},p(e,r){r&1&&M(o,o=e[1])?(t.d(1),t=b(),t.c(),t.m(n.parentNode,n)):t.p(e,r)},d(e){e&&h(n),t.d(e)}}}function F(a){let o,n=_([...a[0]]),t=[];for(let e=0;e<n.length;e+=1)t[e]=y(g(a,n,e));return{c(){for(let e=0;e<t.length;e+=1)t[e].c();o=f()},l(e){for(let r=0;r<t.length;r+=1)t[r].l(e);o=f()},m(e,r){for(let i=0;i<t.length;i+=1)t[i]&&t[i].m(e,r);d(e,o,r)},p(e,[r]){if(r&1){n=_([...e[0]]);let i;for(i=0;i<n.length;i+=1){const l=g(e,n,i);t[i]?t[i].p(l,r):(t[i]=y(l),t[i].c(),t[i].m(o.parentNode,o))}for(;i<t.length;i+=1)t[i].d(1);t.length=n.length}},i:m,o:m,d(e){e&&h(o),T(t,e)}}}const c=800,$=[16758326,3535056,16402664,6109847];let p=`<svg
    class="confetti"
    viewBox="0 0 ${c} ${c}"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:svg="http://www.w3.org/2000/svg"
    version="1.1"
  >`;for(let a=0;a<200;a++){const o=$[Math.floor(Math.random()*$.length)],n="#"+(o|6710886).toString(16),t=(10+Math.random()*(c-20)).toFixed(4),e=(10+Math.random()*(c-20)).toFixed(4);p+=`
  <g>
    <rect x="0" y="0" width="20" height="10" fill="${n}" fill-opacity="1.0" visibility="visible">
      <animate
        attributeType="XML"
        attributeName="height"
        begin="-${Math.random().toFixed(4)}s"
        values="10;0;10"
        dur="0.3s"
        repeatCount="indefinite" />
      <animate
        attributeType="XML"
        attributeName="fill"
        values="${n};#${(Math.floor(o/4)|2236962).toString(16)};${n}"
        dur="0.3s"
        repeatCount="indefinite" />
      <animate
        attributeType="XML"
        attributeName="fill-opacity"
        begin="0s"
        values="1.0;0.0"
        dur="3s"
        fill="freeze" />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 10 0;${(10+Math.random()*60).toFixed(4)} 10 0;-${(10+Math.random()*60).toFixed(4)} 10 0;0 10 0"
        dur="${(.1+Math.random()*.5).toFixed(4)}s"
        repeatCount="indefinite" />
    </rect>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="translate"
      begin="0s"
      end="0.5s"
      dur="0.5s"
      values="${c/2} ${c/2};${t} ${e}"
      calcMode="spline"
      keySplines="0.1 0.8 0.2 1"/>
    <animateTransform
      attributeName="transform"
      attributeType="XML"
      type="translate"
      begin="0.5s"
      from="${t} ${e}"
      to="${t} ${c-10}"
      dur="${(3+Math.random()*3).toFixed(4)}s"/>
  </g>`}p+="</svg>";const u=C(new Set),B=()=>{for(const o of[...v(u)])clearTimeout(o),u.update(n=>(n.delete(o),n));const a=setTimeout(()=>{u.update(o=>(o.delete(a),o))},5e3);u.update(o=>o.add(a))};function L(a,o,n){let t;return k(a,u,e=>n(0,t=e)),[t]}class D extends w{constructor(o){super(),x(this,o,L,F,M,{})}}export{D as C,z as a,q as g,B as p};
