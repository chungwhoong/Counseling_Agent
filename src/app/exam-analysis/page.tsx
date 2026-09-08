"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ScanLine, TrendingUp, AlertTriangle, Target, MessageSquare, RefreshCw } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { Card } from "@/presentation/components/ui/Card";
import { ImageUploader } from "@/presentation/components/features/ImageUploader";
import { ResultCard } from "@/presentation/components/features/ResultCard";
import { ErrorBoundary } from "@/presentation/components/ErrorBoundary";
import type { ExamAnalysis } from "@/domain/entities/ExamAnalysis";
import { clsx } from "clsx";

const LOADING_MESSAGES = [
  "이미지를 읽고 있습니다...",
  "답안을 분석하고 있습니다...",
  "오답 패턴을 파악하고 있습니다...",
  "상담 멘트를 작성하고 있습니다...",
];

const LEVEL_COLORS = {
  상: "bg-emerald-100 text-emerald-700 border-emerald-200",
  중: "bg-yellow-100 text-yellow-700 border-yellow-200",
  하: "bg-red-100 text-red-700 border-red-200",
};

export default function ExamAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [result, setResult] = useState<ExamAnalysis | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setError("이미지를 선택해주세요."); return; }
    setError("");
    setLoading(true);
    setResult(null);
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(msgIdx);
    }, 4000);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/exam-analysis", { method: "POST", body: formData });
      if (!res.ok) { let m = `서버 오류 (${res.status})`; try { const d = await res.json(); m = d.error ?? m; } catch {} throw new Error(m); }
      const data: ExamAnalysis = await res.json();
      setResult(data);
      setTimeout(() => document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      clearInterval(interval);
      setLoading(false);
      setLoadingMsg(0);
    }
  };

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="mb-8">
            <p className="text-sm text-slate-400 mb-1">홈 &gt; 시험지 분석</p>
            <h1 className="text-2xl font-bold text-primary mb-1">시험지 이미지 분석</h1>
            <p className="text-slate-500 text-sm">시험지 사진을 업로드하면 성취수준과 향상 방향을 분석합니다</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="mb-4">
              <ImageUploader onFileSelect={setFile} />
            </Card>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <Button type="submit" size="lg" loading={loading} disabled={!file} className="w-full">
              {loading ? LOADING_MESSAGES[loadingMsg] : "시험지 분석 시작 →"}
            </Button>
            {!loading && <p className="text-xs text-slate-400 text-center mt-2">약 20~30초 소요됩니다</p>}
          </form>
        </motion.div>

        {result && (
          <div id="result-section" className="mt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">분석 결과</h2>
              <button onClick={() => { setResult(null); setFile(null); }} className="text-sm text-slate-400 hover:text-accent flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> 다시 분석
              </button>
            </div>

            {/* Achievement Level */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <Card className="text-center">
                <p className="text-sm text-slate-500 mb-2">전체 성취수준</p>
                <span className={clsx("inline-block text-3xl font-bold px-6 py-2 rounded-xl border-2", LEVEL_COLORS[result.achievementLevel])}>
                  {result.achievementLevel}
                </span>
                {result.achievementScore && (
                  <p className="text-slate-500 text-sm mt-2">{result.achievementScore}</p>
                )}
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <Card>
                  <div className="flex items-center gap-2 text-amber-600 mb-3">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-semibold">오답 패턴</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{result.errorPatterns}</p>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                <Card>
                  <div className="flex items-center gap-2 text-red-500 mb-3">
                    <Target className="w-5 h-5" />
                    <h3 className="font-semibold">취약 영역</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{result.weakAreas}</p>
                </Card>
              </motion.div>
            </div>

            <ResultCard
              title="학습 향상 방향"
              icon={<TrendingUp className="w-5 h-5" />}
              content={result.improvementDirection}
              delay={0.2}
            />
            <ResultCard
              title="상담 멘트"
              badge="학생/학부모 상담 시 활용"
              icon={<MessageSquare className="w-5 h-5" />}
              content={result.counselingMemo}
              delay={0.3}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
