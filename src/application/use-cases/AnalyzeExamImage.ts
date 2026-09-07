import type { ExamAnalysis } from "@/domain/entities/ExamAnalysis";
import type { IAIVisionClient } from "@/domain/repositories/IAIClient";
import type { ICounselingRepository } from "@/domain/repositories/ICounselingRepository";

export class AnalyzeExamImage {
  constructor(
    private readonly aiClient: IAIVisionClient,
    private readonly repository?: ICounselingRepository,
  ) {}

  async execute(imageBase64: string, mimeType: string): Promise<ExamAnalysis> {
    const analysis = await this.aiClient.analyzeExamImage(imageBase64, mimeType);

    if (this.repository) {
      return this.repository.saveExamAnalysis(analysis);
    }

    return analysis;
  }
}
