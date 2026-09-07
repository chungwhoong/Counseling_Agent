import type { CounselingMemo } from "../entities/CounselingMemo";
import type { ExamAnalysis } from "../entities/ExamAnalysis";
import type { JournalAnalysis } from "../entities/JournalAnalysis";

export interface ICounselingRepository {
  saveMemo(memo: CounselingMemo): Promise<CounselingMemo>;
  saveExamAnalysis(analysis: ExamAnalysis): Promise<ExamAnalysis>;
  saveJournalAnalysis(analysis: JournalAnalysis): Promise<JournalAnalysis>;
  getRecentMemos(limit?: number): Promise<CounselingMemo[]>;
}
