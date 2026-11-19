import type { SimulationStep } from '../types.ts';

export type Simulation = { id: 'request' | 'ttl' | 'stampede'; title: string; subtitle: string; steps: SimulationStep[]; notes: string[] };

export const simulations: Record<Simulation['id'], Simulation> = {
  request: {
    id: 'request', title: 'Request lifecycle · GET /products/42', subtitle: 'Cache-aside · Cache Hit & Cache Miss',
    notes: ['API kiểm tra cache trước khi đọc Database.', 'Cache Hit trả dữ liệu mà không cần gọi Database.', 'Cache Miss đọc Database, ghi kết quả vào Redis rồi trả response.'],
    steps: [
      { title: 'Client gửi request', description: 'Ứng dụng yêu cầu thông tin sản phẩm qua API.', event: 'GET /products/42', activeNodes: ['client', 'api'], packet: 0, facts: ['Request bắt đầu từ Client.', 'Thời gian minh họa, không phải benchmark.'] },
      { title: 'API kiểm tra Redis', description: 'API tạo cache key và gửi lệnh GET đến Redis.', event: 'GET product:42', activeNodes: ['api', 'redis'], packet: 1, facts: ['Cache key: product:42', 'Redis trả nil nếu key chưa có.'] },
      { title: 'Cache Miss → Database', description: 'Không tìm thấy key nên API truy vấn nguồn dữ liệu chính.', event: 'SELECT product WHERE id = 42', activeNodes: ['api', 'redis', 'database'], packet: 2, facts: ['Cache Miss cần thêm một lượt đọc Database.', 'Database vẫn là nguồn dữ liệu chính trong ví dụ.'] },
      { title: 'Ghi cache rồi phản hồi', description: 'API đặt dữ liệu vào Redis và gửi response về Client.', event: 'SET product:42 · EX 300', activeNodes: ['client', 'api', 'redis', 'database'], packet: 3, facts: ['Lượt đọc kế tiếp có thể thành Cache Hit.', 'TTL 300 giây chỉ là giá trị minh họa.'] },
      { title: 'Lượt đọc tiếp theo: Cache Hit', description: 'Cùng key đã có trong Redis nên API trả dữ liệu ngay.', event: 'GET → value', activeNodes: ['client', 'api', 'redis'], packet: 4, facts: ['Cache Hit bỏ qua Database.', 'Cần đồng bộ cache khi dữ liệu nguồn thay đổi.'] },
    ],
  },
  ttl: {
    id: 'ttl', title: 'TTL · vòng đời của một key', subtitle: 'SET EX · countdown · expiration',
    notes: ['EXPIRE gắn thời hạn sống cho key.', 'TTL cho biết số giây còn lại; -2 thường biểu thị key không tồn tại.', 'Redis có passive và active expiration để thu hồi key hết hạn.'],
    steps: [
      { title: 'Tạo key với thời hạn', description: 'SET ghi giá trị và TTL 10 giây trong cùng thao tác.', event: 'SET session:42 token EX 10', activeNodes: ['client', 'redis'], packet: 0, facts: ['Key: session:42', 'TTL bắt đầu sau khi Redis nhận lệnh.'] },
      { title: 'Key nằm trong bộ nhớ', description: 'Key còn hiệu lực; ứng dụng đọc được token.', event: 'GET session:42 → token', activeNodes: ['client', 'redis'], packet: 1, facts: ['TTL còn 07 giây (minh họa).', 'Mốc thời gian trong hình không chạy theo đồng hồ thật.'] },
      { title: 'Thời hạn giảm dần', description: 'Thời gian sống giảm, key vẫn có thể được đọc.', event: 'TTL session:42 → 03', activeNodes: ['redis'], packet: 2, facts: ['TTL hiển thị là số giây còn lại.', 'Có thể gia hạn bằng EXPIRE khi nghiệp vụ cho phép.'] },
      { title: 'Key hết hạn', description: 'Khi hết hạn, lệnh đọc không còn nhận được giá trị.', event: 'GET session:42 → nil', activeNodes: ['client', 'redis'], packet: 3, facts: ['Key được xem là hết hạn.', 'Không nên dựa vào một thời điểm xóa chính xác tuyệt đối.'] },
      { title: 'Redis thu hồi key', description: 'Redis loại key hết hạn qua kiểm tra truy cập hoặc chu kỳ dọn dẹp.', event: 'EXPIRED · key removed', activeNodes: ['redis'], packet: 4, facts: ['Passive expiration xảy ra khi key được truy cập.', 'Active expiration kiểm tra một mẫu key định kỳ.'] },
    ],
  },
  stampede: {
    id: 'stampede', title: 'Cache Stampede · 1.000 request', subtitle: 'Expiration burst · single-flight refresh',
    notes: ['Nhiều request cùng gặp cache miss có thể tạo đợt tải tăng đột biến ở Database.', 'TTL lệch ngẫu nhiên giúp giảm nhiều key hết hạn cùng lúc.', 'Single-flight/lock có thể gom việc làm mới; vẫn cần timeout và xử lý lock an toàn.'],
    steps: [
      { title: 'Cache đang phục vụ', description: 'Nhiều client đọc cùng một key đang còn hạn.', event: 'GET catalog:home → cached value', activeNodes: ['clients', 'redis'], packet: 0, facts: ['Một key nóng được nhiều request dùng chung.', 'Số request là mô phỏng để giải thích hiện tượng.'] },
      { title: 'Key hết hạn', description: 'Giá trị cache hết hạn ngay trước thời điểm tải cao.', event: 'EXPIRED · catalog:home', activeNodes: ['redis'], packet: 1, facts: ['Key hết hạn có thể tạo điểm đồng bộ tải.', 'Các request tiếp theo đều nhận cache miss.'] },
      { title: 'Nhiều cache miss song song', description: 'Các request đồng thời cùng phát hiện thiếu cache.', event: 'MISS × 1,000', activeNodes: ['clients', 'api', 'redis'], packet: 2, facts: ['Các request không tự biết request nào đang làm mới dữ liệu.', 'Nếu không phối hợp, nhiều truy vấn trùng có thể chạy.'] },
      { title: 'Database chịu tải dồn', description: 'Nhiều API cùng truy vấn một dữ liệu nóng ở Database.', event: 'SELECT catalog:home × 1,000', activeNodes: ['clients', 'api', 'database'], packet: 3, facts: ['Đây là tình huống minh họa, không phải tải đo được.', 'Database có thể chậm hoặc quá tải trong hệ thống thật.'] },
      { title: 'Một request giữ quyền làm mới', description: 'Single-flight/lock cho phép một tác vụ làm mới cache.', event: 'SET lock:catalog:home NX PX 5000', activeNodes: ['api', 'redis'], packet: 4, facts: ['Lock cần token sở hữu và thời hạn phù hợp.', 'Các request còn lại chờ ngắn hoặc dùng stale value.'] },
      { title: 'Cache được làm mới', description: 'Một lần đọc Database cập nhật cache, các request sau dùng lại kết quả.', event: 'SET catalog:home · EX 300', activeNodes: ['api', 'redis', 'database'], packet: 5, facts: ['Jitter TTL giúp giảm expiration đồng thời.', 'Cần fallback khi tác vụ làm mới lỗi.'] },
    ],
  },
};

export const quizzes = [
  { question: 'API nên làm gì đầu tiên trong Cache-aside?', choices: ['Đọc Redis', 'Xóa Database', 'Chờ TTL'], answer: 0, explain: 'API đọc cache trước; chỉ gọi Database khi cache miss.' },
  { question: 'TTL 0 giây biểu thị điều gì trong mô phỏng này?', choices: ['Key còn vô hạn', 'Key đã tới hạn', 'Database bị khóa'], answer: 1, explain: 'Khi TTL hết, giá trị không còn được phục vụ như key còn hiệu lực.' },
  { question: 'Điều gì gây tải Database tăng trong Cache Stampede?', choices: ['Nhiều request cùng cache miss', 'Một client đọc cache hit', 'TTL tăng ngẫu nhiên'], answer: 0, explain: 'Nhiều luồng đồng thời cùng đọc Database để làm mới cùng một dữ liệu.' },
];
