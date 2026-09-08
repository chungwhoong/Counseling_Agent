import { NextRequest, NextResponse } from "next/server";
import { NvidiaTextClient } from "@/infrastructure/ai/NvidiaTextClient";

export const maxDuration = 60;
import { GenerateCounselingMemo } from "@/application/use-cases/GenerateCounselingMemo";
import { logger } from "@/infrastructure/logger";
import { env } from "@/config/env";
import type { CounselingMemoRequest } from "@/domain/entities/CounselingMemo";

export async function POST(request: NextRequest) {
  try {
    const body: CounselingMemoRequest = await request.json();

    if (!body.studentName?.trim()) {
      return NextResponse.json({ error: "학생명이 필요합니다." }, { status: 400 });
    }

    const aiClient = new NvidiaTextClient(env.nvidiaApiKey);
    const useCase = new GenerateCounselingMemo(aiClient);
    const memo = await useCase.execute(body);

    return NextResponse.json(memo);
  } catch (error) {
    logger.error("Counseling memo generation failed", error);
    const message = error instanceof Error ? error.message : "상담 멘트 생성에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
