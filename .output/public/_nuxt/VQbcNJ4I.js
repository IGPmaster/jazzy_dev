import{_ as b}from"./C-p6iP6P.js";import{a as w,_ as y}from"./s1WEfRO0.js";import{_ as C,r as g,n as h,o as f,c as x,a as e,t as s,u as t,y as o,M as F,a0 as j,b as n,w as c,a1 as z,d as l,A as u,Y as p}from"./h1H4TonX.js";import"./BviaEbYD.js";import"./D0l3-aUR.js";const B={key:0},L={class:"cookie-consent"},M={class:"py-10 text-black"},E={__name:"CookieConsent",setup(v){const r=g(!1),m=()=>{r.value=!0,localStorage.setItem("cookiesAccepted","true")};return h(()=>{localStorage.getItem("cookiesAccepted")==="true"&&(r.value=!0)}),(i,d)=>r.value?F("",!0):(f(),x("div",B,[e("div",L,[e("p",M,s(t(o).cookieConsent),1),e("button",{class:"bg-login-gradient text-black py-1.5 shadow-lg tracking-wider px-6 font-semibold uppercase rounded",onClick:m},s(t(o).accept),1)])]))}},I=C(E,[["__scopeId","data-v-afe6dd5c"]]),H="data:image/svg+xml,%3csvg%20width='22'%20height='22'%20viewBox='0%200%2022%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M12.9%204H4.1C3.49249%204%203%204.44772%203%205C3%205.55228%203.49249%206%204.1%206H12.9C13.5075%206%2014%205.55228%2014%205C14%204.44772%2013.5075%204%2012.9%204Z'%20fill='%23F5F5F5'/%3e%3cpath%20d='M18%2010H4C3.44771%2010%203%2010.4477%203%2011C3%2011.5523%203.44771%2012%204%2012H18C18.5523%2012%2019%2011.5523%2019%2011C19%2010.4477%2018.5523%2010%2018%2010Z'%20fill='%23F5F5F5'/%3e%3cpath%20d='M15.9231%2016H4.07692C3.48215%2016%203%2016.4477%203%2017C3%2017.5523%203.48215%2018%204.07692%2018H15.9231C16.5178%2018%2017%2017.5523%2017%2017C17%2016.4477%2016.5178%2016%2015.9231%2016Z'%20fill='%23F5F5F5'/%3e%3crect%20x='0.15'%20y='0.15'%20width='21.7'%20height='21.7'%20rx='0.85'%20stroke='%23F5F5F5'%20stroke-width='0.3'/%3e%3c/svg%3e",A={class:""},N={class:"top-menu bg-jazzy-blue fixed z-10 py-4 shadow-lg items-center w-full"},V={class:"w-full md:px-0"},$={class:"container md:mx-auto grid grid-cols-3 items-center"},S={class:"left"},Z={class:"menu-btn items-center",id:"menu-btn"},T={class:"menu bg-gray-700 text-white rounded text-left w-36 drop-shadow-[0_15px_15px_rgba(0,0,0,0.50)] transition duration-300 ease-in-out transform scale-0 origin-top",id:"menu"},D=["href"],O={class:""},P={class:"right"},U={class:"grid-cols-2 gap-6 hidden lg:flex justify-end"},Y={class:"items-center"},q=["href"],G={class:"items-center"},J=["href"],K={class:"flex lg:hidden right items-center pr-4 justify-end"},Q=["href"],se={__name:"default",setup(v){const r=g(!1);h(()=>{const i=document.getElementById("menu-btn"),d=document.getElementById("menu"),a=_=>{!d.contains(_.target)&&!i.contains(_.target)&&(r.value=!1,m())};i.addEventListener("click",()=>{r.value=!r.value,m()}),document.addEventListener("click",a),j(()=>{document.removeEventListener("click",a)})});function m(){const i=document.getElementById("menu");r.value?i.style.transform="scale(1)":i.style.transform="scale(0)"}return(i,d)=>{const a=b,_=y,k=I;return f(),x("div",A,[e("nav",N,[e("div",V,[e("div",$,[e("div",S,[e("div",Z,[d[0]||(d[0]=e("img",{src:H,alt:"Mobile Menu Button",class:"w-12 h-12 pl-4 items-center"},null,-1)),e("div",T,[n(a,{to:"/",class:"menu-item hover:bg-slate-800 px-5"},{default:c(()=>[l(s(t(o).home),1)]),_:1}),n(a,{to:"/promotions",class:"menu-item hover:bg-slate-800 px-5"},{default:c(()=>[l(s(t(o).promotions),1)]),_:1}),n(a,{to:"/compliance",class:"menu-item hover:bg-slate-800 px-5"},{default:c(()=>[l(s(t(o).legal),1)]),_:1}),n(a,{to:"/all-games",class:"menu-item hover:bg-slate-800 px-5"},{default:c(()=>[l(s(t(o).all_games),1)]),_:1}),n(a,{to:"/popular-games",class:"menu-item hover:bg-slate-800 px-5"},{default:c(()=>[l(s(t(o).popular_games),1)]),_:1}),n(a,{to:"/slot-games",class:"menu-item hover:bg-slate-800 px-5"},{default:c(()=>[l(s(t(o).slot_games),1)]),_:1}),n(a,{to:"/casino-games",class:"menu-item hover:bg-slate-800 px-5"},{default:c(()=>[l(s(t(o).casino_games),1)]),_:1}),n(a,{to:"/jackpot-games",class:"menu-item hover:bg-slate-800 px-5"},{default:c(()=>[l(s(t(o).jackpot_games),1)]),_:1}),n(a,{to:"/compliance/contact",class:"menu-item hover:bg-slate-800 px-5"},{default:c(()=>[l(s(t(o).contact),1)]),_:1}),e("a",{href:t(u),class:"menu-item hover:bg-slate-800 px-5"},s(t(o).login),9,D)])])]),e("div",O,[n(a,{class:"flex justify-center",to:"/"},{default:c(()=>d[1]||(d[1]=[e("img",{src:w,alt:"Vegas Paradise header Logo",class:"",width:"200",height:""},null,-1)])),_:1})]),e("div",P,[e("ul",U,[e("li",Y,[e("a",{href:t(p),class:"text-primary bg-jazzy-green py-1.5 shadow-lg tracking-wider px-6 font-normal uppercase rounded"},s(t(o).login),9,q)]),e("li",G,[e("a",{href:t(u),class:"text-white bg-jazzy-red-secondary py-1.5 shadow-lg tracking-wider px-6 font-normal rounded hover:text-primary hover:bg-jazzy-red transition ease-in-out duration-400 hover:scale-110 uppercase cursor-pointer"},s(t(o).sign_up),9,J)])]),e("div",K,[e("a",{href:t(p),class:"cas-btn px-4"},"Login",8,Q)])])])])]),z(i.$slots,"default"),n(_),n(k)])}}};export{se as default};
