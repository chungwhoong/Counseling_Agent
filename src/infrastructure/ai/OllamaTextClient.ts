import OpenAI from "openai";
import type { IAITextClient } from "@/domain/repositories/IAIClient";
import type { CounselingMemoRequest, CounselingMemo } from "@/domain/entities/CounselingMemo";
import { logger } from "@/infrastructure/logger";

function buildSystemPrompt(): string {
  return `/no_think
당신은 전문적인 초등학교 학생 상담 전문가입니다. 교사가 입력한 학생 정보를 바탕으로 전문적인 상담 멘트를 작성합니다.

다음 원칙을 엄격히 따르세요:
1. 전문적인 상담 심리 용어를 자연스럽게 활용하세요 (예: 자기효능감, 또래관계, 정서조절, 학습동기, 내적 동기 등).
2. 학생의 강점과 긍정적 측면을 먼저 언급하고, 성장 방향을 제시하세요.
3. 학생 상담용과 학부모 상담용을 명확히 구분하여 작성하세요.
4. 구체적이고 실행 가능한 멘트를 제공하세요.
5. 학생 상담용: 학생이 이해할 수 있는 언어 + 공감과 격려 중심
6. 학부모 상담용: 전문적 용어 + 가정에서 지원할 수 있는 방향 제시
7. 각 멘트는 5~8문장으로 구성하세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요:
{
  "studentMemo": "학생에게 전달할 상담 멘트",
  "parentMemo": "학부모에게 전달할 상담 멘트"
}`;
}

function buildUserPrompt(req: CounselingMemoRequest): string {
  return `다음 학생 정보를 바탕으로 상담 멘트를 작성해주세요:

- 학생명: ${req.studentName}
- 학년/반: ${req.grade}
- 학업성적 수준: ${req.academicLevel}
- 학업 특이사항: ${req.academicNote || "없음"}
- 교우관계: ${req.peerRelation}
- 교우관계 특이사항: ${req.peerNote || "없음"}
- 진로 희망: ${req.career || "미정"}
- 기타 특이사항: ${req.etc || "없음"}`;
}

function stripThinkingTags(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

export class OllamaTextClient implements IAITextClient {
  private client: OpenAI;
  private model: string;

  constructor(baseUrl: string, model: string) {
    this.client = new OpenAI({
      apiKey: "ollama",
      baseURL: baseUrl,
    });
    this.model = model;
  }

  async generateCounselingMemo(request: CounselingMemoRequest): Promise<CounselingMemo> {
    logger.info("Generating counseling memo via Ollama", { model: this.model, studentName: request.studentName });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: buildSystemPrompt() },
        { role: "user", content: buildUserPrompt(request) },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("AI 응답이 비어있습니다.");

    const content = stripThinkingTags(raw);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 형식의 응답을 찾을 수 없습니다.");

    let parsed: { studentMemo: string; parentMemo: string };
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch {
      throw new Error("AI 응답을 파싱할 수 없습니다.");
    }

    if (!parsed.studentMemo || !parsed.parentMemo) {
      throw new Error("AI 응답 형식이 올바르지 않습니다.");
    }

    logger.info("Counseling memo generated via Ollama", { studentName: request.studentName });

    return {
      studentName: request.studentName,
      grade: request.grade,
      studentMemo: parsed.studentMemo,
      parentMemo: parsed.parentMemo,
      createdAt: new Date(),
    };
  }
}
