# ChainScope — Blockchain Intelligence Dashboard

Giao diện phân tích blockchain bằng tiếng Việt, chạy tĩnh trên GitHub Pages. Được phát triển từ tệp HTML mẫu do người dùng cung cấp, dựa trên **257 dòng blockchain/chain-ecosystem**, 21 ngành VSIC 2018 và 24 tiêu chí kiểm tra thuộc 5 nhóm.

## Tính năng

- Tổng quan: số chain, tổng *token count* trong dữ liệu gốc, mức phủ ngành và phân bổ theo mô hình đồng thuận/permission.
- Tìm kiếm tên/ticker; lọc consensus, ISO (mô hình truy cập), VSIC; sắp xếp giá snapshot, số token, tên hoặc độ đầy đủ.
- Popup có **toàn bộ 24 trường cho mọi chain**, gồm số thứ tự, diễn giải, giá trị, tình trạng dữ liệu, liên kết tham khảo khi có.
- So sánh tối đa 3 chain bằng ma trận 24 tiêu chí.
- Xuất CSV các bản ghi đang lọc, xuất JSON dữ liệu toàn bộ, hoặc JSON hồ sơ đang mở.
- Bổ sung thủ công dữ liệu từng trường; lưu cục bộ trong `localStorage` (không upload hoặc sửa GitHub), có thể xuất JSON.
- Responsive mobile/tablet/desktop; điều khiển đóng popup bằng Escape/nhấp nền.

## 24 tiêu chí

1–6: Founders, launch year, whitepaper, official website, docs, GitHub/source code.

7–11: Consensus, architecture, security, decentralization, validator control.

12–17: Native coin/token, total supply, circulating supply, market cap, gas fee, wallet count.

18–20: dApps/use cases, community, explorer.

21–24: TPS/block time, finality, pros, cons.

## Nguồn và trạng thái chứng cứ

**Dữ liệu nhập:** `data.js` được trích xuất nguyên từ tệp HTML gốc (bản ghi ngày **16/10/2026**) gồm `VSIC_SECTORS`, `CHAIN_DETAILS`, `DATA`. Không kết nối API thị trường. Giá, thay đổi giá, market cap và số token là số liệu lịch sử; không dùng như dữ liệu đầu tư cập nhật. Tổng token trong bảng KPI được **tính lại từ các bản ghi** thay vì dùng con số badge gắn cứng trong bản gốc.

**Tham chiếu biên tập:** `KNOWN` trong `app.js`, chỉ dành cho một số chain nổi bật. Links website/docs/repo/explorer là các đường dẫn cần được kiểm tra định kỳ. Năm, kiến trúc, nhận định pros/cons là dữ liệu tham khảo, **không phải xác minh độc lập hoặc audit**.

**Bổ sung cá nhân:** giá trị lưu trên trình duyệt, chỉ hiển thị cục bộ, không đồng bộ hay được chứng thực. Từng trường hiển thị provenance của mình.

**Thiếu dữ liệu:** hiển thị “Chưa có dữ liệu / cần kiểm chứng”, không suy đoán số ví, TPS, cung lưu hành, gas, finality hoặc địa chỉ chính thức khi nguồn không có. “Độ đầy đủ X/24” chỉ đo số trường có giá trị, không đo chất lượng dự án.

**Lưu ý chuẩn:** ISO 22739:2020 là tiêu chuẩn về thuật ngữ blockchain/DLT; nhãn public/permissionless/permissioned trong dữ liệu này là một phép phân loại **tham khảo**, không phải một chứng nhận ISO. VSIC thể hiện gán ngành dự kiến/được người biên soạn liên hệ, không mặc nhiên chứng minh dApp hoạt động trong ngành đó. `DATA` cũng có thể gồm L2, giao thức và token được mô tả như chain; cần rà soát thực thể trước khi thống kê ở quy mô nghiên cứu.

## Cấu trúc repo

```
index.html   # Layout, sidebar, charts, bảng và 2 popup
styles.css   # Responsive UI/UX
data.js      # Bản chụp dữ liệu đầu vào giữ nguyên từ HTML
app.js       # Tạo checklist, lọc/sort, so sánh, export, ghi chú cục bộ
README.md    # Phương pháp và hướng dẫn
```

## Khởi chạy

Mở `index.html` qua một local web server, ví dụ:

```sh
python -m http.server 8080
```

Truy cập `http://localhost:8080`. Để **triển khai tự động**, truy cập repo **Settings → Pages → Build and deployment → Source = GitHub Actions**. Workflow `.github/workflows/pages.yml` sẽ deploy mỗi lần cập nhật nhánh `main` sau khi Pages được bật. **Trạng thái ban đầu:** Pages chưa được bật, nên workflow sẽ báo `Get Pages site failed / Not Found` cho đến khi chủ repo thực hiện bước này. Trang chỉ là mã frontend tĩnh; không có backend/API tự động cập nhật hoặc crawler xác minh.

## Hướng nâng cấp dữ liệu

1. Tạo `chains_verified.json` chuẩn hóa `chainId`, `field`, `value`, `sourceUrl`, `observedAt`, `verifiedAt`, `confidence`; phân biệt mainnet/testnet/network/token.
2. Thu thập thị trường từ nhà cung cấp dữ liệu có giấy phép và có caching/rate limit; lưu lại timestamp, unit, công thức.
3. Thu thập consensus/validator/TPS/finality từ docs chính thức và block explorers, định nghĩa phương pháp so sánh.
4. Kiểm tra bảo mật/nhà cung cấp với bằng chứng audit, lưu chữ ký băm snapshot nếu cần đối chiếu lịch sử.
5. Bổ sung kiểm thử tích hợp cho 24 trường và quy trình review trước khi publish.

Không phải lời khuyên đầu tư.
