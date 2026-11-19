import { useEffect, useMemo, useState } from 'react';
import type { LearningMode, Lesson, SimulationStep } from './types.ts';
import { chapters, lessons } from './data/curriculum.ts';
import { lessonContents } from './data/lesson-content.ts';
import { quizzes, simulations } from './data/simulations.ts';

type SavedState = { selectedLessonId: string; completedLessonIds: string[] };
const STORAGE_KEY = 'redis-deep-dive-progress-v1';
const defaultState: SavedState = { selectedLessonId: 'foundation-3', completedLessonIds: [] };
const tabs: LearningMode[] = ['Học', 'Luyện tập', 'Phòng thiết kế', 'Tóm tắt'];

function readSavedState(): SavedState {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!parsed || typeof parsed !== 'object') return defaultState;
    const saved = parsed as Partial<SavedState>;
    return {
      selectedLessonId: lessons.some((lesson) => lesson.id === saved.selectedLessonId) ? saved.selectedLessonId! : defaultState.selectedLessonId,
      completedLessonIds: Array.isArray(saved.completedLessonIds) ? saved.completedLessonIds.filter((id): id is string => typeof id === 'string' && lessons.some((lesson) => lesson.id === id)) : [],
    };
  } catch { return defaultState; }
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = { book: 'M5 4h10v15H5z M15 7h4v12h-4 M8 8h4 M8 11h4', play: 'M8 5l11 7-11 7z', check: 'm5 12 4 4L19 6', spark: 'm12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z', grid: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z', back: 'M19 12H5 M12 19l-7-7 7-7', next: 'M5 12h14 M12 5l7 7-7 7', refresh: 'M20 11a8 8 0 0 0-14-5L4 8 M4 4v4h4 M4 13a8 8 0 0 0 14 5l2-2 M20 20v-4h-4', pause: 'M8 5h3v14H8z M15 5h3v14h-3z', playSmall: 'M8 5l11 7-11 7z' };
  return <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name] ?? paths.book} /></svg>;
}

function FlowDiagram({ lesson, step, stepIndex }: { lesson: Lesson; step: SimulationStep; stepIndex: number }) {
  const isTtl = lesson.simulation === 'ttl';
  const isStampede = lesson.simulation === 'stampede';
  const active = (a: string, b: string) => step.activeNodes.includes(a) && step.activeNodes.includes(b);
  const point = isTtl ? [540, 248] : isStampede ? [[140, 192], [330, 192], [530, 192], [752, 192], [535, 325], [750, 325]][stepIndex] : [[143, 190], [340, 190], [554, 190], [760, 315], [345, 190]][stepIndex];
  const nodes = isTtl ? [
    { id: 'client', x: 130, y: 205, title: 'ỨNG DỤNG', label: 'Client', meta: 'session:42' },
    { id: 'redis', x: 510, y: 205, title: 'CACHE', label: 'Redis', meta: stepIndex >= 4 ? 'key expired' : `TTL 00:${['10', '07', '03', '00', '—'][stepIndex]} · token` },
  ] : isStampede ? [
    { id: 'clients', x: 112, y: 194, title: 'MANY CLIENTS', label: '1,000 requests', meta: 'parallel reads' },
    { id: 'api', x: 342, y: 194, title: 'APPLICATION', label: 'API', meta: 'cache-aside' },
    { id: 'redis', x: 562, y: 194, title: 'CACHE', label: 'Redis', meta: stepIndex >= 1 ? 'MISS · expired' : 'catalog:home' },
    { id: 'database', x: 782, y: 194, title: 'SOURCE', label: 'Database', meta: 'catalog data' },
  ] : [
    { id: 'client', x: 116, y: 194, title: 'APPLICATION', label: 'Client', meta: 'GET /products/42' },
    { id: 'api', x: 342, y: 194, title: 'SERVICE', label: 'API', meta: 'cache-aside' },
    { id: 'redis', x: 570, y: 194, title: 'IN-MEMORY', label: 'Redis', meta: stepIndex === 4 ? 'HIT · product:42' : 'product:42' },
    { id: 'database', x: 800, y: 194, title: 'SOURCE', label: 'Database', meta: 'products table' },
  ];
  const edges = isTtl ? [{ a: 'client', b: 'redis', d: 'M 215 248 C 305 248 375 248 465 248', label: 'SET · GET · TTL' }] : [
    { a: isStampede ? 'clients' : 'client', b: 'api', d: 'M 214 238 C 260 238 282 238 328 238', label: isStampede ? '× 1,000' : 'HTTP request' },
    { a: 'api', b: 'redis', d: 'M 442 238 C 487 238 506 238 551 238', label: 'GET key' },
    { a: 'api', b: 'database', d: 'M 442 256 C 535 330 645 330 729 256', label: isStampede ? '× 1,000 queries' : 'Cache miss → SELECT' },
    { a: 'redis', b: 'api', d: 'M 551 270 C 506 286 487 286 442 270', label: 'value / nil' },
  ];
  return <svg className="flow-svg" viewBox="0 0 940 430" role="img" aria-label={`Sơ đồ tương tác: ${step.title}`} preserveAspectRatio="xMidYMid meet">
    <defs><pattern id="iso-grid" width="46" height="26" patternUnits="userSpaceOnUse"><path d="M 0 13 L 23 0 L 46 13 L 23 26 Z" fill="none" stroke="#777765" strokeOpacity=".14" strokeWidth=".7" /></pattern><filter id="glow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
    <rect width="940" height="430" fill="url(#iso-grid)" />
    {edges.map((edge) => <g key={edge.a + edge.b}><path d={edge.d} className={`edge ${active(edge.a, edge.b) ? 'edge-active' : ''}`} /><text className="edge-label" x={edge.a === 'api' ? 510 : 264} y={edge.label.includes('SELECT') || edge.label.includes('queries') ? 325 : 220}>{edge.label}</text></g>)}
    {isStampede && <path d="M 143 276 C 340 388 575 388 760 277" className={`edge ${stepIndex >= 3 ? 'edge-warning' : ''}`} />}
    {nodes.map((node) => <g key={node.id} className={`diagram-node ${step.activeNodes.includes(node.id) ? 'node-active' : ''}`}>
      <rect x={node.x - 70} y={node.y - 66} width="140" height="132" rx="12" className="node-frame" />
      <path d={`M ${node.x - 45} ${node.y - 24} l45 -25 45 25 -45 25z`} className="node-cube-top" /><path d={`M ${node.x - 45} ${node.y - 24} v47 l45 25 v-47z`} className="node-cube-left" /><path d={`M ${node.x + 45} ${node.y - 24} v47 l-45 25 v-47z`} className="node-cube-right" />
      <text x={node.x} y={node.y - 48} className="node-title" textAnchor="middle">{node.title}</text><text x={node.x} y={node.y + 68} className="node-label" textAnchor="middle">{node.label}</text><text x={node.x} y={node.y + 85} className="node-meta" textAnchor="middle">{node.meta}</text>
    </g>)}
    {isStampede && stepIndex >= 2 && <g className="request-burst">{[0, 1, 2, 3, 4].map((n) => <circle key={n} cx={430 + n * 12} cy={218 + n % 2 * 9} r="5" className="burst-dot" />)}</g>}
    {!isTtl && <circle cx={point?.[0] ?? 540} cy={point?.[1] ?? 238} r="9" className="packet" filter="url(#glow)"><animate attributeName="r" values="7;10;7" dur="1.6s" repeatCount="indefinite" /></circle>}
    {isTtl && <g><rect x="425" y="332" width="230" height="46" rx="8" className="ttl-track" /><rect x="425" y="332" width={stepIndex < 4 ? [220, 155, 75, 5, 0][stepIndex] : 0} height="46" rx="8" className="ttl-fill" /><text x="540" y="360" textAnchor="middle" className="ttl-text">{stepIndex >= 4 ? 'EXPIRED · key removed' : `TTL 00:${['10', '07', '03', '00'][stepIndex] ?? '00'} · token`}</text></g>}
    <text x="28" y="402" className="diagram-caption">REDIS DEEP DIVE / INTERACTIVE MODEL</text><text x="912" y="402" textAnchor="end" className="diagram-caption">STEP {String(stepIndex + 1).padStart(2, '0')}</text>
  </svg>;
}

export default function App() {
  const [saved, setSaved] = useState<SavedState>(readSavedState);
  const [mode, setMode] = useState<LearningMode>('Học');
  const [expanded, setExpanded] = useState<string[]>(['foundation', 'memory', 'caching']);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [designHit, setDesignHit] = useState(true);
  const [designTtl, setDesignTtl] = useState(true);
  const [mobilePanel, setMobilePanel] = useState<'course' | 'notes' | null>(null);
  const lesson = lessons.find((item) => item.id === saved.selectedLessonId) ?? lessons[2];
  const content = lessonContents[lesson.id];
  const simulation = lesson.simulation ? simulations[lesson.simulation] : null;
  const step = simulation?.steps[Math.min(stepIndex, (simulation?.steps.length ?? 1) - 1)];
  const chapter = chapters.find((item) => item.id === lesson.chapterId)!;
  const percentage = Math.round((saved.completedLessonIds.length / lessons.length) * 100);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }, [saved]);
  useEffect(() => { setStepIndex(0); setPlaying(false); }, [lesson.id]);
  useEffect(() => {
    if (!playing || !simulation) return;
    const timer = window.setInterval(() => setStepIndex((n) => n >= simulation.steps.length - 1 ? 0 : n + 1), 2100);
    return () => window.clearInterval(timer);
  }, [playing, simulation]);

  const selectLesson = (next: Lesson) => {
    setSaved((current) => ({ ...current, selectedLessonId: next.id }));
    setMode('Học'); setMobilePanel(null);
  };
  const markComplete = () => setSaved((current) => ({ ...current, completedLessonIds: current.completedLessonIds.includes(lesson.id) ? current.completedLessonIds : [...current.completedLessonIds, lesson.id] }));
  const groupedLessons = useMemo(() => chapters, []);

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Redis Deep Dive trang chủ"><span className="brand-mark">r</span><span><b>redis</b><small>DEEP DIVE LAB</small></span></a>
      <div className="topbar-center"><span className="online-dot" /> LOCAL LEARNING ENVIRONMENT <span className="topbar-divider">/</span> MODULE 01</div>
      <nav className="mode-tabs" aria-label="Điều hướng chính">{tabs.map((item) => <button key={item} className={`mode-tab ${mode === item ? 'selected' : ''}`} onClick={() => { setMode(item); setMobilePanel(null); }}><span className="tab-dot" />{item}</button>)}</nav>
      <button className="avatar" title="Hồ sơ học tập">V</button>
    </header>

    <div className="mobile-controls"><button onClick={() => setMobilePanel(mobilePanel === 'course' ? null : 'course')}>☷ Khóa học</button><span>{chapter.number} / {lesson.title}</span><button onClick={() => setMobilePanel(mobilePanel === 'notes' ? null : 'notes')}>Ghi chú</button></div>
    <div className="workspace">
      <aside className={`course-sidebar ${mobilePanel === 'course' ? 'mobile-open' : ''}`}>
        <div className="side-heading"><div><span className="eyebrow">LỘ TRÌNH CỦA BẠN</span><h2>Redis Deep Dive</h2></div><span className="course-badge">11 CH</span></div>
        <div className="course-progress"><div className="progress-label"><span>TIẾN ĐỘ</span><b>{saved.completedLessonIds.length} / 61</b></div><div className="progress-track"><i style={{ width: `${percentage}%` }} /></div><span className="progress-caption">{percentage}% hoàn thành</span></div>
        <div className="chapter-list">{groupedLessons.map((item) => <section className="chapter" key={item.id}>
          <button className={`chapter-toggle ${item.id === chapter.id ? 'chapter-current' : ''}`} onClick={() => setExpanded((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} aria-expanded={expanded.includes(item.id)}><span className="chapter-number">{item.number}</span><span className="chapter-title-wrap"><b>{item.name}</b><small>{item.subtitle}</small></span><span className="chapter-count">{item.lessons.length}<span className={`chevron ${expanded.includes(item.id) ? 'open' : ''}`}>⌄</span></span></button>
          {expanded.includes(item.id) && <div className="lesson-list">{item.lessons.map((entry, index) => <button key={entry.id} className={`lesson-item ${lesson.id === entry.id ? 'lesson-selected' : ''}`} onClick={() => selectLesson(entry)}><span className={`lesson-status ${saved.completedLessonIds.includes(entry.id) ? 'done' : ''}`}>{saved.completedLessonIds.includes(entry.id) ? <Icon name="check" /> : String(index + 1).padStart(2, '0')}</span><span>{entry.title}</span>{entry.simulation && <span className="lesson-live">LAB</span>}</button>)}</div>}
        </section>)}</div>
        <div className="sidebar-foot"><span>✦</span> HỌC THEO NHỊP ĐỘ CỦA BẠN</div>
      </aside>

      <main className="lesson-main">
        <div className="breadcrumb"><span>CURRICULUM</span><span>/</span><span>{chapter.number} · {chapter.name.toUpperCase()}</span><span>/</span><span className="breadcrumb-current">LESSON {String(chapter.lessons.indexOf(lesson) + 1).padStart(2, '0')}</span><span className="breadcrumb-spacer" /><span className="local-chip"><i /> ĐÃ LƯU CỤC BỘ</span></div>
        {mode === 'Học' && <>
          <section className="lesson-heading"><div className="lesson-tag"><span>✳</span> {simulation ? 'INTERACTIVE SIMULATION' : 'LESSON BRIEF'} <i>·</i> {chapter.number}.{String(chapter.lessons.indexOf(lesson) + 1).padStart(2, '0')}</div><h1>{lesson.title}</h1><p>{lesson.brief}</p></section>
          {content && <article className="lesson-reading" aria-label={`Kiến thức bài học: ${lesson.title}`}>
            <div className="reading-intro"><span className="reading-label">KIẾN THỨC CỐT LÕI</span><p>{content.overview}</p></div>
            <div className="reading-grid">
              <section className="reading-block"><h2>Khái niệm và cơ chế</h2><p>{content.explanation}</p></section>
              <section className="reading-block"><h2>Áp dụng trong hệ thống</h2><p>{content.application}</p></section>
            </div>
            <section className="reading-example"><div><span className="reading-label">VÍ DỤ</span><p>{content.example}</p></div><ul>{content.takeaways.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <details className="reading-check"><summary>Tự kiểm tra: {content.question}</summary><p>{content.answer}</p></details>
            {content.source && <a className="reading-source" href={content.source.url} target="_blank" rel="noreferrer">Tài liệu tham khảo: {content.source.label} ↗</a>}
          </article>}
          <section className="simulation-card">
            <div className="simulation-toolbar"><div><span className="live-mark"><i /> LIVE MODEL</span><span className="toolbar-divider">/</span><span>{simulation?.subtitle ?? 'CONCEPT OVERVIEW'}</span></div><div className="simulation-tools"><span className="viewport-label">2D SYSTEM VIEW</span><button className="icon-button" onClick={() => { setStepIndex(0); setPlaying(false); }} aria-label="Khởi động lại mô phỏng"><Icon name="refresh" /></button></div></div>
            <div className="simulation-title"><div><span className="eyebrow">SYSTEM FLOW · {lesson.simulation ? simulation?.id.toUpperCase() : 'LEARNING NOTE'}</span><h2>{simulation ? simulation.title : lesson.title}</h2></div><span className="diagram-status"><i /> STATE {String(stepIndex + 1).padStart(2, '0')}</span></div>
            <div className="diagram-area">{simulation && step ? <FlowDiagram lesson={lesson} step={step} stepIndex={stepIndex} /> : <div className="brief-board"><div className="brief-orbit orbit-a"/><div className="brief-orbit orbit-b"/><div className="brief-core">REDIS<span>IN MEMORY</span></div><div className="brief-node brief-client">CLIENT<small>request</small></div><div className="brief-node brief-api">API<small>application</small></div><div className="brief-node brief-db">DATABASE<small>source of truth</small></div><div className="brief-caption">Khái niệm và luồng chính của bài học</div></div>}</div>
            <div className="sim-bottom"><div className="legend"><span><i className="legend-cream" /> SERVICE</span><span><i className="legend-blue" /> CACHE</span><span><i className="legend-yellow" /> ACTIVE FLOW</span><span className="legend-note">MÔ HÌNH MINH HỌA · KHÔNG PHẢI BENCHMARK</span></div><div className="step-count">STEP <b>{String(stepIndex + 1).padStart(2, '0')}</b><span>/ {String(simulation?.steps.length ?? 1).padStart(2, '0')}</span></div></div>
          </section>
          <section className="timeline-card"><div className="timeline-head"><div><span className="eyebrow">REQUEST TIMELINE</span><h3>{step?.title ?? 'Khái niệm chính'}</h3></div><div className="timeline-actions"><button className="control-button" onClick={() => { setStepIndex(0); setPlaying(false); }}><Icon name="refresh" /> BẮT ĐẦU LẠI</button><button className="control-button" onClick={() => setPlaying((current) => !current)}><Icon name={playing ? 'pause' : 'playSmall'} /> {playing ? 'TẠM DỪNG' : 'TỰ CHẠY'}</button><button className="step-button" onClick={() => setStepIndex((i) => Math.max(0, i - 1))} disabled={!simulation || stepIndex === 0} aria-label="Bước trước"><Icon name="back" /></button><button className="step-button" onClick={() => setStepIndex((i) => Math.min((simulation?.steps.length ?? 1) - 1, i + 1))} disabled={!simulation || stepIndex >= (simulation?.steps.length ?? 1) - 1} aria-label="Bước tiếp"><Icon name="next" /></button></div></div>
            {simulation ? <><div className="timeline-track">{simulation.steps.map((item, index) => <button key={item.title} className={`timeline-point ${index < stepIndex ? 'visited' : ''} ${index === stepIndex ? 'current' : ''}`} onClick={() => { setStepIndex(index); setPlaying(false); }} title={item.title}><i /><span>{String(index + 1).padStart(2, '0')}</span></button>)}</div><div className="event-row"><span className="event-icon">↗</span><code>{step?.event}</code><span className="event-description">{step?.description}</span></div></> : <div className="lesson-takeaway"><span className="event-icon">✦</span><span>{content?.takeaways[0]}</span><button onClick={markComplete} className="complete-button"><Icon name="check" /> {saved.completedLessonIds.includes(lesson.id) ? 'ĐÃ HOÀN THÀNH' : 'ĐÁNH DẤU HOÀN THÀNH'}</button></div>}
          </section>
        </>}

        {mode === 'Luyện tập' && <section className="mode-page"><div className="lesson-tag"><span>✳</span> KNOWLEDGE CHECK · 03 QUESTIONS</div><h1>Luyện tập theo bài mẫu</h1><p>Kiểm tra nhanh cách hiểu về Cache-aside, TTL và Cache Stampede.</p><div className="quiz-card"><div className="quiz-counter">CÂU {quizIndex + 1} / {quizzes.length}</div><h2>{quizzes[quizIndex].question}</h2><div className="quiz-options">{quizzes[quizIndex].choices.map((choice, index) => <button key={choice} className={`quiz-option ${quizChoice === index ? 'chosen' : ''} ${quizChoice !== null && index === quizzes[quizIndex].answer ? 'correct' : ''}`} onClick={() => setQuizChoice(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}{quizChoice !== null && index === quizzes[quizIndex].answer && <Icon name="check" />}</button>)}</div>{quizChoice !== null && <div className="quiz-explanation"><b>{quizChoice === quizzes[quizIndex].answer ? 'Chính xác.' : 'Hãy nhớ điểm này.'}</b> {quizzes[quizIndex].explain}</div>}<button className="primary-button" disabled={quizChoice === null} onClick={() => { if (quizIndex < quizzes.length - 1) { setQuizIndex((i) => i + 1); setQuizChoice(null); } else { setQuizIndex(0); setQuizChoice(null); markComplete(); } }}>{quizIndex === quizzes.length - 1 ? 'HOÀN TẤT LUYỆN TẬP' : 'CÂU TIẾP THEO'} <Icon name="next" /></button></div><button className="text-button" onClick={() => setMode('Học')}>← Quay lại bài học</button></section>}

        {mode === 'Phòng thiết kế' && <section className="mode-page"><div className="lesson-tag"><span>✳</span> DESIGN ROOM · SANDBOX</div><h1>Phòng thiết kế</h1><p>Thử thay đổi luồng cache để xem node và trạng thái hệ thống thay đổi như thế nào.</p><div className="design-controls"><label><input type="checkbox" checked={designHit} onChange={(event) => setDesignHit(event.target.checked)} /> Bật Cache Hit</label><label><input type="checkbox" checked={designTtl} onChange={(event) => setDesignTtl(event.target.checked)} /> Gắn TTL cho key</label><span>CONFIGURATION · LOCAL ONLY</span></div><div className="simulation-card design-preview"><div className="simulation-toolbar"><div><span className="live-mark"><i /> PREVIEW</span><span className="toolbar-divider">/</span><span>CLIENT → API → REDIS → DATABASE</span></div></div><FlowDiagram lesson={{ ...lesson, simulation: designHit ? 'request' : 'ttl' }} step={{ title: 'Thiết kế', description: '', event: '', activeNodes: designHit ? ['client', 'api', 'redis'] : ['client', 'api', 'redis', 'database'], packet: 0, facts: [] }} stepIndex={designTtl ? 4 : 2} /></div><div className="design-readout"><b>{designHit ? '✓ Cache Hit đang bật' : '↗ Cache Miss chuyển luồng tới Database'}</b><span>{designTtl ? 'Key được cấp TTL để giới hạn thời gian lưu.' : 'Key không được gắn thời hạn trong bản thiết kế này.'}</span></div></section>}

        {mode === 'Tóm tắt' && <section className="mode-page"><div className="lesson-tag"><span>✳</span> LEARNING SUMMARY · LOCAL PROGRESS</div><h1>Tiến độ học tập</h1><p>Tiến độ được lưu trong trình duyệt này và không đồng bộ sang thiết bị khác.</p><div className="summary-hero"><div className="summary-number">{percentage}<small>%</small></div><div><span className="eyebrow">REDIS DEEP DIVE</span><h2>{saved.completedLessonIds.length} / {lessons.length} bài đã hoàn thành</h2><p>{chapters.length} chương · 3 mô phỏng tương tác · Lưu cục bộ</p></div></div><div className="summary-grid">{chapters.map((item) => { const completed = item.lessons.filter((entry) => saved.completedLessonIds.includes(entry.id)).length; return <button key={item.id} className="summary-chapter" onClick={() => { setExpanded((current) => current.includes(item.id) ? current : [...current, item.id]); selectLesson(item.lessons[0]); }}><span>{item.number}</span><b>{item.name}</b><small>{completed} / {item.lessons.length} bài</small><i><em style={{ width: `${Math.round(completed / item.lessons.length * 100)}%` }} /></i></button>; })}</div><button className="text-button" onClick={() => setMode('Học')}>← Tiếp tục bài học</button></section>}
      </main>

      <aside className={`notes-panel ${mobilePanel === 'notes' ? 'mobile-open' : ''}`}><div className="notes-header"><div><span className="eyebrow">KNOWLEDGE PANEL</span><h2>Ghi chú bài học</h2></div><button className="icon-button notes-close" onClick={() => setMobilePanel(null)} aria-label="Đóng ghi chú">×</button></div><div className="notes-context"><span className="notes-context-icon">✳</span><div><b>{chapter.number} · {chapter.name}</b><small>{lesson.title}</small></div></div>
        <div className="note-section"><span className="note-kicker">TÓM TẮT</span><p>{step?.description ?? content?.overview ?? lesson.brief}</p></div>
        <div className="note-section"><span className="note-kicker">ĐIỂM CẦN NHỚ</span><ul>{(simulation?.notes ?? content?.takeaways ?? []).map((note) => <li key={note}>{note}</li>)}</ul></div>
        <div className="note-callout"><span>✦</span><div><b>{step ? 'Trong bước này' : 'Ví dụ ứng dụng'}</b><p>{step?.facts.join(' ') ?? content?.example}</p></div></div>
        <div className="key-value-card"><span className="note-kicker">EVENT TRACE</span><code>{step?.event ?? 'LESSON BRIEF · NO REDIS CONNECTION'}</code><small>SIMULATION DATA · LOCAL</small></div>
        <div className="notes-footer"><span><i /> TIẾN ĐỘ TỰ ĐỘNG LƯU</span><button onClick={markComplete}><Icon name="check" /> {saved.completedLessonIds.includes(lesson.id) ? 'Đã lưu bài' : 'Hoàn thành bài'}</button></div>
      </aside>
    </div>
    <footer className="statusbar"><span><i className="status-green" /> LOCAL ENVIRONMENT <b>·</b> NO REDIS CONNECTION</span><span>{lessons.length} LESSONS <b>·</b> 11 CHAPTERS <b>·</b> 3 INTERACTIVE MODELS</span><span>REDIS DEEP DIVE <b>© 2026</b></span></footer>
  </div>;
}
