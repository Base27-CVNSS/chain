# ChainScope 600 · Web3 Neon Dashboard

**Updated:** 2026-10-20 (UTC). This static GitHub Pages dashboard currently displays **600 catalog records**:
- 257 legacy blockchain/ecosystem records, preserved from the uploaded HTML snapshot dated 2026-10-16.
- 343 additional EVM network records selected from the public [ChainList network registry](https://chainlist.org/rpcs.json). Mainnet/testnet filtering, canonical name deduplication, and unique EIP-155 chain IDs are applied.
- Selection is intentionally **capped at 600** for browsing. It is **not a claim that exactly 600 active blockchains exist worldwide**. The registry contains substantially more candidates, including L2, sidechains, and smaller EVM networks. Listing does not verify uptime, decentralization, token market value, or mainnet operation.
- Non-EVM chains remain in the original 257 records. Market-price fields for new registry entries are intentionally blank rather than fabricated.

## New Web3 UI

Deep violet, electric cyan, mint-neon, and indigo glass styling with mobile responsive layouts, animated hover illumination, gradient hero, and charts. Every chain row has a distinctive visual identity:
- **Actual chain artwork** is used when a unique chain name/slug matches an asset in [DefiLlama/icons](https://github.com/DefiLlama/icons/tree/v2/assets/chains), selected from an index of 865 PNG/JPEG/WEBP assets.
- When no official/third-party hosted logo match can be established or an image fails to load, the UI displays a **unique branded-looking deterministic monogram**. That fallback is **not claimed to be an official chain logo**. Do not interpret this as 600 verified official brand logos.
- Logo paths reference the upstream repository and require a browser network connection. All fallback avatars work without it.

## Features

- 600-row chain directory with search, consensus/permission/VSIC filters, sorting and 30-row pagination.
- Per-chain popup exposes **all 24 checklist criteria**, grouped into 5 categories.
- Technical provenance for imported records: **Chain ID**, official website listed by registry, block explorer, architecture classification when derivable; no invented TPS, validators, capitalization, supply, fees, or founder names.
- Full CSV and JSON export, up to 3 blockchain comparison, local-only field corrections.
- Legacy trend charts retain their original scope. Missing token counts for new chains are not interpreted as zero tokens.

## Data architecture

```
index.html                       Static UI shell
styles.css, neon.css              Layout and Web3 neon design
data.js                           Legacy 257 records; historical
registry-core.js                  Canonical identity, filtering, deduplication, 600 cap
registry-snapshot.js              Generated static 343-record addendum (GitHub Actions)
registry-loader.js                Immediate static load; online ChainList fallback if missing
chain-logos.js                    865 original filename entries from DefiLlama/icons
chain-icons.js                    Verified asset matching + nonofficial monogram fallback
app.js                            Charts, table, search, checklist, compare, export
scripts/update-chains.cjs         Reproducible Node 22 snapshot generator
.github/workflows/update-registry.yml  Weekly registry refresh + commit
.github/workflows/pages.yml       GitHub Pages deployment
```

**Update registry:** run `node scripts/update-chains.cjs` on Node 22+, then commit `registry-snapshot.js`. GitHub Actions also refreshes the snapshot weekly (Monday) and on relevant source-code changes; requires Actions write permission. The source list is `https://chainlist.org/rpcs.json` (records include `isTestnet`, `nativeCurrency`, `chainId`, and where available explorers/infoURL and metadata). The generator validates count **550–650** and rejects duplicate EIP-155 chain IDs. If the API is unavailable and no snapshot is bundled, the site honestly falls back to 257 historical records.

**Local:** use `python -m http.server 8080`, then open `http://localhost:8080`. For website publishing, choose **Settings → Pages → Source: GitHub Actions**.

## Interpreting this dashboard

- **24-field completion count is not a trust, safety, or investment rating.**
- **Price, market capitalization, TVL and token counts are not live** unless specifically marked and sourced. Legacy figures are snapshots from user-supplied material.
- ISO 22739 is a terminology standard; class labels on the page **do not constitute ISO certification**.
- VSIC sector tags mean proposed/recorded industry associations, not proof of deployed and audited applications.
- ChainList lists EVM networks, not every L1 or non-EVM ecosystem. Mainnet filtering is a heuristic; verify ambiguous networks independently via explorer, official docs, and activity before making claims.
- No wallet connection or trading transaction is performed. No investment advice.

Sources: [ethereum-lists/chains](https://github.com/ethereum-lists/chains), [DefiLlama/chainlist](https://github.com/DefiLlama/chainlist), [DefiLlama/icons](https://github.com/DefiLlama/icons).

© 2026 Base27-CVNSS.
