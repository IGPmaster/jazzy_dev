import{e as r,o as l,H as o,w as c,d as i,t as p,u,R as m,n as d,ah as g}from"./entry.a7a63bae.js";const x={__name:"TranslatedText",props:{translationKey:{type:String,required:!0},loadingText:{type:String,default:"..."},tag:{type:String,default:"span"},class:{type:String,default:""}},setup(a){const e=a,n=r(()=>e.translationKey.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()).join(" "));return(t,y)=>(l(),o(g(a.tag),{class:d(a.class)},{default:c(()=>{var s;return[i(p(((s=u(m))==null?void 0:s[e.translationKey])||n.value),1)]}),_:1},8,["class"]))}};export{x as _};
