const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./initialFX-D9-N_5Kg.js","./Navbar-BkXIQzbm.js","./vendor-r3f-C7KMGUM-.js","./vendor-three-CfRo6kPo.js","./ScrollTrigger-CezCZ8EY.js","./vendor-gsap-B4ZbEoBF.js","./Navbar-Bdlyh2nq.css","./vendor-react-kaGRntkA.js","./index-CVM8voxX.js","./MainContainer-DyQ787Z5.js","./MainContainer-xbiRSUH_.css"])))=>i.map(i=>d[i]);
import{r as i,_ as I,j as e,c as U}from"./vendor-r3f-C7KMGUM-.js";import{G as w}from"./vendor-react-kaGRntkA.js";import"./vendor-three-CfRo6kPo.js";(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const f of a.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&o(f)}).observe(document,{childList:!0,subtree:!0});function l(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=l(r);fetch(r.href,a)}})();var V={};function Z(t){if(typeof window>"u")return;const n=document.createElement("style");return n.setAttribute("type","text/css"),n.innerHTML=t,document.head.appendChild(n),t}Object.defineProperty(V,"__esModule",{value:!0});var s=i;function J(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var h=J(s);Z(`.rfm-marquee-container {
  overflow-x: hidden;
  display: flex;
  flex-direction: row;
  position: relative;
  width: var(--width);
  transform: var(--transform);
}
.rfm-marquee-container:hover div {
  animation-play-state: var(--pause-on-hover);
}
.rfm-marquee-container:active div {
  animation-play-state: var(--pause-on-click);
}

.rfm-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
}
.rfm-overlay::before, .rfm-overlay::after {
  background: linear-gradient(to right, var(--gradient-color), rgba(255, 255, 255, 0));
  content: "";
  height: 100%;
  position: absolute;
  width: var(--gradient-width);
  z-index: 2;
  pointer-events: none;
  touch-action: none;
}
.rfm-overlay::after {
  right: 0;
  top: 0;
  transform: rotateZ(180deg);
}
.rfm-overlay::before {
  left: 0;
  top: 0;
}

.rfm-marquee {
  flex: 0 0 auto;
  min-width: var(--min-width);
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  animation: scroll var(--duration) linear var(--delay) var(--iteration-count);
  animation-play-state: var(--play);
  animation-delay: var(--delay);
  animation-direction: var(--direction);
}
@keyframes scroll {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.rfm-initial-child-container {
  flex: 0 0 auto;
  display: flex;
  min-width: auto;
  flex-direction: row;
  align-items: center;
}

.rfm-child {
  transform: var(--transform);
}`);const Q=s.forwardRef(function({style:n={},className:l="",autoFill:o=!1,play:r=!0,pauseOnHover:a=!1,pauseOnClick:f=!1,direction:d="left",speed:x=50,delay:c=0,loop:m=0,gradient:b=!1,gradientColor:N="white",gradientWidth:y=200,onFinish:H,onCycleComplete:D,onMount:P,children:E},G){const[L,k]=s.useState(0),[C,W]=s.useState(0),[_,R]=s.useState(1),[z,X]=s.useState(!1),F=s.useRef(null),v=G||F,j=s.useRef(null),M=s.useCallback(()=>{if(j.current&&v.current){const u=v.current.getBoundingClientRect(),T=j.current.getBoundingClientRect();let g=u.width,p=T.width;(d==="up"||d==="down")&&(g=u.height,p=T.height),R(o&&g&&p&&p<g?Math.ceil(g/p):1),k(g),W(p)}},[o,v,d]);s.useEffect(()=>{if(z&&(M(),j.current&&v.current)){const u=new ResizeObserver(()=>M());return u.observe(v.current),u.observe(j.current),()=>{u&&u.disconnect()}}},[M,v,z]),s.useEffect(()=>{M()},[M,E]),s.useEffect(()=>{X(!0)},[]),s.useEffect(()=>{typeof P=="function"&&P()},[]);const A=s.useMemo(()=>o?C*_/x:C<L?L/x:C/x,[o,L,C,_,x]),Y=s.useMemo(()=>Object.assign(Object.assign({},n),{"--pause-on-hover":!r||a?"paused":"running","--pause-on-click":!r||a&&!f||f?"paused":"running","--width":d==="up"||d==="down"?"100vh":"100%","--transform":d==="up"?"rotate(-90deg)":d==="down"?"rotate(90deg)":"none"}),[n,r,a,f,d]),K=s.useMemo(()=>({"--gradient-color":N,"--gradient-width":typeof y=="number"?`${y}px`:y}),[N,y]),q=s.useMemo(()=>({"--play":r?"running":"paused","--direction":d==="left"?"normal":"reverse","--duration":`${A}s`,"--delay":`${c}s`,"--iteration-count":m?`${m}`:"infinite","--min-width":o?"auto":"100%"}),[r,d,A,c,m,o]),S=s.useMemo(()=>({"--transform":d==="up"?"rotate(90deg)":d==="down"?"rotate(-90deg)":"none"}),[d]),O=s.useCallback(u=>[...Array(Number.isFinite(u)&&u>=0?u:0)].map((T,g)=>h.default.createElement(s.Fragment,{key:g},s.Children.map(E,p=>h.default.createElement("div",{style:S,className:"rfm-child"},p)))),[S,E]);return z?h.default.createElement("div",{ref:v,style:Y,className:"rfm-marquee-container "+l},b&&h.default.createElement("div",{style:K,className:"rfm-overlay"}),h.default.createElement("div",{className:"rfm-marquee",style:q,onAnimationIteration:D,onAnimationEnd:H},h.default.createElement("div",{className:"rfm-initial-child-container",ref:j},s.Children.map(E,u=>h.default.createElement("div",{style:S,className:"rfm-child"},u))),O(_-1)),h.default.createElement("div",{className:"rfm-marquee",style:q},O(_))):null});var ee=V.default=Q;const te=({percent:t})=>{const{setIsLoading:n}=re(),[l,o]=i.useState(!1),[r,a]=i.useState(!1),[f,d]=i.useState(!1);i.useEffect(()=>{if(t>=100){const c=setTimeout(()=>{o(!0);const m=setTimeout(()=>{a(!0)},800);return()=>clearTimeout(m)},400);return()=>clearTimeout(c)}},[t]),i.useEffect(()=>{const c=setTimeout(()=>{o(!0),a(!0)},7e3);return()=>clearTimeout(c)},[]),i.useEffect(()=>{I(()=>import("./initialFX-D9-N_5Kg.js"),__vite__mapDeps([0,1,2,3,4,5,6,7]),import.meta.url).then(c=>{r&&(d(!0),setTimeout(()=>{c.initialFX&&c.initialFX(),n(!1)},900))})},[r]);function x(c){const{currentTarget:m}=c,b=m.getBoundingClientRect(),N=c.clientX-b.left,y=c.clientY-b.top;m.style.setProperty("--mouse-x",`${N}px`),m.style.setProperty("--mouse-y",`${y}px`)}return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"loading-header",children:[e.jsxs("a",{href:"/#",className:"loader-title navbar-title","data-cursor":"disable",children:[e.jsx("img",{src:"./images/logo.png",alt:"Aayush Bhatta Logo",className:"navbar-logo-img"}),e.jsx("span",{children:"AAYUSH"})]}),e.jsx("div",{className:`loaderGame ${f&&"loader-out"}`,children:e.jsxs("div",{className:"loaderGame-container",children:[e.jsx("div",{className:"loaderGame-in",children:[...Array(27)].map((c,m)=>e.jsx("div",{className:"loaderGame-line"},m))}),e.jsx("div",{className:"loaderGame-ball"})]})})]}),e.jsxs("div",{className:"loading-screen",children:[e.jsx("div",{className:"loading-marquee",children:e.jsxs(ee,{children:[e.jsx("span",{children:" A Creative Developer"})," ",e.jsx("span",{children:"A Creative Designer"}),e.jsx("span",{children:" A Creative Developer"})," ",e.jsx("span",{children:"A Creative Designer"})]})}),e.jsxs("div",{className:`loading-wrap ${f&&"loading-clicked"}`,onMouseMove:c=>x(c),children:[e.jsx("div",{className:"loading-hover"}),e.jsxs("div",{className:`loading-button ${l&&"loading-complete"}`,children:[e.jsxs("div",{className:"loading-container",children:[e.jsx("div",{className:"loading-content",children:e.jsxs("div",{className:"loading-content-in",children:["Loading ",e.jsxs("span",{children:[t,"%"]})]})}),e.jsx("div",{className:"loading-box"})]}),e.jsx("div",{className:"loading-content2",children:e.jsx("span",{children:"Welcome"})})]})]})]})]})},me=t=>{let n=0,l=setInterval(()=>{if(n<=50){let a=Math.round(Math.random()*5);n=n+a,t(n)}else clearInterval(l),l=setInterval(()=>{n=n+Math.round(Math.random()),t(n),n>91&&clearInterval(l)},2e3)},100);function o(){clearInterval(l),t(100)}function r(){return new Promise(a=>{clearInterval(l),l=setInterval(()=>{n<100?(n++,t(n)):(a(n),clearInterval(l))},2)})}return{loaded:r,percent:n,clear:o}},$=i.createContext(null),ne=({children:t})=>{const[n,l]=i.useState(!0),[o,r]=i.useState(0),a={isLoading:n,setIsLoading:l,setLoading:r};return i.useEffect(()=>{},[o]),e.jsxs($.Provider,{value:a,children:[n&&e.jsx(te,{percent:o}),e.jsx("main",{className:"main-body",children:t})]})},re=()=>{const t=i.useContext($);if(!t)throw new Error("useLoading must be used within a LoadingProvider");return t};function fe(t){return w({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M6 6v2h8.59L5 17.59 6.41 19 16 9.41V18h2V6z"},child:[]}]})(t)}function ae(t){return w({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"},child:[]}]})(t)}function he(t){return w({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.89 1.28-2.98 1.88-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"},child:[]}]})(t)}function ve(t){return w({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"},child:[]}]})(t)}function ge(t){return w({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{fill:"none",d:"M0 0h24v24H0z"},child:[]},{tag:"path",attr:{d:"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"},child:[]}]})(t)}const B=i.createContext(void 0),se=({children:t})=>{const[n,l]=i.useState(null),o=i.useCallback(r=>{l(r),setTimeout(()=>{l(a=>a===r?null:a)},2800)},[]);return e.jsxs(B.Provider,{value:{showToast:o},children:[t,n&&e.jsx("div",{className:"toast-container",role:"status","aria-live":"polite",children:e.jsxs("div",{className:"toast-box",children:[e.jsx("span",{className:"toast-icon",children:e.jsx(ae,{})}),e.jsx("span",{children:n})]})})]})},pe=()=>{const t=i.useContext(B);if(!t)throw new Error("useToast must be used within a ToastProvider");return t},ie=i.lazy(()=>I(()=>import("./index-CVM8voxX.js"),__vite__mapDeps([8,2,3,5,4,7]),import.meta.url)),oe=i.lazy(()=>I(()=>import("./MainContainer-DyQ787Z5.js"),__vite__mapDeps([9,2,3,5,1,4,6,7,10]),import.meta.url)),le=()=>e.jsx(e.Fragment,{children:e.jsx(se,{children:e.jsx(ne,{children:e.jsx(i.Suspense,{children:e.jsx(oe,{children:e.jsx(i.Suspense,{children:e.jsx(ie,{})})})})})})});U(document.getElementById("root")).render(e.jsx(i.StrictMode,{children:e.jsx(le,{})}));export{ge as M,pe as a,fe as b,he as c,ve as d,me as s,re as u};
