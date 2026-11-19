# Redis Deep Dive Learning Lab

Website học Redis chạy hoàn toàn trên máy cá nhân. Ứng dụng chỉ cần Docker Desktop để mở; Docker phục vụ website tĩnh và **không chạy Redis**.

## Dành cho người học

1. Cài và mở Docker Desktop, chờ trạng thái Engine sẵn sàng.
2. Nhấp đúp `scripts/Open-Redis-Learning.bat`. Launcher dựng website lần đầu và mở `http://localhost:4173`.
3. Khi muốn dừng, nhấp đúp `scripts/Stop-Redis-Learning.bat`.

Nếu launcher báo Docker Engine chưa sẵn sàng, mở Docker Desktop, đợi khởi động xong rồi chạy lại. Trình duyệt lưu bài đang học và tiến độ hoàn thành trên thiết bị hiện tại.

## Dành cho phát triển

Yêu cầu Node.js 22+ và npm. Chạy `npm install`, `npm run dev` để phát triển hoặc `npm run build` để tạo bản tĩnh. `docker compose up -d --build` phục vụ bản build qua Nginx tại cổng 4173; `docker compose down` dừng và gỡ container website.
