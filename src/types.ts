export type Lesson = {
  id: string;
  chapterId: string;
  title: string;
  brief: string;
  simulation?: 'request' | 'ttl' | 'stampede';
};

export type Chapter = { id: string; number: string; name: string; subtitle: string; lessons: Lesson[] };
export type LearningMode = 'Học' | 'Luyện tập' | 'Phòng thiết kế' | 'Tóm tắt';
export type LessonProgress = { selectedLessonId: string; completedLessonIds: string[] };
export type SimulationStep = { title: string; description: string; event: string; activeNodes: string[]; packet: number; facts: string[] };
