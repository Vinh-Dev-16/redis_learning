import type { Chapter, Lesson } from '../types.ts';

const definitions: Array<[string, string, string, string, string[]]> = [
  ['foundation', '01', 'Redis Foundation', 'Nền tảng', [
    'Redis là gì và tại sao nó xuất hiện?',
    'Redis khác Database truyền thống như thế nào?',
    'Hành trình của một request: Client → API → Redis → Database.',
    'Cache Hit và Cache Miss diễn ra như thế nào?',
    'Redis là cache, database hay message broker?',
  ]],
  ['internals', '02', 'Redis Internals', 'Kiến trúc bên trong', [
    'Redis lưu dữ liệu trong RAM như thế nào?',
    'Client kết nối Redis qua TCP và RESP Protocol.',
    'Event Loop và cách Redis xử lý nhiều kết nối.',
    'Tại sao Redis nhanh? CPU, RAM, I/O và độ trễ mạng.',
    'Một lệnh GET/SET được thực thi bên trong ra sao?',
  ]],
  ['structures', '03', 'Redis Data Structures', 'Cấu trúc dữ liệu', [
    'String — GET, SET, MGET, INCR.', 'Hash — HSET, HGET, HGETALL.', 'List — LPUSH, RPUSH, LPOP, BLPOP.',
    'Set — SADD, SISMEMBER, SINTER.', 'Sorted Set — ZADD, ZRANGE, leaderboard.',
    'Stream — XADD, XREAD, consumer group.', 'Bitmaps, HyperLogLog, Geospatial và khi nào dùng.',
  ]],
  ['memory', '04', 'Memory & Expiration', 'Bộ nhớ và hết hạn', [
    'Key được tạo, cập nhật và xóa như thế nào?', 'TTL, EXPIRE và vòng đời key.', 'Passive Expiration và Active Expiration.',
    'Khi RAM đầy: maxmemory và eviction policies.', 'LRU, LFU, Big Keys và memory fragmentation.',
  ]],
  ['caching', '05', 'Caching Strategies', 'Chiến lược cache', [
    'Cache-aside Pattern.', 'Read-through, Write-through và Write-behind.', 'Cache Invalidation và dữ liệu không nhất quán.',
    'Cache Stampede — 1.000 request cùng cache miss.', 'Cache Penetration — truy vấn dữ liệu không tồn tại.',
    'Cache Avalanche — nhiều key hết hạn đồng thời.', 'Hot Keys, Multi-level Cache và Redis Outage.',
  ]],
  ['concurrency', '06', 'Atomicity & Concurrency', 'Tính nguyên tử và đồng thời', [
    'Race Condition khi nhiều client cùng cập nhật.', 'INCR có gì khác GET → SET?', 'Redis Transactions: MULTI, EXEC, WATCH.',
    'Lua Script và thao tác atomic nhiều bước.', 'Optimistic Concurrency và Lost Update.',
  ]],
  ['locking', '07', 'Distributed Locking', 'Khóa phân tán', [
    'Vì sao cần Distributed Lock?', 'Triển khai Lock với SET NX PX.',
    'Lock Ownership — vì sao không được xóa lock của client khác?',
    'Lock TTL hết hạn khi công việc chưa xong.', 'Stale Writes, Fencing Token và giới hạn của Distributed Lock.',
  ]],
  ['messaging', '08', 'Redis Messaging & Streams', 'Thông điệp và luồng sự kiện', [
    'Redis List làm Background Queue.', 'Pub/Sub — Publisher và Subscriber.', 'Redis Streams — Event Log.',
    'Consumer Groups, Acknowledgment và Pending Messages.', 'Retry, Duplicate Message; so sánh Redis Streams với Kafka/SQS.',
  ]],
  ['availability', '09', 'Persistence & High Availability', 'Lưu trữ và sẵn sàng cao', [
    'Redis restart thì dữ liệu có mất không?', 'RDB Snapshot.', 'AOF và AOF Rewrite.',
    'Redis Replication: Primary và Replica.', 'Redis Sentinel và Automatic Failover.', 'Redis Cluster, Hash Slots và Sharding.',
  ]],
  ['performance', '10', 'Performance & Troubleshooting', 'Hiệu năng và xử lý sự cố', [
    'Round-trip Latency, Pipelining và Batch.', 'KEYS vs SCAN, Big Keys và Slow Commands.',
    'Redis INFO, SLOWLOG, Memory và Latency Monitoring.', 'Redis CPU cao, RAM đầy, Connection Exhaustion.',
    'Redis Outage, Timeout, Circuit Breaker và fallback.', 'ACL, TLS, Backup, Capacity Planning và kiểm thử tải.',
  ]],
  ['dotnet', '11', 'Redis with ASP.NET Core', 'Dự án thực hành', [
    'Tích hợp StackExchange.Redis và Dependency Injection.', 'Xây Student API dùng Redis + MongoDB.',
    'Cache count, thiết kế cache key, TTL và invalidation.',
    'Load Testing, Cache Stampede và xử lý Redis lỗi.',
    'Capstone: Thiết kế, triển khai và bảo vệ kiến trúc Redis cho hệ thống 100K CCU giả định.',
  ]],
];

const sampleLessonIds: Record<string, Lesson['simulation']> = {
  'foundation-3': 'request', 'memory-2': 'ttl', 'caching-4': 'stampede',
};

function briefFor(title: string, chapter: string, lessonId: string): string {
  if (sampleLessonIds[lessonId] === 'request') return 'Theo dấu một lần đọc qua Client, API, Redis và Database; quan sát nhánh Cache Hit và Cache Miss cùng phản hồi quay về.';
  if (sampleLessonIds[lessonId] === 'ttl') return 'Quan sát key được ghi kèm thời hạn, bộ đếm giảm dần và cách Redis loại key hết hạn khỏi bộ nhớ.';
  if (sampleLessonIds[lessonId] === 'stampede') return 'Mô phỏng cache hết hạn khi nhiều request đồng thời đến, cùng gọi Database, rồi so sánh hướng giảm tải bằng khóa làm mới.';
  const clean = title.replace(/[.!?]+$/, '');
  return `Tìm hiểu ${clean.toLowerCase()} trong ${chapter}. Nắm khái niệm cốt lõi, thời điểm phù hợp và điểm cần cân nhắc khi áp dụng.`;
}

export const chapters: Chapter[] = definitions.map(([id, number, name, subtitle, titles]) => {
  const chapterId = id as string;
  const lessons = (titles as string[]).map((title, index): Lesson => {
    const lessonId = `${chapterId}-${index + 1}`;
    return { id: lessonId, chapterId, title, brief: briefFor(title, name, lessonId), simulation: sampleLessonIds[lessonId] };
  });
  return { id: chapterId, number, name, subtitle, lessons };
});

export const lessons = chapters.flatMap((chapter) => chapter.lessons);
export const sampleLessons = lessons.filter((lesson) => lesson.simulation);
