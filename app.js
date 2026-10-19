(function application(){
"use strict";
const D=Array.isArray(window.DATA)?window.DATA:[], DETAIL=window.CHAIN_DETAILS||{}, VSIC=window.VSIC_SECTORS||{};
const $=id=>document.getElementById(id);
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=n=>Number(n||0).toLocaleString("vi-VN");
const money=n=>Number.isFinite(n)?("$"+(n>=1000?n.toLocaleString("en-US",{maximumFractionDigits:0}):n>=1?n.toFixed(2):n>=.01?n.toFixed(4):n.toFixed(8).replace(/0+$/,""))):"—";
const GROUPS=[
 {id:"identity",title:"01 · Dự án & pháp lý",fields:[
 ["founders","Người sáng lập","Tên, tiểu sử, kinh nghiệm và vai trò"],
 ["launchYear","Năm ra mắt mainnet","Phân biệt năm thành lập, testnet và mainnet"],
 ["whitepaper","Sách trắng","Tài liệu gốc, bản phát hành và nội dung"],
 ["website","Website chính thức","Đường dẫn từ chủ dự án"],
 ["docs","Tài liệu kỹ thuật","Hướng dẫn API, SDK, node, contract"],
 ["github","Mã nguồn GitHub / Open Source","Mã nguồn, giấy phép, commit, contributor, audit"]]},
 {id:"technical",title:"02 · Kỹ thuật & đồng thuận",fields:[
 ["consensus","Cơ chế đồng thuận","PoW, PoS, BFT, DPoS; PoH không tự là đồng thuận"],
 ["architecture","Kiến trúc blockchain","UTXO/account; L1/L2/sidechain; bảo mật nền"],
 ["security","Cơ chế bảo mật","Chữ ký số, hàm băm, ZK, mã hóa, audit"],
 ["decentralization","Mức độ phi tập trung","Node, validator, cổ phần và quyền quản trị"],
 ["validator","Điều kiện validator","Permissioned hay permissionless, stake, hạn chế"]]},
 {id:"tokenomics",title:"03 · Kinh tế token & thị trường",fields:[
 ["coin","Đồng coin / token","Native coin, governance token hoặc không có token riêng"],
 ["totalSupply","Tổng cung / max supply","Cần phân biệt tổng cung hiện tại và giới hạn tối đa"],
 ["circulatingSupply","Cung lưu hành","Số đang thực sự lưu hành, có thời điểm đo"],
 ["marketCap","Vốn hóa thị trường","Cung lưu hành × giá, nguồn và ngày đo"],
 ["gasFee","Phí gas / phí giao dịch","Biến thiên theo loại giao dịch và tải mạng"],
 ["walletCount","Số ví / địa chỉ ước tính","Địa chỉ on-chain không đồng nghĩa số người dùng"]]},
 {id:"ecosystem",title:"04 · Hệ sinh thái & cộng đồng",fields:[
 ["dapps","Ứng dụng / dApps","Ứng dụng triển khai thực tế, link và lĩnh vực"],
 ["community","Cộng đồng","Discord, Telegram, X và mức hoạt động"],
 ["explorer","Block explorer","Công cụ tra cứu block, giao dịch, địa chỉ"]]},
 {id:"performance",title:"05 · Hiệu năng & đánh giá",fields:[
 ["speed","TPS / thời gian tạo block","TPS đo thực tế khác TPS quảng cáo tối đa"],
 ["finality","Thời gian hoàn tất giao dịch","Probabilistic/deterministic, điều kiện finality"],
 ["pros","Ưu điểm","Lợi thế công nghệ hoặc hệ sinh thái có bằng chứng"],
 ["cons","Nhược điểm","Rủi ro kỹ thuật, tập trung, phí và vận hành"]]}
];
const FIELDS=GROUPS.flatMap(g=>g.fields.map(f=>({key:f[0],label:f[1],help:f[2],group:g.id})));
const KNOWN={
 Bitcoin:{launchYear:"2009",website:"https://bitcoin.org",whitepaper:"https://bitcoin.org/bitcoin.pdf",docs:"https://developer.bitcoin.org",github:"https://github.com/bitcoin/bitcoin",explorer:"https://mempool.space",architecture:"L1 · mô hình UTXO",security:"SHA-256; chữ ký ECDSA/Schnorr trên secp256k1",totalSupply:"Giới hạn tối đa: 21 triệu BTC",validator:"PoW: miner tham gia không cần cấp phép; full node độc lập xác minh khối",speed:"Khoảng 7 TPS (tham khảo, thay đổi theo cấu trúc giao dịch); block ~10 phút",finality:"Xác suất; mức tin cậy tăng dần theo số xác nhận",pros:"Mạng lưới lâu đời, nguồn cung giới hạn, xác thực độc lập",cons:"Thông lượng L1 hạn chế; xác nhận chậm; tiêu thụ điện của PoW"},
 Ethereum:{launchYear:"2015",website:"https://ethereum.org",whitepaper:"https://ethereum.org/en/whitepaper/",docs:"https://ethereum.org/en/developers/docs/",github:"https://github.com/ethereum",explorer:"https://etherscan.io",architecture:"L1 · account-based · máy ảo EVM",security:"Keccak-256; chữ ký secp256k1; PoS với slashing",validator:"PoS, validator không cần xin phép; điều kiện stake trực tiếp hoặc tham gia pool",pros:"Hệ sinh thái EVM và công cụ phát triển rộng; bảo mật nền cho nhiều L2",cons:"Phí L1 có thể cao; kiến trúc có độ phức tạp lớn"},
 Solana:{launchYear:"2020 (mainnet beta)",website:"https://solana.com",docs:"https://solana.com/docs",github:"https://github.com/anza-xyz/agave",explorer:"https://explorer.solana.com",architecture:"L1 · mô hình tài khoản · thực thi song song",security:"Chữ ký Ed25519; hàm băm SHA-256; PoH làm đồng hồ mật mã",validator:"PoS và Tower BFT; validator đòi hỏi hạ tầng và chi phí vận hành phù hợp",consensus:"Proof of Stake + Tower BFT; Proof of History (PoH) hỗ trợ sắp thứ tự thời gian",pros:"Thông lượng cao và phí giao dịch thấp trong nhiều tình huống",cons:"Yêu cầu phần cứng validator cao; lịch sử gián đoạn dịch vụ"},
 Algorand:{launchYear:"2019",website:"https://algorand.co",docs:"https://dev.algorand.co",github:"https://github.com/algorand/go-algorand",explorer:"https://allo.info",architecture:"L1 · account-based",consensus:"Pure Proof of Stake (PPoS)",pros:"Finality nhanh; phù hợp chứng thực dữ liệu và tài sản",cons:"Hệ sinh thái ứng dụng và thanh khoản nhỏ hơn các L1 dẫn đầu"},
 "Binance Smart Chain":{launchYear:"2020",website:"https://www.bnbchain.org",docs:"https://docs.bnbchain.org",github:"https://github.com/bnb-chain/bsc",explorer:"https://bscscan.com",architecture:"L1 · EVM/account-based",consensus:"Proof of Staked Authority (PoSA)",pros:"EVM tương thích và phí thường thấp",cons:"Bộ validator chủ động nhỏ hơn một số mạng permissionless khác"},
 Cardano:{launchYear:"2017",website:"https://cardano.org",docs:"https://docs.cardano.org",github:"https://github.com/IntersectMBO/cardano-node",explorer:"https://cardanoscan.io",architecture:"L1 · Extended UTXO (eUTXO)",security:"Giao thức đồng thuận Ouroboros PoS",pros:"Thiết kế hướng hình thức hóa, chú trọng nghiên cứu học thuật",cons:"Trải nghiệm phát triển eUTXO có đường cong học tập riêng"},
 Polygon:{website:"https://polygon.technology",docs:"https://docs.polygon.technology",github:"https://github.com/0xPolygon",explorer:"https://polygonscan.com",architecture:"Hệ giải pháp mở rộng Ethereum; cần phân biệt Polygon PoS với các rollup",pros:"Phí thấp, nhiều lựa chọn mở rộng",cons:"Phân loại L1/L2 và mô hình tin cậy khác nhau theo từng sản phẩm"},
 Arbitrum:{launchYear:"2021",website:"https://arbitrum.io",docs:"https://docs.arbitrum.io",github:"https://github.com/OffchainLabs/nitro",explorer:"https://arbiscan.io",architecture:"Ethereum L2 · optimistic rollup · account-based",pros:"Tương thích EVM, thừa hưởng bảo mật settlement Ethereum theo mô hình rollup",cons:"Phụ thuộc mô hình sequencer và cơ chế chứng minh tranh chấp"},
 Base:{launchYear:"2023",website:"https://base.org",docs:"https://docs.base.org",github:"https://github.com/base",explorer:"https://basescan.org",architecture:"Ethereum L2 · OP Stack optimistic rollup",coin:"Không có native governance token riêng của Base; phí thanh toán bằng ETH",pros:"Tương thích EVM, kết nối hệ sinh thái Ethereum",cons:"Phụ thuộc sequencer và Ethereum; cần theo dõi lộ trình phân quyền"},
 Avalanche:{launchYear:"2020",website:"https://avax.network",docs:"https://build.avax.network/docs",github:"https://github.com/ava-labs/avalanchego",explorer:"https://snowtrace.io",architecture:"L1 đa chuỗi (P/C/X-Chain) và kiến trúc Avalanche L1",pros:"Finality nhanh, hỗ trợ mạng tùy chỉnh",cons:"Kiến trúc đa chuỗi làm tăng độ phức tạp triển khai"},
 Tron:{launchYear:"2018",website:"https://tron.network",docs:"https://developers.tron.network",github:"https://github.com/tronprotocol/java-tron",explorer:"https://tronscan.org",architecture:"L1 · account-based",consensus:"Delegated Proof of Stake (DPoS)",pros:"Mạnh về chuyển stablecoin và phí tương đối thấp ở nhiều luồng",cons:"Quyền sản xuất block tập trung vào nhóm đại diện được bầu"},
 "Zcash":{launchYear:"2016",website:"https://z.cash",docs:"https://zcash.readthedocs.io",github:"https://github.com/zcash/zcash",architecture:"L1 · UTXO với pool minh bạch và shielded",security:"zk-SNARK để bảo vệ dữ liệu giao dịch shielded",pros:"Bảo vệ quyền riêng tư mạnh trong các giao dịch shielded",cons:"Quản trị khóa xem/khóa chi tiêu và mức độ áp dụng shielded đòi hỏi chú ý"},
 "Optimism":{website:"https://www.optimism.io",docs:"https://docs.optimism.io",github:"https://github.com/ethereum-optimism/optimism",explorer:"https://optimistic.etherscan.io",architecture:"Ethereum L2 · optimistic rollup"},
 "Litecoin":{launchYear:"2011",website:"https://litecoin.org",github:"https://github.com/litecoin-project/litecoin",architecture:"L1 · UTXO",security:"PoW Scrypt; chữ ký secp256k1"}
};
const CHECKED={};let selected=new Set(),indexByName=new Map(D.map((x,i)=>[x.n,i])),filterPage=1, pageSize=30, currentModal=-1, lastFocus=null;
try{Object.assign(CHECKED,JSON.parse(localStorage.getItem("chainscope-edit-v2")||"{}"))}catch(_){}
function save(){try{localStorage.setItem("chainscope-edit-v2",JSON.stringify(CHECKED))}catch(_){}}
function valueObj(v,origin,url){return {value:String(v??"").trim(),origin:origin||"origin",url:url||""}}
function fields(d){
 const old=DETAIL[d.n]||{},known=KNOWN[d.n]||{},base={};
 const put=(k,v,origin="original",url)=>{if(v!==undefined&&v!==null&&String(v).trim()&&String(v).trim()!=="—"&&String(v).trim()!=="-")base[k]=valueObj(v,origin,url)};
 put("founders",old.founders);
 put("totalSupply",old.totalSupply);
 put("marketCap",old.marketCap&&old.marketCap+" · Giá trị lịch sử trong dữ liệu gốc (16/10/2026)");
 put("decentralization",old.decentralized);
 put("consensus",d.con==="Not recorded"?"":d.con);
 put("coin",d.s&&d.s!=="—"?(d.s+" · ticker ghi trong bộ dữ liệu nguồn; xác nhận native/token riêng còn cần kiểm tra"):null);
 if(old.dapps?.length)put("dapps",old.dapps.map(x=>x.name+" ("+x.desc+")").join("; "));
 for(let [k,v] of Object.entries(known)){
  if(["website","docs","github","whitepaper","explorer"].includes(k))put(k,"Mở "+({website:"website chính thức",docs:"tài liệu kỹ thuật",github:"mã nguồn GitHub",whitepaper:"sách trắng",explorer:"block explorer"}[k]),"reference",v);
  else put(k,v,"reference");
 }
 for(const [k,v] of Object.entries(CHECKED[d.n]||{})){if(v&&String(v).trim())put(k,v,"local");else delete base[k]}
 return base;
}
function coverage(d){return FIELDS.filter(x=>fields(d)[x.key]?.value).length}
const colors=["#29d5a2","#6da7ff","#f5c477","#ce9aff"];
function stat(){
 $("statTotal").textContent=num(D.length);
 $("statTokens").textContent=num(D.reduce((a,x)=>a+(Number(x.t)||0),0));
 $("statApplied").textContent=num(D.filter(x=>x.vsic?.length).length);
 $("statSectors").textContent=Object.keys(VSIC).filter(c=>D.some(x=>x.vsic?.includes(c))).length+" / "+Object.keys(VSIC).length;
 const ranked=[...D].sort((a,b)=>(b.t||0)-(a.t||0)).slice(0,10),max=Math.max(1,...ranked.map(x=>x.t||0));
 $("topChart").innerHTML=ranked.map(x=>`<div class="bar-row"><span class="bar-name" title="${E(x.n)}">${E(x.n)}</span><span class="bar-track"><span class="bar-fill" style="display:block;width:${100*(x.t||0)/max}%"></span></span><strong class="bar-val">${num(x.t)}</strong></div>`).join("");
 const isoNames=["Public Permissionless","Public Permissioned","Private Permissioned","Unknown"],counts=isoNames.map(n=>D.filter(x=>(x.iso||"Unknown")===n).length),sum=Math.max(1,D.length);
 let start=0;const stops=counts.map((v,i)=>{const next=start+v/sum*100, out=`${colors[i]} ${start.toFixed(2)}% ${next.toFixed(2)}%`;start=next;return out});
 $("isoRing").style.background="conic-gradient("+stops.join(",")+")";$("ringNumber").textContent=num(D.length);
 $("isoLegend").innerHTML=isoNames.map((name,i)=>`<div class="legend-item"><span class="legend-left"><i class="legend-dot" style="background:${colors[i]}"></i>${E(name)}</span><strong>${num(counts[i])}</strong></div>`).join("");
 const con={};for(const d of D)con[d.con||"Chưa xác định"]=(con[d.con||"Chưa xác định"]||0)+1;
 const entries=Object.entries(con).sort((a,b)=>b[1]-a[1]).slice(0,8);const cmax=entries[0]?.[1]||1;
 $("consensusChart").innerHTML=entries.map(([name,n])=>`<div class="simple-row"><span title="${E(name)}">${E(name.length>28?name.slice(0,27)+"…":name)}</span><b>${num(n)}</b><span class="bar-track"><span class="bar-fill" style="display:block;width:${100*n/cmax}%"></span></span></div>`).join("");
 const countsVSIC=Object.keys(VSIC).map(k=>[k,D.filter(x=>x.vsic?.includes(k)).length]).sort((a,b)=>b[1]-a[1]).slice(0,12);const vmax=Math.max(1,...countsVSIC.map(x=>x[1]));
 $("vsicChart").innerHTML=countsVSIC.map(([k,n])=>`<div class="vsic-item"><span class="sector-title" title="${E(VSIC[k])}"><b>${E(k)}</b> · ${E(VSIC[k])}</span><strong>${num(n)}</strong><span class="bar-track"><span class="bar-fill" style="display:block;width:${n/vmax*100}%"></span></span></div>`).join("");
}
function setup(){
 const unique=(prop)=>[...new Set(D.map(x=>x[prop]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"vi"));
 for(const c of unique("con"))$("filterConsensus").add(new Option(c,c));
 for(const c of unique("iso"))$("filterISO").add(new Option(c,c));
 Object.entries(VSIC).forEach(([code,label])=>$("filterVSIC").add(new Option(code+" · "+label,code)));
 for(const id of ["search","filterConsensus","filterISO","filterVSIC","filterSort"])$(id).addEventListener(id==="search"?"input":"change",()=>{filterPage=1;table()});
 $("clearFilters").onclick=()=>{$("search").value="";$("filterConsensus").value="";$("filterISO").value="";$("filterVSIC").value="";$("filterSort").value="tokens";filterPage=1;table()};
 $("modalClose").onclick=closeModal;$("compareClose").onclick=closeCompare;
 $("modalOverlay").addEventListener("click",e=>{if(e.target===$("modalOverlay"))closeModal()});
 $("compareOverlay").addEventListener("click",e=>{if(e.target===$("compareOverlay"))closeCompare()});
 window.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();closeCompare()}});
 $("compareButton").onclick=openCompare;$("compareNav").onclick=openCompare;
 $("exportCSV").onclick=exportCSV;$("downloadJSON").onclick=exportJSON;
 $("menuToggle").onclick=()=>$("menuToggle").closest(".shell").querySelector(".sidebar").classList.toggle("visible");
 document.querySelectorAll(".sidebar a.nav").forEach(a=>a.addEventListener("click",()=>document.querySelector(".sidebar").classList.remove("visible")));
 $("chainRows").addEventListener("click",e=>{const btn=e.target.closest("[data-open]");if(btn){openModal(Number(btn.dataset.open))}});
 $("chainRows").addEventListener("change",e=>{const box=e.target.closest("[data-select]");if(!box)return;const i=Number(box.dataset.select);if(box.checked&&selected.size>=3){box.checked=false;alert("Chỉ so sánh tối đa 3 blockchain cùng lúc.");return}box.checked?selected.add(i):selected.delete(i);counts()});
 $("modalContent").addEventListener("click",e=>{
  const t=e.target.closest("[data-edit]");if(t){const key=t.dataset.edit,i=currentModal;if(i<0)return;const d=D[i],prev=(CHECKED[d.n]||{})[key]||fields(d)[key]?.value||"";
   const v=prompt("Bổ sung / hiệu chỉnh: "+FIELDS.find(x=>x.key===key)?.label+"\nDữ liệu này chỉ lưu trên trình duyệt, chưa được kiểm chứng. Để trống để xóa ghi chú cá nhân.",prev);
   if(v!==null){CHECKED[d.n]??={};CHECKED[d.n][key]=v.trim();save();openModal(i);table()}}
  const a=e.target.closest("[data-jump]");if(a){e.preventDefault();$(a.dataset.jump)?.scrollIntoView({behavior:"smooth",block:"start"})}
  const b=e.target.closest("[data-export-chain]");if(b)download(D[currentModal].n+".json",JSON.stringify({snapshotDate:"2026-10-16",chain:D[currentModal],checklist:fields(D[currentModal])},null,2),"application/json");
 });
 $("modalContent").addEventListener("keydown",e=>{if(e.key==="Tab"){ /* native keyboard focus stays in modal on supported browsers */ }});
}
function selectedRows(){
 const text=$("search").value.trim().toLowerCase(),con=$("filterConsensus").value,iso=$("filterISO").value,sector=$("filterVSIC").value;
 let rows=D.map((d,i)=>({d,i})).filter(({d})=>(!text||(d.n+" "+d.s).toLowerCase().includes(text))&&(!con||d.con===con)&&(!iso||d.iso===iso)&&(!sector||d.vsic?.includes(sector)));
 const sort=$("filterSort").value;
 rows.sort((a,b)=>sort==="name"?a.d.n.localeCompare(b.d.n,"vi"):sort==="price"?(b.d.p??-Infinity)-(a.d.p??-Infinity):sort==="coverage"?coverage(b.d)-coverage(a.d):(b.d.t||0)-(a.d.t||0));
 return rows;
}
function table(){
 const rows=selectedRows(),pages=Math.max(1,Math.ceil(rows.length/pageSize));filterPage=Math.min(filterPage,pages);const start=(filterPage-1)*pageSize;
 $("tableCount").textContent="("+num(rows.length)+")";
 $("chainRows").innerHTML=rows.slice(start,start+pageSize).map(({d,i},j)=>{
  const p=coverage(d),c=d.con||"Chưa ghi nhận",css=/PoW/i.test(c)?"amber":/PoS|Rollup|L2/i.test(c)?"green":"muted";
  const s=(d.vsic||[]).slice(0,5).map(code=>`<span class="sector-badge" title="${E(VSIC[code])}">${E(code)}</span>`).join("")||"—";
  return `<tr><td>${start+j+1}</td><td><button type="button" class="chain-cell" data-open="${i}"><span class="avatar">${E(d.s&&d.s!=="—"?d.s.slice(0,2):d.n.slice(0,2))}</span><span>${E(d.n)}<span class="ticker" style="display:block">${E(d.s)}</span></span></button></td><td>${money(d.p)}</td><td>${num(d.t)}</td><td><span class="tag ${css}" title="${E(c)}">${E(c)}</span></td><td><span class="tag muted" title="${E(d.iso)}">${E(d.iso)}</span></td><td>${s}</td><td><span class="cover"><span class="cover-track"><i style="width:${p/24*100}%"></i></span>${p}/24</span></td><td><input aria-label="Chọn ${E(d.n)} để so sánh" class="compare-check" type="checkbox" data-select="${i}" ${selected.has(i)?"checked":""}></td></tr>`;
 }).join("")||'<tr><td colspan="9" class="empty-state">Không có kết quả phù hợp.</td></tr>';
 $("pageInfo").textContent=rows.length?"Hiển thị "+num(start+1)+"–"+num(Math.min(rows.length,start+pageSize))+" / "+num(rows.length):"0 kết quả";
 const controls=[],button=(label,page,disabled,isCurrent)=>`<button ${disabled?"disabled":""} ${isCurrent?'class="current"':""} data-page="${page}" type="button">${label}</button>`;
 controls.push(button("‹",filterPage-1,filterPage===1,false));
 let low=Math.max(1,filterPage-2),hi=Math.min(pages,low+4);low=Math.max(1,hi-4);
 for(let p=low;p<=hi;p++)controls.push(button(p,p,false,p===filterPage));
 controls.push(button("›",filterPage+1,filterPage===pages,false));
 $("pageButtons").innerHTML=controls.join("");
 $("pageButtons").querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{filterPage=Number(b.dataset.page);table();$("thumuc").scrollIntoView({block:"start",behavior:"smooth"})});
}
function counts(){$("compCount").textContent=selected.size;$("compareButtonCount").textContent=selected.size}
function maybeLink(obj){const u=obj?.url||"";return /^https:\/\/[a-z0-9.-]+(?:\/|$)/i.test(u)?u:""}
function fieldHTML(def,obj){
 const present=Boolean(obj?.value),u=maybeLink(obj),kind=obj?.origin||"";
 const kindText=kind==="local"?"Bổ sung cá nhân":kind==="reference"?"Tham chiếu biên tập":kind==="original"?"Dữ liệu HTML gốc":"Chưa có dữ liệu";
 const originClass=kind==="local"?"local":kind==="original"?"original":present?"":"empty";
 return `<div class="field"><div class="field-header"><label title="${E(def.help)}"><span class="num">${String(FIELDS.indexOf(def)+1).padStart(2,"0")}</span>${E(def.label)}</label><span class="field-tag ${originClass}">${kindText}</span></div><div class="field-value ${present?"":"missing"}">${present?E(obj.value):"Chưa có dữ liệu / cần kiểm chứng"}</div><div class="field-meta"><span>${E(def.help)}</span>${u?`<a href="${E(u)}" target="_blank" rel="noopener noreferrer">↗ Nguồn</a>`:""}<button class="edit-field" type="button" data-edit="${E(def.key)}">✎ Sửa</button></div></div>`;
}
function openModal(i){
 const d=D[i];if(!d)return;
 lastFocus=document.activeElement;currentModal=i;const vals=fields(d),progress=coverage(d),old=DETAIL[d.n]||{};
 $("modalHeadline").innerHTML=`<div class="modal-title-wrap"><span class="avatar">${E(d.s&&d.s!=="—"?d.s.slice(0,2):d.n.slice(0,2))}</span><div><h2 id="modalTitle">${E(d.n)}</h2><p>${E(d.s)} · ${E(d.iso)} · Hồ sơ ${progress}/24 tiêu chí</p></div></div>`;
 const metric=[["Số token (nguồn cũ)",num(d.t)],["Giá snapshot",money(d.p)],["Độ đầy đủ",progress+"/24"],["Ngành VSIC",(d.vsic||[]).length+" ngành"]];
 let html=`<div class="modal-strip">${metric.map(([k,v])=>`<div class="modal-metric"><small>${E(k)}</small><strong>${E(v)}</strong></div>`).join("")}</div><div class="modal-intro"><b>Trạng thái dữ liệu:</b> Bản ghi tĩnh ngày 16/10/2026, không phải dữ liệu thời gian thực. Các giá trị kế thừa nguồn HTML gốc và tham chiếu bổ sung cần được đối chiếu với nguồn chính thức. Hồ sơ ${progress}/24 biểu thị số trường đã được điền, không phải điểm tin cậy.</div>`;
 if(old.overview)html+=`<div class="modal-summary"><b>Tổng quan theo tệp HTML gốc</b><div>${E(old.overview)}</div>${old.history?`<p><b>Lịch sử theo nguồn cũ:</b> ${E(old.history)}</p>`:""}</div>`;
 html+=`<div class="modal-actions"><button class="btn ghost" type="button" data-export-chain="1">↓ Xuất hồ sơ JSON</button><span class="badge-note">✎ Hiệu chỉnh lưu cục bộ trên trình duyệt; không ghi vào GitHub.</span></div>`;
 html+=`<nav class="modal-tabs" aria-label="Mục lục checklist">${GROUPS.map((g,j)=>`<a href="#group-${g.id}" data-jump="group-${g.id}">${j+1}. ${E(g.title.split("· ")[1])}</a>`).join("")}</nav>`;
 for(const g of GROUPS){
  const filled=g.fields.filter(f=>vals[f[0]]?.value).length;
  html+=`<section class="group-section" id="group-${g.id}"><div class="group-heading"><h3>${E(g.title)}</h3><span>${filled}/${g.fields.length} mục</span></div><div class="fields">${g.fields.map(f=>fieldHTML(FIELDS.find(x=>x.key===f[0]),vals[f[0]])).join("")}</div></section>`;
 }
 $("modalContent").innerHTML=html;$("modalContent").scrollTop=0;$("modalOverlay").classList.add("open");$("modalOverlay").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";$("modalClose").focus();
}
function closeModal(){if(!$("modalOverlay").classList.contains("open"))return;$("modalOverlay").classList.remove("open");$("modalOverlay").setAttribute("aria-hidden","true");currentModal=-1;document.body.style.overflow="";lastFocus?.focus?.()}
function openCompare(){
 lastFocus=document.activeElement;const ids=[...selected],fieldsArr=ids.map(i=>fields(D[i]));
 $("compareContent").innerHTML=ids.length<2?'<div class="empty-state"><h3>Chọn từ 2 đến 3 blockchain để so sánh</h3><p>Đánh dấu ô ở cột “So sánh” trong danh mục, sau đó nhấn nút So sánh.</p></div>':`<div class="modal-intro">Bảng đối chiếu 24 tiêu chí, dùng dữ liệu nguồn tĩnh và hiệu chỉnh cục bộ nếu có. Không dùng điểm điền đủ để xếp hạng an toàn.</div><div class="comparison-scroll"><table class="comparison-table"><thead><tr><th>TIÊU CHÍ</th>${ids.map(i=>`<th>${E(D[i].n)}<br><small>${coverage(D[i])}/24</small></th>`).join("")}</tr></thead><tbody>${GROUPS.map(g=>`<tr><td colspan="${ids.length+1}"><b>${E(g.title)}</b></td></tr>${g.fields.map(f=>`<tr><td>${E(f[1])}</td>${fieldsArr.map(vals=>`<td>${E(vals[f[0]]?.value||"—")} ${maybeLink(vals[f[0]])?`<a href="${E(maybeLink(vals[f[0]]))}" target="_blank" rel="noopener noreferrer"> ↗</a>`:""}</td>`).join("")}</tr>`).join("")}`).join("")}</tbody></table></div>`;
 $("compareOverlay").classList.add("open");$("compareOverlay").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";$("compareClose").focus();
}
function closeCompare(){if(!$("compareOverlay").classList.contains("open"))return;$("compareOverlay").classList.remove("open");$("compareOverlay").setAttribute("aria-hidden","true");document.body.style.overflow="";lastFocus?.focus?.()}
function download(name,content,mime){
 const blob=new Blob([content],{type:mime+";charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportCSV(){
 const columns=["name","symbol","priceSnapshot","tokenCount","consensusSnapshot","isoSnapshot","vsicCodes",...FIELDS.map(x=>x.key)];
 const csv=[columns.join(",")];for(const {d} of selectedRows()){
  const vals=fields(d);const row=[d.n,d.s,d.p??"",d.t??"",d.con||"",d.iso||"",(d.vsic||[]).join("|"),...FIELDS.map(f=>vals[f.key]?.value||"")];
  csv.push(row.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(","));
 }
 download("chainscope-24-checklist.csv","\ufeff"+csv.join("\r\n"),"text/csv");
}
function exportJSON(){download("chainscope-snapshot.json",JSON.stringify({source:"Uploaded HTML snapshot dated 2026-10-16; unverified",categories:GROUPS,vsic:VSIC,chains:D,legacyDetails:DETAIL,editorialReferences:KNOWN,localOverrides:CHECKED},null,2),"application/json")}
stat();setup();table();counts();
})();
