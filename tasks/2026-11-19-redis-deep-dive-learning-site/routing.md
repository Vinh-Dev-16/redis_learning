---
type: routing
system: agent-system-v2
status: active
updated: 2026-11-19
project: redis-deep-dive
module: learning-site
task_id: 20261119-m-c-i-plan-c-c-th
---

# Routing Decision - 20261119-m-c-i-plan-c-c-th

## Task Type
- `feature`

## Rigor Level
- `R2` theo lane được giao cho phiên này; đầu ra là requirement, plan và tasks, có approval trước khi code.

## Workflow
- Primary: `feature`
- Optional overlays: `hermes-codex-collaboration`

## Execution Mode
- `task-intake`

## Model Routing
- Planning lane: model suy luận mạnh nhất hiện có
- Coding lane (default): model triển khai ổn định, mức trung bình đến mạnh
- Coding lane (small/clear/low-risk): không cần tách lane cho milestone này
- Verification lane: model review thích ứng; kiểm tra build và giao diện thực tế
- Escalate to strongest model when: xuất hiện yêu cầu backend, lưu trữ dữ liệu dùng chung, hoặc nội dung học vượt khỏi phạm vi ba mô phỏng đầu

## Loop Budget
- Max loops: `3`
- Same-hypothesis retries: `1`
- Re-plan limit: `1`
- Max tool calls: `24`
- Max wall time (minutes): `90`
- Max retries per step: `1`
- Idempotency policy: trước khi ghi file, kiểm tra file đích; chỉ cập nhật file thuộc scope, không ghi đè nội dung người dùng tạo sau thời điểm lập plan; không tạo trùng task pack khi tiếp tục cùng task ID.

## Orchestration Shape
- Shape: `single-agent`
- Dispatch unit: `none`
- Max parallel subagents: `1`
- Synthesis strategy: `n/a`
- Verification passes: `1`
- Coverage rule: đủ cả 11 chương/61 mục trong catalog; kiểm tra ba mô phỏng được triển khai và bốn khu vực điều hướng chính.

## Approval Points
- Gate A: dừng tại `WAITING_APPROVAL` sau khi task pack hoàn chỉnh; chưa được tạo hoặc sửa source code.
- Gate B: nếu cần thêm backend, database, dịch vụ ngoài hoặc vượt khỏi các đường dẫn trong `context-package.md`, dừng và xin duyệt scope mới.

## Runtime Profile
- Hiện tại: `planner`
- Sau approval: `scoped-coder`
- Xác minh: `readonly-researcher` / kiểm tra trình duyệt cục bộ

## Subagents
- Không dùng.
- Reason: task có một frontend cục bộ, scope đã khóa; chia việc không tăng độ phủ ở giai đoạn lập plan.

## Requires Approval Gate
- `true`

## Requires Writeback
- `true`; lưu trạng thái và kế hoạch trong task pack nằm dưới repo hiện tại theo yêu cầu người dùng.

## Requires Eval
- `false`; đây là website học cục bộ không xử lý auth, tiền, dữ liệu production hay tích hợp nhạy cảm.

## Evidence Contract
- Required evidence: `npm run build`, `docker compose config`, build container thành công và kiểm tra trực quan trên trình duyệt ở kích thước desktop/mobile; không thêm/chạy unit test trong milestone nếu người dùng chưa yêu cầu.
- Context freshness: kiểm tra lại file tree và các file scope ngay trước scaffold; không có source commit/index hiện tại vì folder đang trống và chưa có `.git`.
- Evidence artifact: kết quả build và ảnh/chú thích kiểm tra giao diện sẽ được ghi trong task pack ở giai đoạn triển khai.

## Reason
- Đây là một feature mới cần tồn tại qua nhiều phiên. Lane được giao là R2/task-intake; yêu cầu cụ thể đủ để tạo requirement và kế hoạch, còn danh sách chương cùng ba bài mô phỏng làm ranh giới milestone rõ ràng. Site chạy cục bộ, không cần backend; user approval là gate trước source edit.

## Approval State
- Current state: `passed`
- Evidence: người dùng yêu cầu cung cấp prompt để chuyển sang conversation khác triển khai sau khi plan đã có Docker launcher; scope được duyệt theo plan, kèm yêu cầu dùng REA và mô hình 2D.
- Boundaries: chỉ triển khai các file trong `context-package.md`; mọi mở rộng sang backend/Redis thật/hosting hoặc ngoài scope phải dừng và xin duyệt.
