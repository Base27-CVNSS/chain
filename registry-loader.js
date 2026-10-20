/* Merge a prebuilt snapshot immediately and refresh directly only when no snapshot exists. */
(function(){
 const core=window.ChainRegistryCore, data=window.DATA;
 if(!core||!Array.isArray(data))return;
 let status="legacy",snapshotMeta=null;
 function apply(generated){
  if(!generated||!Array.isArray(generated.extras))return false;
  const legacy=data.filter(d=>d.origin!=="registry"),next=core.apply(legacy,generated);
  if(next.length<550||next.length>650)return false;
  data.splice(0,data.length,...next);
  snapshotMeta={fetchedAt:generated.fetchedAt||new Date().toISOString(),source:generated.source||"https://chainlist.org/rpcs.json",extra:next.length-legacy.length,count:next.length};
  status="registry";
  document.dispatchEvent(new CustomEvent("chainscope:updated",{detail:snapshotMeta}));
  return true;
 }
 window.ChainRegistry={get status(){return status},get snapshot(){return snapshotMeta},apply};
 if(window.CHAIN_REGISTRY_SNAPSHOT&&apply(window.CHAIN_REGISTRY_SNAPSHOT))return;
 window.addEventListener("DOMContentLoaded",async()=>{
  const note=document.getElementById("registryStatus");
  if(note)note.textContent="Đang tải danh mục mở rộng từ ChainList…";
  try{
   const response=await fetch("https://chainlist.org/rpcs.json",{mode:"cors",cache:"no-store",signal:AbortSignal.timeout(35000)});
   if(!response.ok)throw Error("HTTP "+response.status);
   const items=await response.json();
   const generated=core.filterRegistry(items,data,window.CHAIN_LOGO_FILES||[],core.TARGET);
   generated.fetchedAt=new Date().toISOString();generated.source="https://chainlist.org/rpcs.json";
   if(!apply(generated))throw Error("Không đủ mạng đáp ứng điều kiện sàng lọc; hiện có "+generated.total);
  }catch(error){
   status="legacy";
   if(note)note.textContent="Chỉ có 257 hồ sơ lưu sẵn · đồng bộ ChainList chưa thành công";
   console.warn("[ChainScope] Registry unavailable; original snapshot preserved:",error);
  }
 });
})();
