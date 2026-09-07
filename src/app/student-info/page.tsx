"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Users, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { Card } from "@/presentation/components/ui/Card";
import { ResultCard } from "@/presentation/components/features/ResultCard";
import { ErrorBoundary } from "@/presentation/components/ErrorBoundary";
import type { CounselingMemo } from "@/domain/entities/CounselingMemo";
import type { AcademicLevel, PeerRelation } from "@/domain/entities/Student";

const GRADES = ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"];
const CLASSES = ["1반", "2반", "3반", "4반", "5반", "6반"];
const ACADEMIC_LEVELS: AcademicLevel[] = ["상", "중상", "중", "중하", "하"];
const PEER_RELATIONS: PeerRelation[] = ["원만", "보통", "어려움"];

const LOADING_MESSAGES = [
  "학생 정보를 분석하고 있습니다...",
  "전문 상담 멘트를 작성하고 있습니다...",
  "학부모 상담 멘트를 구성하고 있습니다...",
  "거의 완성되었습니다...",
];

export default function StudentInfoPage() {
  const [form, setForm] = useState({
    studentName: "",
    grade: "",
    classNum: "",
    academicLevel: "" as AcademicLevel | "",
    academicNote: "",
    peerRelation: "" as PeerRelation | "",
    peerNote: "",
    career: "",
    etc: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [result, setResult] = useState<CounselingMemo | null>(null);
  const [error, setError] = useState("");

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName.trim() || !form.grade || !form.classNum || !form.academicLevel || !form.peerRelation) {
      setError("필수 항목(*)을 모두 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    let msgIdx = 0;
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(msgIdx);
    }, 3000);

    try {
      const response = await fetch("/api/counseling", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: form.studentName,
          grade: `${form.grade} ${form.classNum}`,
          academicLevel: form.academicLevel,
          academicNote: form.academicNote,
          peerRelation: form.peerRelation,
          peerNote: form.peerNote,
          career: form.career,
          etc: form.etc,
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "서버 오류가 발생했습니다.");
      }
      const data: CounselingMemo = await response.json();
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

  const RadioGroup = ({ name, options, value, onChange }: { name: string; options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
            value === opt
              ? "border-accent bg-accent text-white"
              : "border-slate-200 text-slate-600 hover:border-accent/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Header */}
          <div className="mb-8">
            <p className="text-sm text-slate-400 mb-1">홈 &gt; 학생 상담 멘트</p>
            <h1 className="text-2xl font-bold text-primary mb-1">학생 상담 멘트 생성</h1>
            <p className="text-slate-500 text-sm">학생 정보를 입력하면 학생용·학부모용 상담 멘트를 생성합니다</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card className="space-y-6 mb-4">
              {/* 기본 정보 */}
              <section className="space-y-4">
                <h2 className="font-semibold text-slate-700 border-b border-slate-100 pb-2">기본 정보</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">학생명 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.studentName}
                    onChange={(e) => set("studentName", e.target.value)}
                    placeholder="홍길동"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "학년", field: "grade", opts: GRADES },
                    { label: "반", field: "classNum", opts: CLASSES },
                  ].map(({ label, field, opts }) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label} <span className="text-red-500">*</span></label>
                      <select
                        value={form[field as keyof typeof form]}
                        onChange={(e) => set(field, e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/40"
                      >
                        <option value="">선택</option>
                        {opts.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </section>

              {/* 학업 현황 */}
              <section className="space-y-4">
                <h2 className="font-semibold text-slate-700 border-b border-slate-100 pb-2">학업 현황</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">학업성적 수준 <span className="text-red-500">*</span></label>
                  <RadioGroup
                    name="academicLevel"
                    options={ACADEMIC_LEVELS}
                    value={form.academicLevel}
                    onChange={(v) => set("academicLevel", v)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">학업 특이사항</label>
                  <textarea
                    value={form.academicNote}
                    onChange={(e) => set("academicNote", e.target.value)}
                    placeholder="예: 수학 분수 개념을 어려워하며, 국어 독해는 우수함"
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                  />
                </div>
              </section>

              {/* 교우관계 */}
              <section className="space-y-4">
                <h2 className="font-semibold text-slate-700 border-b border-slate-100 pb-2">교우관계</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">교우관계 <span className="text-red-500">*</span></label>
                  <RadioGroup
                    name="peerRelation"
                    options={PEER_RELATIONS}
                    value={form.peerRelation}
                    onChange={(v) => set("peerRelation", v)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">교우관계 특이사항</label>
                  <textarea
                    value={form.peerNote}
                    onChange={(e) => set("peerNote", e.target.value)}
                    placeholder="예: 특정 친구와 갈등 상황, 소극적 성향"
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                  />
                </div>
              </section>

              {/* 진로 및 기타 */}
              <section className="space-y-4">
                <h2 className="font-semibold text-slate-700 border-b border-slate-100 pb-2">진로 및 기타</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">진로 희망</label>
                  <input
                    type="text"
                    value={form.career}
                    onChange={(e) => set("career", e.target.value)}
                    placeholder="예: 과학자, 선생님"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">기타 특이사항</label>
                  <textarea
                    value={form.etc}
                    onChange={(e) => set("etc", e.target.value)}
                    placeholder="예: 가정환경, 건강 상태 등"
                    rows={2}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                  />
                </div>
              </section>
            </Card>

            {error && (
              <p className="text-red-500 text-sm mb-3 px-1">{error}</p>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              {loading ? LOADING_MESSAGES[loadingMsg] : "AI 상담 멘트 생성하기 →"}
            </Button>
            {!loading && <p className="text-xs text-slate-400 text-center mt-2">약 10~20초 소요됩니다</p>}
          </form>
        </motion.div>

        {/* Result */}
        {result && (
          <div id="result-section" className="mt-10 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">생성된 상담 멘트</h2>
              <button onClick={() => setResult(null)} className="text-sm text-slate-400 hover:text-accent flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> 다시 입력
              </button>
            </div>
            <ResultCard
              title="학생 상담용 멘트"
              badge="학생에게 직접 전달"
              icon={<User className="w-5 h-5" />}
              content={result.studentMemo}
              delay={0}
            />
            <ResultCard
              title="학부모 상담용 멘트"
              badge="학부모 면담용"
              icon={<Users className="w-5 h-5" />}
              content={result.parentMemo}
              delay={0.15}
            />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
