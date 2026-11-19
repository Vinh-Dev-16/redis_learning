---
type: task-index
system: agent-system-v2
status: active
updated: 2026-11-19
project: redis-deep-dive
module: learning-site
task_id: 20261119-m-c-i-plan-c-c-th
task_type: feature
rigor_level: R2
workflow: feature+hermes-codex-collaboration
approval_state: passed
state: APPROVED
state_version: 7
---

# 20261119-m-c-i-plan-c-c-th - Website học Redis tương tác

## Read Order
1. `routing.md`
2. `context-package.md`
3. `requirement.md`
4. `plan.md`
5. `tasks.md`

## Current Status
- Stage: implementation đã hoàn tất trong scope; còn handoff review/test riêng
- Approval gate: đã pass cho đúng scope trong `plan.md`
- Lifecycle state: `APPROVED`
- State version: `5`
- Lịch sử: `INTAKE -> ROUTED -> CONTEXT_READY -> PLANNED -> WAITING_APPROVAL -> APPROVED`; implementation notes nằm trong `tasks.md`
- Lần cập nhật có ý nghĩa gần nhất: 2026-11-19

## Routing Snapshot
- Task type: `feature`
- Rigor level: `R2`
- Workflow: `feature` với overlay `hermes-codex-collaboration`
- Execution mode: `task-intake`
- Model routing: `plan=strongest-available | code=stable-implementation | verify=adaptive-review`
- Runtime profile: `planner` ở giai đoạn plan; `scoped-coder` ở conversation triển khai
- Requires writeback: `true` (task pack cục bộ trong repo)
- Required anchors: build production và kiểm tra giao diện trên trình duyệt

## Artifacts
- `routing.md`
- `context-package.md`
- `requirement.md`
- `plan.md`
- `tasks.md`

## Related Notes
- Flow: không có; thư mục dự án hiện chưa có source
- Incident: không áp dụng
- Handoff: nằm trong task pack này

## Notes for the Next Agent
- Thư mục `D:\C#\redis` được kiểm tra và hiện trống, chưa có project scaffold hoặc `.git`.
- Nguồn nội dung là danh sách 11 chương trong yêu cầu người dùng. Cộng số bài theo từng chương được **61**, không phải 56 như nhãn tổng trong nội dung tham khảo; xem quyết định trong `requirement.md`.
- Cách mở app sau triển khai theo cập nhật người dùng: Docker Desktop/Nginx và launcher `.bat` mở/dừng; người dùng không phải mở source code hoặc nhập lệnh để học thường ngày.
- Người dùng yêu cầu chuyển sang conversation khác để code và nhấn mạnh phải dùng REA, dựng mô hình 2D theo ảnh; approval evidence cho scope hiện tại là yêu cầu chuyển phase này.
- Giữ toàn bộ planning artifacts ở `D:\C#\redis\tasks\2026-11-19-redis-deep-dive-learning-site\`; không ghi vào Obsidian.
- Approval đã pass. Kiểm tra lại trạng thái thư mục trước khi scaffold; nếu xuất hiện file mới thì giữ nguyên và cập nhật scope trước khi ghi đè.

## Implementation Handoff (2026-11-19)
- Tạo app React + TypeScript + Vite, catalog 11 chương/61 bài, ba mô phỏng SVG tương tác, luyện tập/phòng thiết kế/tóm tắt và lưu tiến độ localStorage.
- `npm run build`, `docker compose config`, Docker image build, container healthy và HTTP `200` đều đã xác nhận. Vivaldi hiển thị trang; đã quan sát layout desktop và viewport hẹp 395px.
- REA không truy cập được browser target tham khảo; lần chạy capture app local kết thúc `execution_failure` kèm `cleanup_incomplete`. Không có kết quả REA hợp lệ để đối chiếu reference.
- Chưa kiểm tra hết chuỗi thao tác bước/replay/persist sau reload bằng UI. Không chạy unit test. npm báo 2 dependency vulnerabilities (1 moderate, 1 high); chưa chạy audit chi tiết.
- Container `redis-deep-dive-learning-site` đang chạy tại `http://localhost:4173`; Docker chỉ phục vụ web, không có Redis service.

## Scope Amendment: Full Lesson Content (2026-11-19)
- Người dùng phản hồi rằng 61 bài cần có kiến thức đầy đủ và trực tiếp yêu cầu tiếp tục bổ sung nội dung sau khi kết thúc điều khiển màn hình. Đây là chỉ đạo mới, thay phần giới hạn “58 bài brief” trong scope approval ban đầu.
- Phạm vi mở rộng trong các file đã allowlist: `src/data/lesson-content.ts`, `src/App.tsx`, `src/styles.css`; không thêm backend, Redis service, network dependency hoặc file ngoài allowlist.
- Mỗi lesson trong catalog có nội dung tiếng Việt riêng: khái niệm/cơ chế, áp dụng, ví dụ, điểm nhớ và câu tự kiểm tra; ba bài GET/SET lifecycle, TTL/expiration, Cache Stampede vẫn giữ mô phỏng tương tác.
- Trạng thái: nội dung đã thêm, đang ghi nhận kiểm chứng build/coverage trong `tasks.md`. Không điều khiển browser/màn hình trong lượt bổ sung này theo yêu cầu người dùng.
