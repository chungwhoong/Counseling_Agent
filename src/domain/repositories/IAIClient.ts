import type { CounselingMemoRequest, CounselingMemo } from "../entities/CounselingMemo";
import type { ExamAnalysis } from "../entities/ExamAnalysis";
import type { JournalAnalysis } from "../entities/JournalAnalysis";

export interface IAITextClient {
  generateCounselingMemo(request: CounselingMemoRequest): Promise<CounselingMemo>;
}

export interface IAIVisionClient {
  analyzeExamImage(imageBase64: string, mimeType: string): Promise<ExamAnalysis>;
  analyzeJournalImage(imageBase64: string, mimeType: string): Promise<JournalAnalysis>;
}
