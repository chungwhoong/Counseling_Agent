import { NextRequest, NextResponse } from "next/server";
import { NvidiaVisionClient } from "@/infrastructure/ai/NvidiaVisionClient";

export const maxDuration = 60;
import { AnalyzeExamImage } from "@/application/use-cases/AnalyzeExamImage";
import { logger } from "@/infrastructure/logger";
import { env } from "@/config/env";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "이미지 파일이 필요합니다." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "JPEG, PNG, WebP 형식만 지원합니다." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "파일 크기는 10MB 이하여야 합니다." }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const imageBase64 = Buffer.from(buffer).toString("base64");

    const aiClient = new NvidiaVisionClient(env.nvidiaApiKey);
    const useCase = new AnalyzeExamImage(aiClient);
    const analysis = await useCase.execute(imageBase64, file.type);

    return NextResponse.json(analysis);
  } catch (error) {
    logger.error("Exam analysis failed", error);
    const message = error instanceof Error ? error.message : "시험지 분석에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
