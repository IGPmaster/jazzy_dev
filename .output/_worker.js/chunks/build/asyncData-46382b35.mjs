import{v as a,w as e}from"./server.mjs";import{b as t,x as r,l as s,E as n,u as i}from"../routes/renderer.mjs";const getDefault=()=>null;function useAsyncData(...o){var l,u,c,d,y;const f="string"==typeof o[o.length-1]?o.pop():void 0;"string"!=typeof o[0]&&o.unshift(f);let[m,p,v={}]=o;if("string"!=typeof m)throw new TypeError("[nuxt] [asyncData] key must be a string.");if("function"!=typeof p)throw new TypeError("[nuxt] [asyncData] handler must be a function.");v.server=null==(l=v.server)||l,v.default=null!=(u=v.default)?u:getDefault,v.lazy=null!=(c=v.lazy)&&c,v.immediate=null==(d=v.immediate)||d;const _=a(),getCachedData=()=>_.isHydrating?_.payload.data[m]:_.static.data[m],hasCachedData=()=>void 0!==getCachedData();_._asyncData[m]||(_._asyncData[m]={data:t(null!=(y=getCachedData())?y:v.default()),pending:t(!hasCachedData()),error:r(_.payload._errors,m),status:t("idle")});const D={..._._asyncData[m]};D.refresh=D.execute=(a={})=>{if(_._asyncDataPromises[m]){if(!1===a.dedupe)return _._asyncDataPromises[m];_._asyncDataPromises[m].cancelled=!0}if((a._initial||_.isHydrating&&!1!==a._initial)&&hasCachedData())return getCachedData();D.pending.value=!0,D.status.value="pending";const t=new Promise(((a,e)=>{try{a(p(_))}catch(a){e(a)}})).then((a=>{if(t.cancelled)return _._asyncDataPromises[m];let e=a;v.transform&&(e=v.transform(a)),v.pick&&(e=function(a,e){const t={};for(const r of e)t[r]=a[r];return t}(e,v.pick)),D.data.value=e,D.error.value=null,D.status.value="success"})).catch((a=>{if(t.cancelled)return _._asyncDataPromises[m];D.error.value=a,D.data.value=i(v.default()),D.status.value="error"})).finally((()=>{t.cancelled||(D.pending.value=!1,_.payload.data[m]=D.data.value,D.error.value&&(_.payload._errors[m]=e(D.error.value)),delete _._asyncDataPromises[m])}));return _._asyncDataPromises[m]=t,_._asyncDataPromises[m]};if(!1!==v.server&&_.payload.serverRendered&&v.immediate){const a=D.refresh({_initial:!0});s()?n((()=>a)):_.hook("app:created",(()=>a))}const g=Promise.resolve(_._asyncDataPromises[m]).then((()=>D));return Object.assign(g,D),g}export{useAsyncData as u};
//# sourceMappingURL=asyncData-46382b35.mjs.map
