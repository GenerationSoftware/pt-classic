import{s as $e,h as et,o as bt,j as Mt,f as Te,n as Pe,k as vt,u as yt,l as zt,m as wt,a as Pt,c as Be,p as kt}from"../chunks/scheduler.0_Y8enYz.js";import{S as tt,i as lt,e as Y,s as ae,c as j,a as $,d as k,f as ie,o as Ce,m as q,B as ne,g as K,h as C,x as st,r as Me,u as ot,v as ge,D as Fe,t as re,b as ce,j as Ve,z as nt,n as at,p as it,q as rt,w as ct}from"../chunks/index.BqTO8RJ5.js";import{p as St,g as It,a as xt}from"../chunks/Confetti.Dg4VIbdJ.js";import{k as Se,b as Z,V as y,D as He,u as Dt,E as Tt,F as Rt}from"../chunks/vectorMath.DpS7rrgq.js";import{g as Vt}from"../chunks/entry.DV2MeoWe.js";import{B as Ct}from"../chunks/BackButton.UF6xSkkz.js";const Et=a=>({}),Ue=a=>({});function Ge(a,e,o){const l=a.slice();return l[51]=e[o],l[53]=o,l}function Ye(a,e,o){const l=a.slice();return l[54]=e[o],l}function je(a){let e,o=a[54].content+"",l,r;return{c(){e=Y("div"),l=re(o),r=ae(),this.h()},l(c){e=j(c,"DIV",{class:!0});var s=$(e);l=ce(s,o),r=ie(s),s.forEach(k),this.h()},h(){q(e,"class","prize-bubble svelte-w6b0lt"),ne(e,"top",a[54].top),ne(e,"left",a[54].left),ne(e,"background-color",a[54].backgroundColor)},m(c,s){K(c,e,s),C(e,l),C(e,r)},p(c,s){s[0]&512&&o!==(o=c[54].content+"")&&Ve(l,o),s[0]&512&&ne(e,"top",c[54].top),s[0]&512&&ne(e,"left",c[54].left),s[0]&512&&ne(e,"background-color",c[54].backgroundColor)},d(c){c&&k(e)}}}function Xe(a){let e,o='<img src="/icons/down.svg" alt="" class="svelte-w6b0lt"/> ',l,r;function c(){return a[18](a[53])}return{c(){e=Y("button"),e.innerHTML=o,this.h()},l(s){e=j(s,"BUTTON",{class:!0,"data-svelte-h":!0}),Ce(e)!=="svelte-1tp1mk5"&&(e.innerHTML=o),this.h()},h(){q(e,"class","start-btn svelte-w6b0lt")},m(s,i){K(s,e,i),l||(r=nt(e,"click",c),l=!0)},p(s,i){a=s},d(s){s&&k(e),l=!1,r()}}}function qt(a){let e,o,l,r,c,s,i,m,p;return{c(){e=Y("div"),o=re("Prizes "),l=Y("span"),r=re(a[7]),c=ae(),s=Y("div"),i=re("Total "),m=Y("span"),p=re(a[8]),this.h()},l(h){e=j(h,"DIV",{class:!0});var g=$(e);o=ce(g,"Prizes "),l=j(g,"SPAN",{class:!0});var W=$(l);r=ce(W,a[7]),W.forEach(k),g.forEach(k),c=ie(h),s=j(h,"DIV",{class:!0});var B=$(s);i=ce(B,"Total "),m=j(B,"SPAN",{class:!0});var F=$(m);p=ce(F,a[8]),F.forEach(k),B.forEach(k),this.h()},h(){q(l,"class","prizes-won svelte-w6b0lt"),q(e,"class","prize-counter svelte-w6b0lt"),q(m,"class","prizes-total svelte-w6b0lt"),q(s,"class","prize-counter svelte-w6b0lt")},m(h,g){K(h,e,g),C(e,o),C(e,l),C(l,r),K(h,c,g),K(h,s,g),C(s,i),C(s,m),C(m,p)},p(h,g){g[0]&128&&Ve(r,h[7]),g[0]&256&&Ve(p,h[8])},i:Pe,o:Pe,d(h){h&&(k(e),k(c),k(s))}}}function Lt(a){let e;const o=a[16]["end-card"],l=vt(o,a,a[15],Ue);return{c(){l&&l.c()},l(r){l&&l.l(r)},m(r,c){l&&l.m(r,c),e=!0},p(r,c){l&&l.p&&(!e||c[0]&32768)&&yt(l,o,r,r[15],e?wt(o,r[15],c,Et):zt(r[15]),Ue)},i(r){e||(ge(l,r),e=!0)},o(r){Me(l,r),e=!1},d(r){l&&l.d(r)}}}function Nt(a){let e,o,l,r,c,s,i,m,p,h='<h3 class="svelte-w6b0lt">Drop a ball to reveal your prizes!</h3>',g,W,B,F,D,H,L,S=`${a[0]}px`,ve=`${a[1]}px`,ue,se=Se(a[9]),U=[];for(let u=0;u<se.length;u+=1)U[u]=je(Ye(a,se,u));let ee=Se(new Array(a[2]).fill(0)),d=[];for(let u=0;u<ee.length;u+=1)d[u]=Xe(Ge(a,ee,u));const te=[Lt,qt],le=[];function ze(u,N){return u[6].state==="done"?0:1}return B=ze(a),F=le[B]=te[B](a),{c(){e=Y("div"),o=Y("canvas"),l=ae(),r=Y("div");for(let u=0;u<U.length;u+=1)U[u].c();c=ae(),s=Y("div"),i=Y("div");for(let u=0;u<d.length;u+=1)d[u].c();m=ae(),p=Y("div"),p.innerHTML=h,g=ae(),W=Y("div"),F.c(),D=ae(),H=Y("img"),this.h()},l(u){e=j(u,"DIV",{id:!0,class:!0});var N=$(e);o=j(N,"CANVAS",{class:!0}),$(o).forEach(k),l=ie(N),r=j(N,"DIV",{class:!0});var I=$(r);for(let T=0;T<U.length;T+=1)U[T].l(I);I.forEach(k),c=ie(N),s=j(N,"DIV",{class:!0});var _=$(s);i=j(_,"DIV",{class:!0});var fe=$(i);for(let T=0;T<d.length;T+=1)d[T].l(fe);fe.forEach(k),m=ie(_),p=j(_,"DIV",{class:!0,"data-svelte-h":!0}),Ce(p)!=="svelte-16dnb9p"&&(p.innerHTML=h),g=ie(_),W=j(_,"DIV",{class:!0});var de=$(W);F.l(de),de.forEach(k),_.forEach(k),D=ie(N),H=j(N,"IMG",{src:!0,alt:!0,class:!0}),N.forEach(k),this.h()},h(){q(o,"class","svelte-w6b0lt"),q(r,"class","prize-bubble-container svelte-w6b0lt"),q(i,"class","start-btn-container svelte-w6b0lt"),q(p,"class","prize-info-container svelte-w6b0lt"),q(W,"class","prize-results-container svelte-w6b0lt"),q(s,"class","ui svelte-w6b0lt"),et(H.src,L="/pooltogether-square.svg")||q(H,"src",L),q(H,"alt",""),q(H,"class","svelte-w6b0lt"),ne(H,"display","none"),q(e,"id","plinko"),q(e,"class","ready svelte-w6b0lt"),ne(e,"width",S),ne(e,"height",ve)},m(u,N){K(u,e,N),C(e,o),a[17](o),C(e,l),C(e,r);for(let I=0;I<U.length;I+=1)U[I]&&U[I].m(r,null);C(e,c),C(e,s),C(s,i);for(let I=0;I<d.length;I+=1)d[I]&&d[I].m(i,null);C(s,m),C(s,p),C(s,g),C(s,W),le[B].m(W,null),C(e,D),C(e,H),a[19](H),a[20](e),ue=!0},p(u,N){if(N[0]&512){se=Se(u[9]);let _;for(_=0;_<se.length;_+=1){const fe=Ye(u,se,_);U[_]?U[_].p(fe,N):(U[_]=je(fe),U[_].c(),U[_].m(r,null))}for(;_<U.length;_+=1)U[_].d(1);U.length=se.length}if(N[0]&1028){ee=Se(new Array(u[2]).fill(0));let _;for(_=0;_<ee.length;_+=1){const fe=Ge(u,ee,_);d[_]?d[_].p(fe,N):(d[_]=Xe(fe),d[_].c(),d[_].m(i,null))}for(;_<d.length;_+=1)d[_].d(1);d.length=ee.length}let I=B;B=ze(u),B===I?le[B].p(u,N):(st(),Me(le[I],1,1,()=>{le[I]=null}),ot(),F=le[B],F?F.p(u,N):(F=le[B]=te[B](u),F.c()),ge(F,1),F.m(W,null)),N[0]&1&&S!==(S=`${u[0]}px`)&&ne(e,"width",S),N[0]&2&&ve!==(ve=`${u[1]}px`)&&ne(e,"height",ve)},i(u){ue||(ge(F),ue=!0)},o(u){Me(F),ue=!1},d(u){u&&k(e),a[17](null),Fe(U,u),Fe(d,u),le[B].d(),a[19](null),a[20](null)}}}const X=100,be=90,Ie=10,me=25,Re=.3,ye=6,xe=1.5,Je=7,At=100;function Ot(a,e,o){let{$$slots:l={},$$scope:r}=e,{width:c}=e,{height:s}=e,{columns:i=4}=e,{prizes:m=[]}=e,{onStart:p=()=>{}}=e,{onDone:h=()=>{}}=e,g,W,B,F=!1;bt(()=>{o(14,F=!0)}),Mt(()=>{o(14,F=!1)});const D=X/i,H=D*.75,L=D/5,S=D*.1,ve=L;let ue=100,se=1,U=0,ee=0,d={state:"ready",frame:0,ms:0,ball:{pos:{x:-2*L,y:-H},rot:0,rotVel:0,vel:{x:0,y:0},acc:{x:0,y:100}},nextPrizeRow:0,prizesWon:0,prizesTotal:0,animationTriggers:[]},te=d,le=null,ze="0",u=Z.asset.isUsdEquivalent?"$0":`0 ${Z.asset.symbol}`,N=[],I=[],_=0;const fe=Math.max(...m.map(n=>n.size));let de=0,T=[],_e=[];const ke=Array(i).fill("^");ke[0]=" ",ke[Math.floor(i/2)]=" ";let we=1,Ee=0;if(m.forEach((n,z)=>{for(let w=0;w<n.userWon;w++){const f=Array(i).fill("^");f[0]=z,f[Math.floor(i/2)]=" ",T.push(f)}const t=n.count-n.userWon;if(t>0){for(let w=0;w<t;w++)if(Math.random()<=n.userOdds){const f=Array(i).fill("^");f[0]=" ",f[Math.floor(i/2)]=z,T.push(f),Ee++}}n.userWon>0&&n.userOdds<we&&(we=n.userOdds)}),we>1&&(we=1),Ee==0){const n=Array(i).fill("^");n[0]=" ",n[Math.floor(i/2)]=Math.floor(Math.random()*m.length),T.push(n)}const ft=1+Math.log(1/we)/Math.log(i/2);for(;T.length<ft;)T.push(ke);for(let n=0;n<T.length;n++){const z=Math.floor(Math.random()*T.length),t=T[z];T[z]=T[n],T[n]=t}T.forEach((n,z)=>{Number.isInteger(n[0])&&z>=de&&(de=z+1)});const ht=n=>{let z=Math.floor(Math.random()*n.length);for(;n[z]!=="^";)z++;return[...n.slice(z%n.length,n.length),...n.slice(0,z%n.length)]};for(;de>T.length-3;)T.push(ke);T[de]=ht(T[de]);const qe=n=>{let z=-H-ve-L;return n.y>=H*2&&(z+=n.y-H*2),z},Le=n=>Math.log(n+1)/Math.log(fe+1),oe=n=>{var z;return((z=W.computedStyleMap().get(n))==null?void 0:z.toString())??""},De=(n,z,t)=>{const w=qe(n),f=g.getContext("2d");if(!f)throw new Error("Missing 2D context...");f.clearRect(0,0,g.width,g.height),f.scale(1/se,1/se);const G=Math.max(0,Math.floor(w/H));for(let M=G;M<=G+Math.ceil(ue/H);M++){const x=M*H-w;if(M>0&&M%ye==0){const A=M/ye-1,v=T[A];if(v){const E=A%2==0?-1:1,R=E*D*(xe*t)/1e3%X;for(let b=0;b<i*2;b++){const V=(b+_e[A])%i,O=b*D+R-(E>0?X:0);if(O+D>0&&O-D<X){if(v[V]==="^"){f.fillStyle=oe("--spike-color"),f.beginPath(),f.moveTo(O,x+S),f.lineTo(O+S,x);for(let J=1;J<=Je*2;J++)f.lineTo(O+S+J*(D-S*2)/(Je*2),J%2==0?x:x-S);f.lineTo(O+D,x+S),f.fill()}else if(Number.isInteger(v[V])){const J=m[v[V]],pe=Le(J.size),he=S+(L-S)*pe,We=!(n.y-w<x||V>0);f.fillStyle=oe(`--prize-${Math.floor((1-pe)*8)}-color`),We?f.strokeStyle=oe("--peg-color"):f.strokeStyle=`hsla(${Math.floor(360*t/1e3)%360}, 100%, 50%, 0.6)`,f.lineWidth=1,f.setLineDash([1,1]),f.lineDashOffset=t/500,f.beginPath(),f.ellipse(O+D/2,x,(D-S*3)/2,S/2,0,Math.PI,Math.PI*2),f.stroke(),We||(f.beginPath(),f.ellipse(O+D/2,x+he/2,he,he,0,0,Math.PI*2),f.fill()),f.beginPath(),f.ellipse(O+D/2,x,(D-S*3)/2,S/2,0,0,Math.PI),f.stroke()}f.fillStyle=oe("--peg-color"),f.beginPath(),f.ellipse(O,x,S,S,0,0,Math.PI*2),f.fill()}}}}else for(let A=0;A<=i;A++){f.fillStyle=oe("--peg-color");const v=M%2==0;f.beginPath(),f.ellipse((v?A:A+.5)*D,x,S,S,0,0,Math.PI*2),f.fill()}}f.fillStyle=oe("--ball-color"),f.beginPath(),f.ellipse(n.x,n.y-w,L,L,0,0,Math.PI*2),f.fill(),f.save(),f.translate(n.x,n.y-w),f.rotate(z),f.translate(-n.x,w-n.y),f.drawImage(B,n.x-L*.66,n.y-w-L*.66,L*1.32,L*1.32),f.restore();const P=new WeakSet;for(let M=0;M<I.length;M++)t>=I[M].startMs&&(t<I[M].startMs+I[M].durationMs?(f.save(),f.translate(0,-w),I[M].draw(f,(t-I[M].startMs)/I[M].durationMs),f.restore()):P.add(I[M]));I=I.filter(M=>!P.has(M)),f.setTransform(1,0,0,1,0,0)},ut=(n,z,t)=>{const w=T[n];if(w){const f=n%2==0?-1:1;for(let G=0;G<w.length;G++){const P=w[G];if(Number.isInteger(P)){const M=m[P];let x=(G+.5-_e[n]+f*xe*t/1e3)*D;x=(x%X+X)%X;const Q=Le(M.size),A=(n+1)*ye*H-qe(z),v=E=>{const R={top:`${Math.min(100,100*A/ue)}%`,left:`${100*x/X+E}%`,content:Z.asset.isUsdEquivalent?`$${M.size.toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}`:`${M.size.toLocaleString("en",{minimumFractionDigits:Z.asset.displayDecimals??4,maximumFractionDigits:Z.asset.displayDecimals??4})} ${Z.asset.symbol}`,backgroundColor:oe(`--prize-${Math.floor((1-Q)*8)}-color`)};N.push(R)};v(0),v(-100),v(100)}}}},Ne=(n,z)=>{const t=JSON.parse(JSON.stringify(n));t.frame++,t.ms=n.ms+me,t.animationTriggers=[],t.ball.vel.x+=t.ball.acc.x*me/1e3,t.ball.vel.y+=t.ball.acc.y*me/1e3;const w=Math.sqrt(t.ball.vel.x*t.ball.vel.x+t.ball.vel.y*t.ball.vel.y);w>be&&(t.ball.vel.x=be*t.ball.vel.x/w,t.ball.vel.y=be*t.ball.vel.y/w),t.ball.pos.x+=t.ball.vel.x*me/1e3,t.ball.pos.y+=t.ball.vel.y*me/1e3,t.ball.rot+=t.ball.rotVel*me/1e3,t.ball.pos.x<L&&(t.ball.pos.x=L,t.ball.vel.x<0&&(t.ball.vel.x*=-1),t.ball.vel.x*=Re,t.ball.rotVel+=2),t.ball.pos.x>X-L&&(t.ball.pos.x=X-L,t.ball.vel.x>0&&(t.ball.vel.x*=-1),t.ball.vel.x*=Re,t.ball.rotVel-=2);const f=Math.round(t.ball.pos.y/H);if(f>0){let G,P={x:0,y:0};if(f>0&&f%ye==0){const Q=f/ye-1;P={x:xe*D*(Q%2==0?-1:1),y:0},G=P.x*t.ms/1e3%D}else G=f%2==0?0:D/2;const x={x:Math.round((t.ball.pos.x-G)/D)*D+G,y:f*H};if(y.dist(t.ball.pos,x)<L+S){const Q={x:x.x-t.ball.pos.x,y:x.y-t.ball.pos.y};if(y.angleBetween(Q,t.ball.vel)<Math.PI/2){const E=y.project(t.ball.vel,Q),R=y.sub(t.ball.vel,E);if(t.ball.vel=y.add(R,y.smul(E,-Re)),P.x!=0){const b=y.neg(Q),V=y.angleBetween(P,b);V<Math.PI/4&&(t.ball.vel=y.add(t.ball.vel,y.smul(P,Math.cos(V))))}t.ball.rotVel*=.5,t.ball.rotVel+=.25*y.mag(R)*(R.y>0?-1:1)*(t.ball.vel.x>0?-1:1)}const v=y.norm(Q);if(t.ball.pos=y.add(x,y.smul(v,-1*(L+S))),z&&w>be*.2&&t.ms-_>=At){_=t.ms;const E=y.add(x,y.smul(v,-1*S)),R=[];for(let b=0;b<5;b++){const V=Math.random()*Math.PI*2,O=w/be*(S/2+S*2*Math.random()),J=w/be*S*.3+S*.3*Math.random();R.push({endPos:{x:Math.cos(V)*O,y:Math.sin(V)*O},size:J,color:Math.random()>.5?oe("--peg-color"):oe("--spike-color")})}t.animationTriggers.push({startMs:t.ms,durationMs:250,draw:(b,V)=>{for(const O of R){const J=(1-V)*O.size,pe=y.add(E,y.smul(O.endPos,V)),he=Math.random();b.fillStyle=O.color,b.beginPath(),b.moveTo(pe.x+J*Math.cos(he),pe.y+J*Math.sin(he)),b.lineTo(pe.x+J*Math.cos(he+Math.PI*2/3),pe.y+J*Math.sin(he+Math.PI*2/3)),b.lineTo(pe.x+J*Math.cos(he+Math.PI*4/3),pe.y+J*Math.sin(he+Math.PI*4/3)),b.fill()}}})}}}if(t.ball.rotVel>Ie&&(t.ball.rotVel=Ie),t.ball.rotVel<-Ie&&(t.ball.rotVel=-Ie),t.ball.pos.y>=(t.nextPrizeRow+1)*H*ye){if(t.nextPrizeRow==de){if(t.state="done",z){const P={x:t.ball.pos.x,y:t.ball.pos.y},M=[],x=1e3,Q=10;for(let A=0;A<Q;A++){const v=Math.random()*Math.PI*2,E=.25+Math.random()*.75,R=L/Math.log(Q+1),b={x:Math.cos(v)*E*L,y:Math.sin(v)*E*L};M.push({offsetPos:b,size:R,color:Math.random()>.66?"#ffffff":oe("--ball-color")})}t.animationTriggers.push({startMs:t.ms,durationMs:x,draw:(A,v)=>{for(const E of M){const R=E.size*(1-v),b=y.add(P,y.add(y.smul(y.smul(y.add(t.ball.vel,y.smul(t.ball.acc,v*x/1e3)),x/1e3),v),y.smul(E.offsetPos,1+v*3))),V=E.offsetPos.x*v;A.fillStyle=E.color,A.beginPath(),A.moveTo(b.x+R*Math.cos(V),b.y+R*Math.sin(V)),A.lineTo(b.x+R*Math.cos(V+Math.PI*2/3),b.y+R*Math.sin(V+Math.PI*2/3)),A.lineTo(b.x+R*Math.cos(V+Math.PI*4/3),b.y+R*Math.sin(V+Math.PI*4/3)),A.fill()}}})}h()}const G=T[t.nextPrizeRow];if(G&&Number.isInteger(G[0])){const P=m[G[0]];if(t.prizesWon++,t.prizesTotal+=P.size,z){const M=t.ball.pos,x=[],Q=5+Math.log(1+P.size)*2,A=3e3;for(let v=0;v<Q;v++){const E=Math.random()*Math.PI*2,R=X/2+X*Math.random(),b=w/be*L*.4+L*.4*Math.random();x.push({endPos:{x:Math.cos(E)*R,y:Math.sin(E)*R},size:b,color:oe(`--prize-${Math.floor(Math.random()*9)}-color`)})}t.animationTriggers.push({startMs:t.ms,durationMs:A,draw:(v,E)=>{for(const R of x){const b=(1-E)*R.size,V=y.add(M,y.add(y.smul(R.endPos,Math.sqrt(E)),y.smul(t.ball.acc,Math.pow(E*A/2e3,2)))),O=R.endPos.x*E;v.fillStyle=R.color,v.beginPath(),v.moveTo(V.x+b*Math.cos(O),V.y+b*Math.sin(O)),v.lineTo(V.x+b*Math.cos(O+Math.PI*2/3),V.y+b*Math.sin(O+Math.PI*2/3)),v.lineTo(V.x+b*Math.cos(O+Math.PI*4/3),V.y+b*Math.sin(O+Math.PI*4/3)),v.fill()}}})}}t.nextPrizeRow++}return t},Ae=()=>{if((d.state==="playing"||d.state==="done")&&F){requestAnimationFrame(Ae);const n=performance.now(),z=Math.min(me,n-U);if(ee+=z,U=n,d.state==="playing"){te==d&&(te=Ne(d,!0)),ee>=te.ms&&(o(6,d=te),I.push(...te.animationTriggers)),o(7,ze=`${d.prizesWon}`),o(8,u=Z.asset.isUsdEquivalent?`$${d.prizesTotal.toLocaleString("en",{minimumFractionDigits:2,maximumFractionDigits:2})}`:`${d.prizesTotal.toLocaleString("en",{minimumFractionDigits:Z.asset.displayDecimals??4,maximumFractionDigits:Z.asset.displayDecimals??4})} ${Z.asset.symbol}`);let t=le??te;for(le=t;t.ball.pos.y<te.ball.pos.y+ue*1.5;){const P=t.nextPrizeRow;if(t=Ne(t,!1),le=t,t.nextPrizeRow>P){let M=xe*D*(P%2==0?-1:1)*t.ms/1e3%X;M<0&&(M+=X),_e[P]=Math.floor((t.ball.pos.x-M)/D)%i,_e[P]<0&&(_e[P]+=i),_e[P]=(i-_e[P])%i}}const w=Math.min(ee,te.ms),f=(w-d.ms)/me,G=y.add(y.smul(d.ball.pos,1-f),y.smul(te.ball.pos,f));De(G,d.ball.rot,w),o(9,N=[]);for(let P=d.nextPrizeRow;P<d.nextPrizeRow+2;P++)P>=0&&ut(P,G,w)}else De({x:-X,y:d.ball.pos.y},0,ee),W.classList.contains("done")||(W.classList.remove("playing"),W.classList.add("done"),d.prizesWon>0&&setTimeout(St,200))}},dt=(n,z)=>{o(3,g.width=n,g),o(3,g.height=z,g),se=X/g.width,ue=se*g.height,W.style.setProperty("--start-btn-size",`${.6*n/i}px`),De(d.ball.pos,d.ball.rot,ee)},Oe=n=>{o(6,d.state="playing",d),U=performance.now(),W.classList.remove("ready"),W.classList.add("playing"),o(6,d.ball.pos.x=X*(n+.4+.2*Math.random())/i,d),Ae(),p()};function pt(n){Te[n?"unshift":"push"](()=>{g=n,o(3,g)})}const mt=n=>Oe(n);function gt(n){Te[n?"unshift":"push"](()=>{B=n,o(5,B)})}function _t(n){Te[n?"unshift":"push"](()=>{W=n,o(4,W)})}return a.$$set=n=>{"width"in n&&o(0,c=n.width),"height"in n&&o(1,s=n.height),"columns"in n&&o(2,i=n.columns),"prizes"in n&&o(11,m=n.prizes),"onStart"in n&&o(12,p=n.onStart),"onDone"in n&&o(13,h=n.onDone),"$$scope"in n&&o(15,r=n.$$scope)},a.$$.update=()=>{a.$$.dirty[0]&16387&&F&&dt(c,s)},[c,s,i,g,W,B,d,ze,u,N,Oe,m,p,h,F,r,l,pt,mt,gt,_t]}class Wt extends tt{constructor(e){super(),lt(this,e,Ot,Nt,$e,{width:0,height:1,columns:2,prizes:11,onStart:12,onDone:13},null,[-1,-1])}}function Ke(a){const e=a[2].filter(o=>o.userWon>0);a[8]=e}function Bt(a){const e=a.slice(),o=e[2].reduce((r,c)=>r+c.size*c.userWon,0);e[9]=o;const l=e[9].toLocaleString("en",{maximumFractionDigits:Z.asset.isUsdEquivalent?2:Z.asset.displayDecimals??4});return e[10]=l,e}function Qe(a){let e,o;const l=[a[1],{prizes:a[2]},{onStart:a[3]}];let r={$$slots:{"end-card":[Gt]},$$scope:{ctx:a}};for(let c=0;c<l.length;c+=1)r=kt(r,l[c]);return e=new Wt({props:r}),{c(){at(e.$$.fragment)},l(c){it(e.$$.fragment,c)},m(c,s){rt(e,c,s),o=!0},p(c,s){const i=s&14?It(l,[s&2&&xt(c[1]),s&4&&{prizes:c[2]},s&8&&{onStart:c[3]}]):{};s&2048&&(i.$$scope={dirty:s,ctx:c}),e.$set(i)},i(c){o||(ge(e.$$.fragment,c),o=!0)},o(c){Me(e.$$.fragment,c),o=!1},d(c){ct(e,c)}}}function Ft(a){let e,o="Sorry, no prizes this time.";return{c(){e=Y("span"),e.textContent=o,this.h()},l(l){e=j(l,"SPAN",{class:!0,"data-svelte-h":!0}),Ce(e)!=="svelte-hk7ixu"&&(e.textContent=o),this.h()},h(){q(e,"class","svelte-12sp8qd")},m(l,r){K(l,e,r)},p:Pe,d(l){l&&k(e)}}}function Ze(a){let e,o,l,r,c;function s(p,h){return Z.asset.isUsdEquivalent?Ut:Ht}let m=s()(a);return{c(){e=Y("span"),o=re("You won "),l=Y("strong"),m.c(),r=ae(),c=re("!"),this.h()},l(p){e=j(p,"SPAN",{class:!0});var h=$(e);o=ce(h,"You won "),l=j(h,"STRONG",{class:!0});var g=$(l);m.l(g),r=ie(g),g.forEach(k),c=ce(h,"!"),h.forEach(k),this.h()},h(){q(l,"class","svelte-12sp8qd"),q(e,"class","svelte-12sp8qd")},m(p,h){K(p,e,h),C(e,o),C(e,l),m.m(l,null),C(l,r),C(e,c)},p(p,h){m.p(p,h)},d(p){p&&k(e),m.d()}}}function Ht(a){let e=a[10]+"",o,l,r=Z.asset.symbol+"",c;return{c(){o=re(e),l=ae(),c=re(r)},l(s){o=ce(s,e),l=ie(s),c=ce(s,r)},m(s,i){K(s,o,i),K(s,l,i),K(s,c,i)},p:Pe,d(s){s&&(k(o),k(l),k(c))}}}function Ut(a){let e,o=a[10]+"",l;return{c(){e=re("$"),l=re(o)},l(r){e=ce(r,"$"),l=ce(r,o)},m(r,c){K(r,e,c),K(r,l,c)},p:Pe,d(r){r&&(k(e),k(l))}}}function Gt(a){Ke(a);let e,o,l,r;function c(p,h){return p[8].length>0?Ze:Ft}function s(p,h){return h===Ze?Bt(p):p}let i=c(a),m=i(s(a,i));return{c(){e=Y("div"),m.c(),o=ae(),l=Y("img"),this.h()},l(p){e=j(p,"DIV",{slot:!0,class:!0});var h=$(e);m.l(h),o=ie(h),l=j(h,"IMG",{src:!0,alt:!0,class:!0}),h.forEach(k),this.h()},h(){et(l.src,r="/pooly.svg")||q(l,"src",r),q(l,"alt","Pooly"),q(l,"class","svelte-12sp8qd"),q(e,"slot","end-card"),q(e,"class","plinko-end-card svelte-12sp8qd")},m(p,h){K(p,e,h),m.m(e,null),C(e,o),C(e,l)},p(p,h){Ke(p),m.p(s(p,i),h)},d(p){p&&k(e),m.d()}}}function Yt(a){let e,o,l,r,c;Pt(a[4]);let s=!!a[2].length&&!!a[1]&&Qe(a);return o=new Ct({props:{onClick:a[5]}}),{c(){s&&s.c(),e=ae(),at(o.$$.fragment)},l(i){s&&s.l(i),e=ie(i),it(o.$$.fragment,i)},m(i,m){s&&s.m(i,m),K(i,e,m),rt(o,i,m),l=!0,r||(c=nt(window,"resize",a[4]),r=!0)},p(i,[m]){i[2].length&&i[1]?s?(s.p(i,m),m&2&&ge(s,1)):(s=Qe(i),s.c(),ge(s,1),s.m(e.parentNode,e)):s&&(st(),Me(s,1,1,()=>{s=null}),ot())},i(i){l||(ge(s),ge(o.$$.fragment,i),l=!0)},o(i){Me(s),Me(o.$$.fragment,i),l=!1},d(i){i&&k(e),s&&s.d(i),ct(o,i),r=!1,c()}}}function jt(a,e,o){let l,r;Be(a,He,g=>o(6,l=g)),Be(a,Dt,g=>o(7,r=g));const c=(l==null?void 0:l.list)??[];let s,i;const m=()=>{r&&l&&(Tt.set(l.queriedAtBlockNumber),Rt(r,{checkBlockNumber:l.queriedAtBlockNumber}).then(He.set))};function p(){o(0,s=window.innerWidth)}const h=()=>Vt("/account");return a.$$.update=()=>{a.$$.dirty&3&&s&&!i&&o(1,i=s>1760?{width:480,height:800,columns:6}:{width:300,height:500,columns:4})},[s,i,c,m,p,h]}class el extends tt{constructor(e){super(),lt(this,e,jt,Yt,$e,{})}}export{el as component};