import OpenAI from "openai";
import type { IAIVisionClient } from "@/domain/repositories/IAIClient";
import type { ExamAnalysis } from "@/domain/entities/ExamAnalysis";
import type { JournalAnalysis } from "@/domain/entities/JournalAnalysis";
import { logger } from "@/infrastructure/logger";

const EXAM_SYSTEM_PROMPT = `/no_think
당신은 초등학교 교육 전문가이자 학습 상담가입니다.
업로드된 시험지 이미지를 분석하여 학생의 성취 수준과 향상 방향을 파악합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요:
{
  "achievementLevel": "상 또는 중 또는 하",
  "achievementScore": "예상 점수 또는 성취율 (예: 70~80%)",
  "errorPatterns": "주요 오답 패턴 설명 (2~3가지)",
  "weakAreas": "취약한 영역 또는 단원 (2~3가지)",
  "improvementDirection": "성적 향상을 위한 구체적 학습 방향 (3~4문장)",
  "counselingMemo": "교사가 학생/학부모 상담 시 활용할 멘트 (4~6문장, 전문 상담 용어 포함)"
}`;

const JOURNAL_SYSTEM_PROMPT = `/no_think
당신은 초등학교 학생 상담 전문가입니다.
업로드된 학생의 상담일지 또는 생활기록 이미지를 분석하여 학생의 고민과 심리 상태를 파악합니다.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요:
{
  "mainConcerns": "학생의 주요 고민 요약 (2~3가지)",
  "psychologicalState": "학생의 현재 심리적 상태 분석 (전문 용어 포함, 3~4문장)",
  "counselingMemo": "고민 해결을 위한 상담 멘트 (5~7문장, 공감과 해결책 포함)",
  "followUpPoints": "후속 상담 시 주의사항 및 집중 포인트 (2~3가지)"
}`;

function stripThinkingTags(content: string): string {
  return content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
}

export class OllamaVisionClient implements IAIVisionClient {
  private client: OpenAI;
  private model: string;

  constructor(baseUrl: string, model: string) {
    this.client = new OpenAI({
      apiKey: "ollama",
      baseURL: baseUrl,
    });
    this.model = model;
  }

  async analyzeExamImage(imageBase64: string, mimeType: string): Promise<ExamAnalysis> {
    logger.info("Analyzing exam image via Ollama", { model: this.model });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: EXAM_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
            {
              type: "text",
              text: "이 시험지를 분석하여 학생의 성취수준과 상담 멘트를 작성해주세요. 한국어로 답변해주세요.",
            },
          ],
        },
      ],
      temperature: 0.6,
      max_tokens: 1500,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("AI 응답이 비어있습니다.");

    return this.parseExamResponse(stripThinkingTags(raw));
  }

  async analyzeJournalImage(imageBase64: string, mimeType: string): Promise<JournalAnalysis> {
    logger.info("Analyzing journal image via Ollama", { model: this.model });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: JOURNAL_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
            {
              type: "text",
              text: "이 상담일지를 분석하여 학생의 고민과 해결 방향을 작성해주세요. 한국어로 답변해주세요.",
            },
          ],
        },
      ],
      temperature: 0.6,
      max_tokens: 1500,
    });

    const raw = response.choices[0]?.message?.content;
    if (!raw) throw new Error("AI 응답이 비어있습니다.");

    return this.parseJournalResponse(stripThinkingTags(raw));
  }

  private parseExamResponse(content: string): ExamAnalysis {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 형식의 응답을 찾을 수 없습니다.");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      achievementLevel: parsed.achievementLevel ?? "중",
      achievementScore: parsed.achievementScore ?? "",
      errorPatterns: parsed.errorPatterns ?? "",
      weakAreas: parsed.weakAreas ?? "",
      improvementDirection: parsed.improvementDirection ?? "",
      counselingMemo: parsed.counselingMemo ?? "",
      createdAt: new Date(),
    };
  }

  private parseJournalResponse(content: string): JournalAnalysis {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 형식의 응답을 찾을 수 없습니다.");

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      mainConcerns: parsed.mainConcerns ?? "",
      psychologicalState: parsed.psychologicalState ?? "",
      counselingMemo: parsed.counselingMemo ?? "",
      followUpPoints: parsed.followUpPoints ?? "",
      createdAt: new Date(),
    };
  }
}
