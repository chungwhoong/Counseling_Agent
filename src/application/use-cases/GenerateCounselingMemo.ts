import type { CounselingMemoRequest, CounselingMemo } from "@/domain/entities/CounselingMemo";
import type { IAITextClient } from "@/domain/repositories/IAIClient";
import type { ICounselingRepository } from "@/domain/repositories/ICounselingRepository";

export class GenerateCounselingMemo {
  constructor(
    private readonly aiClient: IAITextClient,
    private readonly repository?: ICounselingRepository,
  ) {}

  async execute(request: CounselingMemoRequest): Promise<CounselingMemo> {
    const memo = await this.aiClient.generateCounselingMemo(request);

    if (this.repository) {
      return this.repository.saveMemo(memo);
    }

    return memo;
  }
}
