import { describe, it, expect, vi } from "vitest";
import { GenerateCounselingMemo } from "@/application/use-cases/GenerateCounselingMemo";
import type { IAITextClient } from "@/domain/repositories/IAIClient";
import type { CounselingMemo, CounselingMemoRequest } from "@/domain/entities/CounselingMemo";

const mockMemo: CounselingMemo = {
  studentName: "홍길동",
  grade: "3학년 2반",
  studentMemo: "홍길동 학생은 자기효능감이 높으며...",
  parentMemo: "홍길동 학부모님께, 자녀의 학업 발달 상황을...",
};

const mockRequest: CounselingMemoRequest = {
  studentName: "홍길동",
  grade: "3학년 2반",
  academicLevel: "중",
  academicNote: "",
  peerRelation: "원만",
  peerNote: "",
  career: "과학자",
  etc: "",
};

describe("GenerateCounselingMemo", () => {
  it("AI 클라이언트를 통해 상담 멘트를 생성한다", async () => {
    const mockClient: IAITextClient = {
      generateCounselingMemo: vi.fn().mockResolvedValue(mockMemo),
    };

    const useCase = new GenerateCounselingMemo(mockClient);
    const result = await useCase.execute(mockRequest);

    expect(mockClient.generateCounselingMemo).toHaveBeenCalledWith(mockRequest);
    expect(result.studentMemo).toBe(mockMemo.studentMemo);
    expect(result.parentMemo).toBe(mockMemo.parentMemo);
  });

  it("저장소가 있으면 결과를 저장한다", async () => {
    const mockClient: IAITextClient = {
      generateCounselingMemo: vi.fn().mockResolvedValue(mockMemo),
    };
    const mockRepo = {
      saveMemo: vi.fn().mockResolvedValue({ ...mockMemo, id: "test-id" }),
      saveExamAnalysis: vi.fn(),
      saveJournalAnalysis: vi.fn(),
      getRecentMemos: vi.fn(),
    };

    const useCase = new GenerateCounselingMemo(mockClient, mockRepo);
    const result = await useCase.execute(mockRequest);

    expect(mockRepo.saveMemo).toHaveBeenCalledWith(mockMemo);
    expect(result.id).toBe("test-id");
  });

  it("AI 클라이언트 오류 시 에러를 전파한다", async () => {
    const mockClient: IAITextClient = {
      generateCounselingMemo: vi.fn().mockRejectedValue(new Error("API 오류")),
    };

    const useCase = new GenerateCounselingMemo(mockClient);
    await expect(useCase.execute(mockRequest)).rejects.toThrow("API 오류");
  });
});
