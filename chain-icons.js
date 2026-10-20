/* Official matching artwork where present; otherwise clearly labeled generated identicon. */
(function(){
 const names=Array.isArray(window.CHAIN_LOGO_FILES)?window.CHAIN_LOGO_FILES:[];
 const root=window.CHAIN_LOGO_ROOT||"https://raw.githubusercontent.com/DefiLlama/icons/v2/assets/chains/";
 function norm(v){return String(v||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"")}
 const index=new Map();
 for(const file of names){const key=norm(file.replace(/^rsz_/i,"").replace(/\.(png|jpe?g|webp)$/i,""));if(!index.has(key))index.set(key,file)}
 const alias={
  "binancesmartchain":"bsc","bnbsmartchainmainnet":"bsc","bnbsmartchain":"bsc","optimism":"optimism",
  "opmainnet":"optimism","arbitrumone":"arbitrum","ethereummainnet":"ethereum","polygonmainnet":"polygon",
  "polygonpos":"polygon","fantomopera":"fantom","bitcoincash":"bitcoincash","bitcoinmainnet":"bitcoin",
  "avalanchecchain":"avalanche","avalanche":"avalanche","zksyncera":"zksync","solanamainnet":"solana",
  "hederahashgraph":"hedera","theopennetwork":"ton","ton":"ton","tronnmainnet":"tron",
  "xrp":"ripple","dogecoin":"doge","zksync":"zksyncera","injectiveprotocol":"injective",
  "stacksblockchain":"stacks","bitcicoin":"bitcichain","kucoinshares":"kucoin","blasttoken":"blast"
 };
 function href(d){
  const list=[d.chainSlug,d.iconKey,d.n,d.n.replace(/\b(mainnet|network|chain)\b/gi,"")].map(norm);
  for(let k of list){
   k=alias[k]||k;if(!k)continue;
   const file=index.get(k);if(file)return root+encodeURIComponent(file);
  }
  return "";
 }
 function escape(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
 function hue(s){let h=0;for(const c of String(s||""))h=(Math.imul(33,h)+c.charCodeAt(0))>>>0;return h%360}
 function avatar(d,large){
  const url=href(d),h=hue(d.chainId||d.n);
  const letters=(String(d.s&&d.s!=="—"?d.s:d.n).replace(/[^a-z0-9]/gi,"").slice(0,2)||"⟐").toUpperCase();
  return '<span class="chain-avatar'+(large?' chain-avatar-large':'')+'" style="--ident-hue:'+h+'"><span class="chain-ident" title="Biểu tượng định danh dự phòng; không phải logo chính thức">'+escape(letters)+'</span>'+(url?'<img class="chain-logo-img" src="'+escape(url)+'" alt="Logo '+escape(d.n)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">':'')+'</span>';
 }
 document.addEventListener("error",e=>{if(e.target?.classList?.contains("chain-logo-img"))e.target.style.display="none"},true);
 window.ChainIcons={avatar,href,logoCount:names.length};
})();
