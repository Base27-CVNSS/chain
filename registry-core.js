/* ChainScope registry harmonizer. Source: https://chainlist.org/rpcs.json */
(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.ChainRegistryCore=api})(typeof window!=="undefined"?window:globalThis,function(){
 const TARGET=600;
 const aliases={"ethereum mainnet":"ethereum","bnb smart chain mainnet":"binance smart chain","bsc mainnet":"binance smart chain","polygon mainnet":"polygon","polygon pos":"polygon","op mainnet":"optimism","arbitrum one":"arbitrum","avalanche c chain":"avalanche","fantom opera":"fantom","tron mainnet":"tron","gnosis chain":"gnosis","base mainnet":"base","zk sync era":"zksync","zksync era":"zksync","bnb smart chain":"binance smart chain","polygon pos mainnet":"polygon"};
 const deny=/\b(testnet|test net|devnet|dev net|sepolia|goerli|holesky|hoodi|fuji|mumbai|amoy|chiado|calibration|staging|sandbox|localnet|localhost|regtest|ropsten|rinkeby|kovan|ganache|hardhat|devchain|testchain|deprecated)\b/i;
 function clean(s){return String(s||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\([^)]*\)/g," ").replace(/[^a-z0-9]+/g," ").trim();}
 function canonical(s){let k=clean(s).replace(/\s+(mainnet|network)\s*$/,"").trim();return aliases[k]||k}
 function safeURL(s){try{const u=new URL(s);return u.protocol==="https:"?u.href:""}catch{return""}}
 function eligible(e){
  if(!e||typeof e.name!=="string"||!e.name.trim()||!Number.isSafeInteger(Number(e.chainId))||Number(e.chainId)<=0)return false;
  if(e.isTestnet===true||e.status==="deprecated"||e.status==="incubating"||deny.test(e.name))return false;
  if(!e.nativeCurrency||!String(e.nativeCurrency.symbol||"").trim())return false;
  return true;
 }
 function asRecord(e){
  return {n:e.name.trim(),s:String(e.nativeCurrency.symbol).trim(),p:null,c:null,t:null,sh:null,
   con:"",alg:"",iso:"Unknown",vsic:[],chainId:Number(e.chainId),
   chainSlug:String(e.chainSlug||""),iconKey:String(e.icon||""),networkType:e.parent?.type==="L2"?"L2":e.parent?.type==="sidechain"?"Sidechain":"EVM",
   website:safeURL(e.infoURL),explorer:safeURL(e.explorers?.find(v=>safeURL(v.url))?.url),
   tvlSnapshot:Number.isFinite(e.tvl)?e.tvl:null,
   registrySource:"https://chainlist.org/rpcs.json",origin:"registry"};
 }
 function filterRegistry(entries,legacy,logoNames,target=TARGET){
  if(!Array.isArray(entries))throw Error("Registry API must return an array");
  const iconSet=new Set((logoNames||[]).map(x=>clean(String(x).replace(/^rsz_/i,"").replace(/\.(jpg|png|jpeg|webp)$/i,""))));
  const taken=new Set(),takenIds=new Set(),known=new Set(legacy.map(x=>canonical(x.n)));
  const mapped=[];
  for(const raw of entries){
    if(!eligible(raw))continue;
    const v=asRecord(raw),key=canonical(v.n);
    if(!key||taken.has(key)||takenIds.has(v.chainId))continue;
    taken.add(key);takenIds.add(v.chainId);
    const variants=[v.n,v.chainSlug,v.iconKey,v.n.replace(/\b(mainnet|network)\b/gi,"")].map(clean);
    v.logoLikely=variants.some(n=>n&&iconSet.has(n));
    v.matchedLegacy=known.has(key);
    mapped.push(v);
  }
  const extras=mapped.filter(x=>!x.matchedLegacy);
  extras.sort((a,b)=>{
   const x=Number(a.logoLikely)*100+(a.tvlSnapshot>0?15:0)+(a.website?2:0)+(a.explorer?2:0)+(a.chainId<100000?1:0);
   const y=Number(b.logoLikely)*100+(b.tvlSnapshot>0?15:0)+(b.website?2:0)+(b.explorer?2:0)+(b.chainId<100000?1:0);
   return y-x||a.n.localeCompare(b.n,"en")||a.chainId-b.chainId;
  });
  const count=Math.max(0,target-legacy.length);
  const matchIndex={};mapped.filter(x=>x.matchedLegacy).forEach(x=>{matchIndex[canonical(x.n)]=x});
  return {extras:extras.slice(0,count),matchIndex,available:extras.length,total:legacy.length+Math.min(count,extras.length),sourceCount:entries.length};
 }
 function apply(legacy,generated){
  const base=legacy.slice(),match=generated.matchIndex||{};
  const usedIds=new Set();
  for(const d of base){const m=match[canonical(d.n)];if(m){for(const key of ["chainSlug","iconKey","networkType","website","explorer","registrySource","tvlSnapshot"])if(m[key]!=null&&!d[key])d[key]=m[key];if(!usedIds.has(m.chainId)&&!d.chainId)d.chainId=m.chainId;}if(d.chainId){if(usedIds.has(d.chainId))delete d.chainId;else usedIds.add(d.chainId)}}
  const seen=new Set(base.map(x=>canonical(x.n))),chainIds=new Set(base.filter(x=>x.chainId).map(x=>x.chainId));
  for(const r of generated.extras||[]){const k=canonical(r.n);if(!k||seen.has(k)||chainIds.has(r.chainId)||base.length>=TARGET)continue;seen.add(k);chainIds.add(r.chainId);base.push(r)}
  return base;
 }
 return {TARGET,clean,canonical,safeURL,eligible,asRecord,filterRegistry,apply};
});
