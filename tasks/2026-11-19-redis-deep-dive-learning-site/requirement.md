---
type: requirement
system: agent-system-v2
status: active
updated: 2026-11-19
project: redis-deep-dive
module: learning-site
task_id: 20261119-m-c-i-plan-c-c-th
---

# Requirement - 20261119-m-c-i-plan-c-c-th

## User Request

Tạo website học Redis giống trải nghiệm học System Design trong ảnh: danh sách khóa học/bài ở bên trái, mô phỏng chính ở giữa, ghi chú kiến thức bên phải, các bước bài học và tiến độ phía dưới. Giáo trình dùng 11 chương Redis do người dùng cung cấp.

## Problem Statement

Nội dung Redis hiện ở dạng danh sách dài; người học cần một giao diện trực quan để theo dõi một request qua các thành phần, tiến từng bước, đọc ghi chú liên quan và xem mình đang học đến đâu.

## In Scope

- Frontend local-first bằng React, TypeScript, Vite; bản production build được đóng gói trong Docker image và Nginx phục vụ static assets.
- Có `docker-compose.yml` và hai launcher Windows `.bat`: mở app (build nếu chưa có image, khởi chạy container rồi mở browser) và dừng app. Docker Desktop là điều kiện runtime; sau lần chạy đầu người dùng không cần mở source code hoặc tự gõ lệnh.
- Container chỉ phục vụ web UI; không chạy Redis trong Docker.
- Bố cục desktop bám ảnh tham chiếu: header có `Học`, `Luyện tập`, `Phòng thiết kế`, `Tóm tắt`; sidebar chương/bài; vùng mô phỏng trung tâm; panel ghi chú/checklist bên phải; timeline và tiến độ phía dưới.
- Responsive: ở viewport hẹp, sidebar/panel chuyển thành khu vực đóng mở hoặc xếp dưới nội dung, không làm tràn trang.
- Catalog đầy đủ các chương và bài bên dưới.
- Hoàn thiện nội dung và mô phỏng từng bước cho ba bài mẫu: hành trình request GET/SET, TTL & expiration, Cache Stampede.
- Dựng mô hình 2D tương tác bằng SVG (không dùng ảnh chụp làm sơ đồ): node Client/API/Redis/Database, đường kết nối, packet/step state và chuyển động theo bước; bố cục, lưới nền, màu và nhãn bám ảnh tham khảo.
- 58 bài còn lại có trang bài học dẫn hướng được, tiêu đề, chương, mục tiêu/brief ngắn và trạng thái hoàn thành; chưa viết thành giáo trình chi tiết.
- Điều khiển bài mô phỏng: bước trước/sau, phát lại/tạm dừng, chỉ báo bước hiện tại và giải thích trạng thái.
- `Luyện tập`: câu hỏi/dự đoán kết quả gắn với ba bài mô phỏng mẫu.
- `Phòng thiết kế`: canvas MVP với Client/API/Redis/Database và điều khiển cache hit/miss cùng TTL để quan sát luồng.
- `Tóm tắt`: số bài đã hoàn thành, bài đang học, chương và checklist kiến thức.
- Lưu bài đang học và tiến độ hoàn thành trong `localStorage`.
- Tiếng Việt là ngôn ngữ giao diện; giữ nguyên Redis commands và các technical terms cần thiết.

## Out of Scope

- Nội dung giáo trình chi tiết cho toàn bộ 61 bài trong milestone đầu.
- Kết nối Redis thật, .NET lab thực thi code, backend, database hoặc user account/sync đa thiết bị.
- Tạo bài tập runner cho Redis command, sandbox code hoặc tích hợp LLM.
- Drag-and-drop tùy ý/kiến trúc tự do trong Phòng thiết kế; MVP chỉ có sơ đồ cố định với biến thể tình huống.
- Đưa website lên hosting/production, cấu hình analytics, API ngoài hoặc secrets.
- Đảm bảo số thời gian mô phỏng tương ứng benchmark thực; mọi số liệu phải gắn nhãn minh họa.

## Constraints

- Người dùng muốn tất cả task pack/planning artifact nằm trong `D:\C#\redis`, không ghi vào Obsidian Vault.
- Plan đã được duyệt để triển khai trong conversation tiếp theo; giữ code trong scope task pack.
- Thư mục hiện trống; trước khi code phải kiểm tra lại và bảo toàn mọi file mới phát sinh.
- Không thêm/chạy unit test trong phạm vi hiện tại nếu người dùng không yêu cầu; kiểm tra build và giao diện khi đến giai đoạn verification.
- Reference: ảnh #1 (layout học), ảnh #2 (outline 11 chương), ảnh #3 (một bài mô phỏng từng bước); URL tham khảo `https://designed-to-scale.vercel.app/#/request-lifecycle/7`.

## Acceptance Criteria

1. Sidebar hiển thị đủ 11 chương và tổng `61` bài, có thể mở/đóng chương và chọn bài.
2. Số `61` được tính từ số lượng trong từng chương; không hiển thị tổng `56` sai lệch của bản giới thiệu.
3. Bốn vùng điều hướng chính hoạt động ở mức MVP đã nêu; mục hiện chọn và bài hiện tại được nhìn thấy rõ.
4. Ba bài mô phỏng mẫu có tiến/lùi/phát lại/tạm dừng; sơ đồ và nội dung ghi chú đổi theo bước; có thể chọn lesson và tiếp tục tiến trình.
5. Nội dung hiển thị phân biệt sự kiện trong mô hình với số đo thật; không gọi số thời gian mô phỏng là benchmark.
6. Tiến độ được lưu/reload từ `localStorage`; tổng tiến độ không tự đánh dấu bài chưa hoàn thành.
7. Bố cục hoạt động ở màn hình desktop và viewport hẹp; không xuất hiện tràn ngang gây mất nội dung bài.
8. `npm run build`, `docker compose config` và Docker image build thành công; launcher mở app ở browser để kiểm tra giao diện trước handoff implementation.
9. Website không cần Redis service, backend, external API hoặc secret; Docker Desktop là runtime để mở web.
10. Mô hình trung tâm là SVG 2D tương tác, node/edges/packet đổi theo state; không dùng bitmap tĩnh thay mô phỏng và SVG co giãn trong canvas ở desktop/mobile.

## Bổ sung về mô hình 2D

- Sơ đồ mô phỏng trung tâm là SVG tương tác, có node/edges/packet chuyển động theo state của từng bước; không dùng bitmap tĩnh làm nội dung thay thế.
- Bài GET/SET dùng Client/API/Redis/Database; bài TTL biểu diễn key/value và countdown; bài Cache Stampede thể hiện nhiều request song song và luồng dồn về Database.
- SVG co giãn theo viewport và không tràn ra ngoài canvas.

## Course Catalog

### 01 — Redis Foundation — Nền tảng (5 bài)
1. Redis là gì và tại sao nó xuất hiện?
2. Redis khác Database truyền thống như thế nào?
3. Hành trình của một request: Client → API → Redis → Database.
4. Cache Hit và Cache Miss diễn ra như thế nào?
5. Redis là cache, database hay message broker?

### 02 — Redis Internals — Kiến trúc bên trong (5 bài)
1. Redis lưu dữ liệu trong RAM như thế nào?
2. Client kết nối Redis qua TCP và RESP Protocol.
3. Event Loop và cách Redis xử lý nhiều kết nối.
4. Tại sao Redis nhanh? CPU, RAM, I/O và độ trễ mạng.
5. Một lệnh `GET`/`SET` được thực thi bên trong ra sao?

### 03 — Redis Data Structures — Cấu trúc dữ liệu (7 bài)
1. String — `GET`, `SET`, `MGET`, `INCR`.
2. Hash — `HSET`, `HGET`, `HGETALL`.
3. List — `LPUSH`, `RPUSH`, `LPOP`, `BLPOP`.
4. Set — `SADD`, `SISMEMBER`, `SINTER`.
5. Sorted Set — `ZADD`, `ZRANGE`, leaderboard.
6. Stream — `XADD`, `XREAD`, consumer group.
7. Bitmaps, HyperLogLog, Geospatial và khi nào dùng.

### 04 — Memory & Expiration (5 bài)
1. Key được tạo, cập nhật và xóa như thế nào?
2. TTL, EXPIRE và vòng đời key.
3. Passive Expiration và Active Expiration.
4. Khi RAM đầy: `maxmemory` và eviction policies.
5. LRU, LFU, Big Keys và memory fragmentation.

### 05 — Caching Strategies — Chiến lược cache (7 bài)
1. Cache-aside Pattern.
2. Read-through, Write-through và Write-behind.
3. Cache Invalidation và dữ liệu không nhất quán.
4. Cache Stampede — 1.000 request cùng cache miss.
5. Cache Penetration — truy vấn dữ liệu không tồn tại.
6. Cache Avalanche — nhiều key hết hạn đồng thời.
7. Hot Keys, Multi-level Cache và Redis Outage.

### 06 — Atomicity & Concurrency (5 bài)
1. Race Condition khi nhiều client cùng cập nhật.
2. `INCR` có gì khác `GET` → `SET`?
3. Redis Transactions: `MULTI`, `EXEC`, `WATCH`.
4. Lua Script và thao tác atomic nhiều bước.
5. Optimistic Concurrency và Lost Update.

### 07 — Distributed Locking (5 bài)
1. Vì sao cần Distributed Lock?
2. Triển khai Lock với `SET NX PX`.
3. Lock Ownership — vì sao không được xóa lock của client khác?
4. Lock TTL hết hạn khi công việc chưa xong.
5. Stale Writes, Fencing Token và giới hạn của Distributed Lock.

### 08 — Redis Messaging & Streams (5 bài)
1. Redis List làm Background Queue.
2. Pub/Sub — Publisher và Subscriber.
3. Redis Streams — Event Log.
4. Consumer Groups, Acknowledgment và Pending Messages.
5. Retry, Duplicate Message; so sánh Redis Streams với Kafka/SQS.

### 09 — Persistence & High Availability (6 bài)
1. Redis restart thì dữ liệu có mất không?
2. RDB Snapshot.
3. AOF và AOF Rewrite.
4. Redis Replication: Primary và Replica.
5. Redis Sentinel và Automatic Failover.
6. Redis Cluster, Hash Slots và Sharding.

### 10 — Performance & Troubleshooting (6 bài)
1. Round-trip Latency, Pipelining và Batch.
2. `KEYS` vs `SCAN`, Big Keys và Slow Commands.
3. Redis `INFO`, `SLOWLOG`, Memory và Latency Monitoring.
4. Redis CPU cao, RAM đầy, Connection Exhaustion.
5. Redis Outage, Timeout, Circuit Breaker và fallback.
6. ACL, TLS, Backup, Capacity Planning và kiểm thử tải.

### 11 — Redis with ASP.NET Core — Dự án thực hành (5 bài)
1. Tích hợp StackExchange.Redis và Dependency Injection.
2. Xây Student API dùng Redis + MongoDB.
3. Cache count, thiết kế cache key, TTL và invalidation.
4. Load Testing, Cache Stampede và xử lý Redis lỗi.
5. Capstone: Thiết kế, triển khai và bảo vệ kiến trúc Redis cho hệ thống 100K CCU giả định.

## Open Questions

- Không có blocker cần hỏi trước khi triển khai theo scope đã duyệt. Nếu ảnh tham khảo chưa có trong conversation mới, yêu cầu người dùng gửi lại ảnh rõ hơn trước khi tinh chỉnh trực quan.
