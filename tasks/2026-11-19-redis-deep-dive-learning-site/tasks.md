---
type: tasks
system: agent-system-v2
status: active
updated: 2026-11-19
project: redis-deep-dive
module: learning-site
task_id: 20261119-m-c-i-plan-c-c-th
---

# Tasks - 20261119-m-c-i-plan-c-c-th

## Giai đoạn lập kế hoạch
- [x] Ghi quyết định routing R2, feature, `task-intake`, single-agent trong `routing.md`.
- [x] Ghi context, source provenance và scope lock cụ thể trong `context-package.md`.
- [x] Ghi yêu cầu, acceptance criteria và catalog đủ 11 chương/61 bài trong `requirement.md`.
- [x] Ghi implementation/verification plan và approval gate trong `plan.md`.
- [x] Đồng bộ allowed/forbidden scope trong `plan.md` và `context-package.md`.
- [x] Đặt lifecycle ở `WAITING_APPROVAL` và giữ `approval_state: open`.

## Triển khai đã được duyệt
- [x] Kiểm tra lại file tree, Git status và Node/npm; không có source mới ngoài task pack. Node `22.23.4`, npm `10.9.9`; Docker Desktop đã được khởi động để chạy container.
- [x] Tạo app React + TypeScript + Vite; đóng gói Nginx/Docker Compose và launcher `.bat` mở/dừng web.
- [x] Tạo catalog 11 chương/61 bài; số đếm hiển thị trên UI là `61`.
- [x] Dựng layout với header, sidebar, canvas trung tâm, ghi chú, timeline/tiến độ; responsive có thanh điều hướng mobile.
- [x] Tạo SVG 2D với node, đường nối, packet/pulse, trạng thái theo step và bộ điều khiển bước cho GET/SET, TTL, Cache Stampede.
- [ ] REA đối chiếu tham khảo/artifact: endpoint CDP `127.0.0.1:9222` không khả dụng; capture browser local kết thúc `execution_failure`/`cleanup_incomplete`. Không có bằng chứng REA hợp lệ.
- [x] Tạo brief cho 58 bài còn lại và MVP cho Luyện tập, Phòng thiết kế, Tóm tắt.
- [x] Lưu bài đang học và danh sách hoàn thành trong `localStorage`.
- [x] `npm run build` PASS; `docker compose config` PASS; `docker compose up -d --build` PASS; container báo `healthy`; HTTP `http://localhost:4173/` trả `200`.
- [x] Mở app trong Vivaldi; accessibility tree cho thấy 11 chương/61 bài, 4 tab điều hướng và mô phỏng SVG. Quan sát desktop và viewport responsive hẹp 395px; không chạy unit test.
- [ ] Chưa xác nhận toàn bộ next/previous/replay, chuyển lesson, lưu rồi reload, và tràn ngang qua thao tác UI; để `#test` kiểm tra tiếp.
- [x] Ghi evidence, giới hạn REA, dependency risk, container state và next action tại đây cùng `index.md`.

## Evidence and Residual Risks
- Vite production build: pass; đường dẫn repo có ký tự `#`, Vite in cảnh báo nhưng build thành công.
- Docker Compose config/build/up: pass; container healthy, publish loopback `127.0.0.1:4173`. Không có Redis service.
- Browser: trang mang title `Redis Deep Dive · Learning Lab`, HTTP 200; UI hiển thị 61 bài, 11 chương và các mode. Quan sát layout desktop và mobile-width 395px trong Vivaldi.
- REA: `list_browser_targets` không kết nối được endpoint tham khảo. `capture_browser_scenario` không tạo được Evidence và provider báo cleanup chưa xác nhận; không tiếp tục gọi lại.
- Npm install/audit summary báo 2 vulnerabilities: 1 moderate, 1 high. Chưa chạy `npm audit` chi tiết hoặc nâng version.
- Còn chờ thao tác UI chi tiết và kiểm tra persistence qua reload; chưa có unit test theo yêu cầu scope.
- Container đang chạy: `redis-deep-dive-learning-site` tại `http://localhost:4173`.

## Follow-up: Full Lesson Knowledge (2026-11-19)

- [x] Mở rộng scope theo chỉ đạo trực tiếp của người dùng: nội dung kiến thức cho toàn bộ 61 bài, thay brief chung ở 58 bài ngoài ba mô phỏng.
- [x] Thêm bài giảng riêng từng lesson gồm overview, giải thích cơ chế, áp dụng, ví dụ, điểm nhớ và câu tự kiểm tra có đáp án.
- [x] Hiển thị nội dung lesson ngay sau tiêu đề, trước sơ đồ; panel ghi chú lấy nội dung đúng bài thay cho các nguyên tắc lặp chung.
- [x] Giữ lại ba mô phỏng SVG tương tác GET/SET lifecycle, TTL/expiration và Cache Stampede; nội dung bài giảng đi kèm mô phỏng.
- [x] Coverage check bằng cách nạp module: 61 entries, 61 ID duy nhất, không thiếu ID theo catalog.
- [x] `npm run build`: PASS sau thay đổi; TypeScript và Vite production build thành công. Vite tiếp tục cảnh báo ký tự `#` trong đường dẫn `D:/C#/redis`.
- [ ] Không điều khiển browser/màn hình hoặc chụp lại UI trong follow-up này theo yêu cầu người dùng; bố cục nội dung đã được thêm bằng CSS responsive nhưng chưa được quan sát trực tiếp sau thay đổi.
- [x] Không chạy unit test. Không thêm backend, Redis service, hosting hoặc dependency.

### Handoff after content expansion

- Người dùng phản hồi rằng bài 01 không trình bày lịch sử Redis và yêu cầu kiến thức phải đầy đủ ở các bài khác. Lesson `foundation-1` hiện nói Redis ra đời năm 2009 như công cụ nội bộ của Salvatore Sanfilippo để giúp startup mở rộng, cùng lý do chọn cấu trúc trong bộ nhớ; tài liệu được liên kết tới bài viết chính thức Redis.
- Nội dung được đóng gói trong ứng dụng; link tài liệu ngoài chỉ là tài liệu tham khảo tùy chọn, không cần mạng để học phần cốt lõi.
- REA và kiểm tra browser của lượt triển khai ban đầu vẫn có giới hạn như ghi ở trên. Lượt mở rộng không dùng screen control theo chỉ đạo mới.

## Follow-up: Readability (2026-11-19)
- [x] Tăng cỡ chữ cho nội dung bài, menu chương/bài, ghi chú, timeline và nhãn sơ đồ; có điều chỉnh riêng cho viewport hẹp.
- [x] `npm run build`: PASS sau chỉnh CSS; cảnh báo Vite về ký tự `#` trong đường dẫn tiếp tục xuất hiện.
- [ ] Không quan sát trực tiếp browser sau thay đổi vì người dùng yêu cầu không dùng screen control.
