export type AchievementLevel = "상" | "중" | "하";

export interface ExamAnalysis {
  id?: string;
  achievementLevel: AchievementLevel;
  achievementScore: string;
  errorPatterns: string;
  weakAreas: string;
  improvementDirection: string;
  counselingMemo: string;
  createdAt?: Date;
}
