---
type: plan
system: agent-system-v2
status: active
updated: 2026-11-19
project: redis-deep-dive
module: learning-site
task_id: 20261119-m-c-i-plan-c-c-th
---

# Plan - 20261119-m-c-i-plan-c-c-th

## Scope Lock

Allowed files / symbols:
- Hiện tại chỉ tạo/sửa sáu artifact thuộc `tasks/2026-11-19-redis-deep-dive-learning-site/`.
- Sau approval, được thêm: `package.json`, `package-lock.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `.gitignore`, `README.md`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`, `scripts/Open-Redis-Learning.bat`, `scripts/Stop-Redis-Learning.bat`, `src/main.tsx`, `src/App.tsx`, `src/types.ts`, `src/data/curriculum.ts`, `src/data/lesson-content.ts`, `src/data/simulations.ts`, `src/components/**`, `src/styles.css`.

Forbidden files / symbols:
- Bất cứ path nào trong Obsidian Vault; mọi source path ngoài danh sách cho phép.
- Backend, database, Redis runtime/container, authentication, external API, cloud deployment, secrets/config máy. Docker chỉ được dùng để phục vụ frontend local.
- Tự mở rộng từ ba bài mẫu thành 61 giáo trình hoàn chỉnh mà không duyệt scope mới.

## Strategy

- Tạo SPA local-only bằng React + TypeScript + Vite, không backend; dùng CSS tùy chỉnh để bám tông nền tối nâu, viền kem, accent xanh/vàng/tím của ảnh tham khảo.
- Dùng multi-stage `Dockerfile`: Node build frontend thành static assets, Nginx phục vụ bản build. `docker-compose.yml` chỉ chạy web, bind `localhost:4173`, restart policy `unless-stopped`; không thêm Redis container.
- Tạo `scripts/Open-Redis-Learning.bat` để chạy `docker compose up -d` (build image nếu chưa có) rồi mở `http://localhost:4173`; tạo `scripts/Stop-Redis-Learning.bat` để dừng app. README ghi Docker Desktop là prerequisite và hướng xử lý khi Docker Engine chưa sẵn sàng.
- Người dùng giữ thư mục project và Docker Desktop; không cần mở editor, chạy npm hoặc nhập lệnh khi học. Nếu Docker Desktop được cấu hình tự khởi động cùng Windows, container có thể chạy lại sau khi Engine sẵn sàng; không tự đổi setting hệ thống.
- Mô hình nội dung: `curriculum.ts` chứa chương/bài và metadata; `lesson-content.ts` chứa brief/ghi chú cùng câu hỏi luyện tập; `simulations.ts` định nghĩa step/state cho ba bài mẫu.
- Dựng sơ đồ trung tâm bằng SVG 2D tương tác gồm node, edges, packet/flow và nhãn trạng thái lấy từ state của từng bước; không nhúng screenshot làm nền. GET/SET dùng Client/API/Redis/Database, TTL biểu diễn key cùng countdown, Cache Stampede thể hiện nhiều request dồn về Database.
- Mô hình UI desktop có header, sidebar trái, stage mô phỏng trung tâm, note panel bên phải và timeline/progress dưới. Mobile chuyển sidebar/panel thành vùng thu gọn và xếp dọc.
- Các chức năng MVP: Học (catalog và mô phỏng), Luyện tập (quiz theo ba bài mẫu), Phòng thiết kế (canvas cố định Client/API/Redis/Database với hit/miss/TTL), Tóm tắt (tiến độ và checklist).
- Ghi bài đang chọn và danh sách bài hoàn thành vào `localStorage`; không đồng bộ ra ngoài.
- Dùng đúng 11 chương và **61 bài** tính theo số lượng đã nêu ở từng chương. Nhãn 56 không khớp tổng; catalog lấy mục chi tiết làm chuẩn.
- Nội dung chỉ viết đầy đủ cho ba bài mô phỏng đầu; 58 bài khác có title, chapter, learning objective/brief ngắn, chưa phải giáo trình hoàn chỉnh.

## Step-by-Step Plan

1. Đọc task pack theo thứ tự trong `index.md`; dùng REA (`mcp__rea`) để kiểm tra trang/artifact tham chiếu nếu công cụ hỗ trợ URL này, ghi nhận bố cục 2D cần tái tạo. Nếu ảnh không được chuyển sang conversation mới, xin người dùng gửi lại ảnh rõ hơn. Sau đó kiểm tra lại `D:\C#\redis`, trạng thái Git, Node/npm và các file scope; nếu xuất hiện file mới hoặc project existing thì dừng ghi và cập nhật context/approval.
2. Khởi tạo React + TypeScript + Vite trong repo root; tạo README, multi-stage Dockerfile, Nginx config, Compose service cho web và launcher mở/dừng; cài dependency tối thiểu cần thiết cho app.
3. Tạo type/model và catalog 11 chương, 61 bài. Kiểm tra tổng số bằng cách cộng từng chương: `5+5+7+5+7+5+5+5+6+6+5 = 61`.
4. Dựng shell giao diện desktop theo ảnh: header và 4 khu vực điều hướng; sidebar chương/bài có trạng thái; trung tâm bài học; panel kiến thức; timeline; progress.
5. Tạo simulation step engine dùng state dữ liệu cục bộ, với prev/next/replay/pause và cảnh báo số liệu minh họa. Hoàn thiện ba bài: request GET/SET, TTL lifecycle, Cache Stampede.
6. Thêm lesson brief cho 58 bài còn lại; làm quiz theo ba bài mẫu, canvas thiết kế MVP và trang tóm tắt tiến độ.
7. Thêm lưu/đọc `localStorage` có khởi tạo an toàn khi chưa có dữ liệu; bảo đảm chọn bài và trạng thái bài học rõ ràng.
8. Hoàn thiện responsive layout, keyboard affordances nếu phù hợp; so giao diện với ảnh tham khảo.
9. Xác minh `npm run build`, `docker compose config`, build/chạy Docker image; mở browser qua launcher ở desktop và viewport hẹp để kiểm tra layout, đổi chương/bài, bước mô phỏng và tiến độ lưu/reload. Không thêm/chạy unit test nếu chưa được yêu cầu.
10. Ghi kết quả build/browser, file diff và rủi ro còn lại vào task pack; dừng và báo người dùng trước mọi yêu cầu mở rộng scope.

## Verification Plan

- Trước code: kiểm tra lại tree và dependency toolchain; đây là điều kiện freshness vì thư mục đang trống.
- Sau code: `npm run build`, `docker compose config` phải exit code 0; Docker image build/run thành công.
- Browser: chạy launcher mở app tại `http://localhost:4173`; xác nhận sidebar có 11 chương/61 bài, bài chọn đổi đúng nội dung, 3 mô phỏng tiến/lùi/replay/pause, 4 mode không phải link chết, progress persist sau reload.
- Responsive: kiểm tra desktop theo screenshot và viewport hẹp; xác nhận nội dung không tràn ngang và panel vẫn truy cập được.
- Không chạy unit test trong milestone khi user chưa yêu cầu. Build/container/browser smoke được ghi riêng, không gọi đó là unit test.

## Risks / Rollback

- Rủi ro chính: chênh lệch `56` và tổng chi tiết `61`; plan dùng 61 theo tổng chi tiết từng chương và scope đã được duyệt.
- Ba simulation là mô hình minh họa, không có Redis runtime; ghi rõ mọi thời gian/giá trị giả lập.
- `localStorage` chỉ lưu tiến độ trong browser hiện tại; không có sync đa thiết bị.
- Mở app bằng launcher cần Docker Desktop đã cài và Docker Engine sẵn sàng; nếu daemon chưa chạy, launcher hướng dẫn mở Docker Desktop. Nếu muốn chạy không cần Docker, cần đổi sang static hosting hoặc desktop bundle trong plan khác.
- Nếu folder không còn trống ở giai đoạn code, không overwrite; lấy snapshot trạng thái và cập nhật scope trước.
- Rollback của milestone: xóa/revert chỉ các file mới do task tạo sau khi soạn thảo diff; giữ nguyên task pack để ghi trạng thái handoff.

## Approval Gate
- Current state: `passed`
- Evidence: người dùng yêu cầu prompt bàn giao sang conversation khác để code; phê duyệt áp dụng cho scope tại requirement/plan/context-package, gồm Docker launcher, dùng REA và mô hình SVG 2D.
- Conversation triển khai cần kiểm tra lại file tree/toolchain rồi làm đúng scope đã duyệt; xin duyệt mới nếu cần thêm backend, Redis thật, hosting hoặc viết đầy đủ cả 61 bài.
# Scope Amendment - Full Lesson Content (2026-11-19)

Following the user's review of the initial site, the user clarified that knowledge for all lessons must be complete and directly instructed continuation after screen control was handed back. This instruction authorizes substantive content for all 61 lessons and supersedes the plan's earlier “briefs for the remaining 58 lessons” limit. Approval is already passed; no new approval gate is required.

Implementation remains limited to the previously allowlisted files `src/data/lesson-content.ts`, `src/App.tsx`, and `src/styles.css`. Each of the 61 lessons will include a unique explanation, applied example, key takeaways, and self-check. Keep the three interactive SVG simulations and provide their explanatory material alongside them. Verify content coverage and production build; do not use screen control in this follow-up.
