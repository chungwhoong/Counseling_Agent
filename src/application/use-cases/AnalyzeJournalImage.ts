import type { JournalAnalysis } from "@/domain/entities/JournalAnalysis";
import type { IAIVisionClient } from "@/domain/repositories/IAIClient";
import type { ICounselingRepository } from "@/domain/repositories/ICounselingRepository";

export class AnalyzeJournalImage {
  constructor(
    private readonly aiClient: IAIVisionClient,
    private readonly repository?: ICounselingRepository,
  ) {}

  async execute(imageBase64: string, mimeType: string): Promise<JournalAnalysis> {
    const analysis = await this.aiClient.analyzeJournalImage(imageBase64, mimeType);

    if (this.repository) {
      return this.repository.saveJournalAnalysis(analysis);
    }

    return analysis;
  }
}
