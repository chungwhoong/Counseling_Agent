"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MessageSquare, ScanLine, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/presentation/components/ui/Button";
import { Card } from "@/presentation/components/ui/Card";

const MODULES = [
  {
    href: "/student-info",
    icon: <MessageSquare className="w-8 h-8" />,
    badge: "텍스트 입력",
    title: "학생 기본정보 기반 상담 멘트",
    description: "학업, 교우관계, 진로 정보를 입력하면 전문 상담 용어를 활용한 학생용·학부모용 멘트를 즉시 생성합니다.",
  },
  {
    href: "/exam-analysis",
    icon: <ScanLine className="w-8 h-8" />,
    badge: "사진 업로드",
    title: "시험지 이미지 분석",
    description: "시험지 사진을 찍어 업로드하면 AI가 성취수준, 오답 패턴, 향상 방향을 분석하고 상담 멘트를 작성합니다.",
  },
  {
    href: "/journal-analysis",
    icon: <BookOpen className="w-8 h-8" />,
    badge: "사진 업로드",
    title: "상담일지 분석",
    description: "학생의 상담일지 사진을 업로드하면 고민을 분석하고 전문적인 해결 멘트와 후속 상담 포인트를 제안합니다.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary via-[#1a3357] to-[#162b45] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI 기반 상담 도우미
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 leading-tight">
              AI로 더 스마트한<br />학생 상담 준비
            </h1>
            <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              학생 정보 입력, 시험지·상담일지 사진 업로드만으로
              전문적인 상담 멘트를 자동 생성합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/student-info">
                <Button size="lg" className="w-full sm:w-auto">
                  지금 시작하기
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Module Cards */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-bold text-primary mb-2">3가지 AI 상담 도구</h2>
          <p className="text-slate-500">상황에 맞게 선택하여 사용하세요</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.href}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            >
              <Link href={mod.href} className="block group h-full">
                <Card className="h-full hover:shadow-md hover:border-accent/30 transition-all duration-200 group-hover:-translate-y-1">
                  <div className="text-accent mb-4">{mod.icon}</div>
                  <span className="inline-block text-xs font-semibold text-accent bg-accent/10 rounded-full px-3 py-1 mb-3">
                    {mod.badge}
                  </span>
                  <h3 className="font-bold text-primary text-lg mb-2 leading-snug">{mod.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{mod.description}</p>
                  <div className="flex items-center gap-1 text-accent font-medium text-sm">
                    바로 시작
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
