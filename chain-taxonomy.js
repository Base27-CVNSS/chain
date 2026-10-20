/* ChainScope taxonomy: EVM-compatible is NOT synonymous with an Ethereum fork. */
(function(root){
"use strict";
const key=s=>String(s||"").normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const aka={"binance smart chain":"bnb smart chain","ethereum mainnet":"ethereum","polygon mainnet":"polygon","op mainnet":"optimism","arbitrum one":"arbitrum","avalanche c chain":"avalanche","zksync era":"zksync","fantom opera":"fantom","near":"near protocol","hedera hashgraph":"hedera","the open network":"ton"};
const canon=s=>aka[key(s)]||key(s);
const urls={
 chainlist:"https://chainlist.org/rpcs.json",evm:"https://ethereum.org/en/developers/docs/evm/",
 sidechain:"https://ethereum.org/en/developers/docs/scaling/sidechains/",
 solana:"https://solana.com/docs/core/programs",
 cardano:"https://docs.cardano.org/developer-resources/smart-contracts/plutus",
 zcash:"https://zcash.github.io/zcash/design.html",
 etc:"https://www.ethereumclassic.org/knowledge/history/",
 dogecoin:"https://github.com/dogecoin/dogecoin",
 btc:"https://developer.bitcoin.org/devguide/",
 opstack:"https://docs.optimism.io/stack/getting-started",
 stellar:"https://developers.stellar.org/docs/build/smart-contracts"
};
const EVM=new Set("Ethereum|BNB Smart Chain|Base|Polygon|Arbitrum|Avalanche|Fantom|Cronos|Chiliz|Pulsechain|Sonic|Kaia|zkSync|Harmony|Blast Token|Berachain|Linea|Metis|Monad|Optimism|Celo|Gnosis|Moonriver|Moonbeam|Aurora|ZetaChain|Zilliqa|Rootstock|smartBCH|Ethereum Classic|Scroll|Mantle|Manta Network|Shibarium|Astar|Kava|Evmos|Fuse|Wanchain|Oasis Network|Canto|Telos|Worldchain|opBNB|Ronin|Plasma|Flare Network|Neon|X Layer|XDC Network|Soneium|Sei-v2|Sei|Vechain|Viction|Gravity|ThunderCore|Ubiq|WEMIX|Conflux|HyperEVM|KardiaChain|Meter|BitTorrent Token|Velas|Oasys|Lukso|Syscoin|Degen (Base)|Etherlink|BOB|Citrea|Core DAO|Ink|Frax|Apechain|Blast|Abstract|Taiko|Polygon zkEVM|SKALE|Hedera".split("|").map(canon));
const nativeRows=[
["Solana","SVM / sBPF programs",urls.solana],["Cardano","Plutus / eUTXO",urls.cardano],["Algorand","AVM / TEAL","https://dev.algorand.co/concepts/smart-contracts/avm/"],
["Aptos","Move VM","https://aptos.dev/"],["Sui","Move / object-centric","https://docs.sui.io/"],
["NEAR","WASM / NEAR runtime","https://docs.near.org/smart-contracts/what-is"],
["TON","TVM","https://docs.ton.org/"],["Tron","TVM / Solidity","https://developers.tron.network/docs/virtual-machine-introduction"],
["Tezos","Michelson","https://docs.tezos.com/smart-contracts"],["Stellar","Soroban / WASM",urls.stellar],
["Internet Computer","WASM canisters","https://internetcomputer.org/docs"],["EOS","WASM / Antelope","https://docs.antelope.io/"],["WAX","WASM / Antelope","https://docs.antelope.io/"],
["MultiversX","WASM","https://docs.multiversx.com/"],["Waves","Ride","https://docs.waves.tech/"],["NEO","NeoVM","https://developers.neo.org/"],
["FLOW","Cadence","https://developers.flow.com/cadence"],["Secret","CosmWasm","https://docs.scrt.network/"],
["Injective Protocol","CosmWasm","https://docs.injective.network/"],["Osmosis","CosmWasm","https://docs.osmosis.zone/"],
["Juno Network","CosmWasm","https://docs.junonetwork.io/"],["Terra","CosmWasm","https://docs.terra.money/"],
["Polkadot","REVM/PVM trên Polkadot Hub; relay chain không chạy hợp đồng trực tiếp","https://docs.polkadot.com/smart-contracts/overview/"],
["ICON","SCORE","https://docs.icon.community/"],["Ontology","NeoVM / WASM","https://docs.ont.io/"],
["Radix","Scrypto","https://docs.radixdlt.com/"],["Chia","Chialisp","https://docs.chia.net/chialisp-intro/"],
["Stacks Blockchain","Clarity","https://docs.stacks.co/"],["Alephium","Ralph","https://docs.alephium.org/"],
["ERGO","ErgoScript","https://docs.ergoplatform.com/"],["Theta Network","Theta EVM","https://docs.thetatoken.org/"],
["Hyperliquid","HyperEVM (phân hệ riêng)","https://hyperliquid.gitbook.io/hyperliquid-docs/"],
["Hedera","Hedera Smart Contract Service (EVM)","https://docs.hedera.com/hedera/core-concepts/smart-contracts"]
];
const NATIVE=Object.fromEntries(nativeRows.map(r=>[canon(r[0]),{runtime:r[1],url:r[2]}]));
const limitedRows=[["Bitcoin","Bitcoin Script; không phải VM hợp đồng đa dụng",urls.btc],["Bitcoin Cash","Script / covenant giới hạn","https://bitcoincash.org/"],["Dogecoin","Bitcoin-derived Script; không phải VM tổng quát",urls.dogecoin],["Litecoin","Bitcoin-derived Script","https://litecoin.org/"],["Zcash","Shielded transfers và script hạn chế; không có VM hợp đồng tổng quát",urls.zcash],["Kaspa","Cần xác minh phiên bản thực thi hợp đồng","https://kaspa.org/"]];
const LIMITED=Object.fromEntries(limitedRows.map(r=>[canon(r[0]),{runtime:r[1],url:r[2]}]));
const forkRows=[
["Bitcoin Cash","Bitcoin","history","Chia tách trạng thái và lịch sử chuỗi BTC năm 2017","https://www.govinfo.gov/content/pkg/FR-2024-01-12/html/2024-00507.htm"],
["Ethereum Classic","Ethereum / DAO 2016","history","ETC tiếp tục chuỗi nguyên thủy; ETH là nhánh hard fork sau DAO, không nói ETC fork từ ETH mới.",urls.etc],
["Zcash","Bitcoin Core 0.11.2","code","Fork mã nguồn Bitcoin Core; không kế thừa UTXO Bitcoin.",urls.zcash],
["BNB Smart Chain","go-ethereum (Geth)","code","BSC execution client được phát triển từ nhánh mã nguồn go-ethereum; mainnet BSC không kế thừa trạng thái Ethereum.","https://github.com/bnb-chain/bsc-builder"],
["Polygon","go-ethereum (Geth) / Bor","code","Bor là execution client của Polygon PoS có nguồn gốc mã nguồn Geth; không phải fork lịch sử trạng thái ETH.","https://github.com/0xPolygon/bor"],

["Dogecoin","Bitcoin Core + các dự án Scrypt","code","Nguồn Dogecoin Core mô tả phái sinh từ Bitcoin Core và các cryptocurrency khác.",urls.dogecoin],
["Litecoin","Bitcoin Core","code","Dòng mã phái sinh Bitcoin, genesis độc lập.","https://github.com/litecoin-project/litecoin"],
["Bitcoin SV","Bitcoin Cash","history","Tách nhánh Bitcoin Cash trong năm 2018.","https://bitcoinsv.com/"],
["eCash","Bitcoin Cash","history","Bitcoin Cash ABC / eCash từ phân nhánh năm 2020.","https://e.cash/"],
["Bitcoin Gold","Bitcoin","history","Phân nhánh lịch sử Bitcoin năm 2017.","https://bitcoingold.org/"]
];
const FORKS=Object.fromEntries(forkRows.map(r=>[canon(r[0]),{from:r[1],type:r[2],detail:r[3],source:r[4],status:"verified"}]));
const stackRows=[
["Base","Ethereum / OP Stack",urls.opstack],["Optimism","Ethereum / OP Stack",urls.opstack],
["Arbitrum","Ethereum / Nitro","https://docs.arbitrum.io/"],["zkSync","Ethereum / ZK Stack","https://docs.zksync.io/"],
["Scroll","Ethereum / zkEVM","https://docs.scroll.io/"],["Linea","Ethereum / zkEVM","https://docs.linea.build/"],
["Polygon","Ethereum / sidechain",urls.sidechain],["Celo","Ethereum / OP Stack L2",urls.opstack],
["Blast","Ethereum / OP Stack",urls.opstack],["Mode","Ethereum / OP Stack",urls.opstack],
["Mantle","Ethereum / modular L2","https://docs.mantle.xyz/"]
];
const STACK=Object.fromEntries(stackRows.map(r=>[canon(r[0]),{from:r[1],source:r[2]}]));
function classify(d){
 const n=canon(d.n),isRegistry=!!(d.registrySource||d.origin==="registry");
 const legacyEvm=EVM.has(n)||/^(Ethereum|Bitcoin) L2/.test(d.con||"");
 let smart="unknown",evm="unknown",runtime="Chưa xác minh",source="",basis="Chưa có nguồn xác nhận.";
 if(isRegistry||legacyEvm){smart="yes";evm="yes";runtime="EVM / EIP-155";source=isRegistry?urls.chainlist:urls.evm;
 basis=isRegistry?"Có trong ChainList EVM; chưa kiểm thử RPC hoặc deploy hợp đồng.":"Đối chiếu kiến trúc biên tập, chưa kiểm thử runtime.";}
 if(NATIVE[n]){smart="yes";evm=n==="hedera"||n==="theta network"||n==="polkadot"?"yes":"no";runtime=NATIVE[n].runtime;source=NATIVE[n].url;basis=n==="polkadot"?"EVM chỉ ở Polkadot Hub, không phải relay chain.":"Tham chiếu tài liệu runtime kỹ thuật."; }
 if(LIMITED[n]){smart="limited";evm="no";runtime=LIMITED[n].runtime;source=LIMITED[n].url;basis="Không đánh đồng script hạn chế với smart contract đa dụng.";}
 if(n==="ethereum"){smart="yes";evm="yes";runtime="EVM / Solidity";source=urls.evm;basis="Ethereum L1."}
 return {smart,evm,runtime,source,basis,
 fork:FORKS[n]||{status:"unknown",from:"",type:"",detail:"Chưa có bằng chứng trong danh mục; không mặc nhiên kết luận không có fork.",source:""},
 stack:STACK[n]||null};
}
function summary(data){
 const classes=(data||[]).map(classify),count=fn=>classes.filter(fn).length;
 return {total:classes.length,smartYes:count(x=>x.smart==="yes"),smartLimited:count(x=>x.smart==="limited"),smartEcosystem:count(x=>x.smart==="ecosystem"),smartUnknown:count(x=>x.smart==="unknown"),evmYes:count(x=>x.evm==="yes"),evmNo:count(x=>x.evm==="no"),evmUnknown:count(x=>x.evm==="unknown"),forkDocumented:count(x=>x.fork.status==="verified")};
}
root.ChainTaxonomy={classify,summary,canon,urls};
})(typeof window!=="undefined"?window:globalThis);
