"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Brain, MessageSquare, Lightbulb, RefreshCw } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { Card } from "@/presentation/components/ui/Card";
import { ImageUploader } from "@/presentation/components/features/ImageUploader";
import { ResultCard } from "@/presentation/components/features/ResultCard";
import { ErrorBoundary } from "@/presentation/components/ErrorBoundary";
import type { JournalAnalysis } from "@/domain/entities/JournalAnalysis";

const LOADING_MESSAGES = [
  "상담일지를 읽고 있습니다...",
  "학생의 고민을 분석하고 있습니다...",
  "심리적 상태를 파악하고 있습니다...",
  "해결 멘트를 작성하고 있습니다...",
];

export default function JournalAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [result, setResult] = useState<JournalAnalysis | null>(null);
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
      const res = await fetch("/api/journal-analysis", { method: "POST", body: formData });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error ?? "분석 실패"); }
      const data: JournalAnalysis = await res.json();
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
            <p className="text-sm text-slate-400 mb-1">홈 &gt; 상담일지 분석</p>
            <h1 className="text-2xl font-bold text-primary mb-1">상담일지 분석</h1>
            <p className="text-slate-500 text-sm">상담일지 사진을 업로드하면 학생의 고민을 분석하고 해결 멘트를 생성합니다</p>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="mb-4">
              <ImageUploader onFileSelect={setFile} />
            </Card>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <Button type="submit" size="lg" loading={loading} disabled={!file} className="w-full">
              {loading ? LOADING_MESSAGES[loadingMsg] : "상담일지 분석 시작 →"}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                <Card>
                  <div className="flex items-center gap-2 text-primary mb-3">
                    <BookOpen className="w-5 h-5" />
                    <h3 className="font-semibold">주요 고민</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{result.mainConcerns}</p>
                </Card>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <Card>
                  <div className="flex items-center gap-2 text-purple-600 mb-3">
                    <Brain className="w-5 h-5" />
                    <h3 className="font-semibold">심리적 상태</h3>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{result.psychologicalState}</p>
                </Card>
              </motion.div>
            </div>

            <ResultCard
              title="상담 멘트"
              badge="학생 상담 시 활용"
              icon={<MessageSquare className="w-5 h-5" />}
              content={result.counselingMemo}
              delay={0.15}
            />
            <ResultCard
              title="후속 상담 포인트"
              badge="다음 상담 시 확인 사항"
              icon={<Lightbulb className="w-5 h-5" />}
              content={result.followUpPoints}
              delay={0.25}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
