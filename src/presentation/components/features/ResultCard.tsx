"use client";

import { useState } from "react";
import { Copy, Check, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../ui/Card";

interface ResultCardProps {
  title: string;
  badge?: string;
  icon?: React.ReactNode;
  content: string;
  delay?: number;
}

export function ResultCard({ title, badge, icon, content, delay = 0 }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head>
        <title>${title}</title>
        <style>
          body { font-family: 'Noto Sans KR', sans-serif; padding: 40px; font-size: 14pt; line-height: 1.9; color: #111; }
          h1 { font-size: 18pt; margin-bottom: 24px; color: #1e3a5f; }
          p { margin: 0; white-space: pre-wrap; }
        </style>
      </head><body>
        <h1>${title}</h1>
        <p>${content.replace(/\n/g, "<br>")}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="print-content">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-accent">{icon}</span>}
            <div>
              <h3 className="font-semibold text-primary text-lg leading-tight">{title}</h3>
              {badge && (
                <span className="text-xs text-slate-500 font-medium mt-0.5 block">{badge}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 no-print shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent transition-colors px-3 py-1.5 rounded-lg hover:bg-accent/5 border border-slate-200"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-accent" />
                  <span className="text-accent">복사됨</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  복사
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent transition-colors px-3 py-1.5 rounded-lg hover:bg-accent/5 border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              인쇄
            </button>
          </div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 text-slate-700 leading-relaxed whitespace-pre-wrap text-[15px]">
          {content}
        </div>
      </Card>
    </motion.div>
  );
}
