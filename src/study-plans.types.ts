export interface StudyPlan {
  id: number;
  title: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  done: boolean;
  focusMinutes: number;
  createdAt: string;
}
