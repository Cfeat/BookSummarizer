import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, CheckCircle2, List, Lightbulb, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';
import type { SummaryResult } from '../services/aiService';

interface SummaryDisplayProps {
  result: SummaryResult;
}

export function SummaryDisplay({ result }: SummaryDisplayProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters'>('overview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `
# ${result.title}

## 核心洞察
${result.coreInsights.map(i => `- ${i}`).join('\n')}

## 行动建议
${result.actionableTakeaways.map((t, i) => `${i + 1}. ${t}`).join('\n')}

## 章节解析
${result.chapterAnalysis.map(c => `### ${c.chapter}\n${c.summary}`).join('\n\n')}

## 全文摘要
${result.fullSummary}
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-8 pb-20"
    >
      {/* Header Section */}
      <div className="text-center space-y-4 relative">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
          {result.title}
        </h1>
        
        <div className="flex justify-center gap-4 items-center">
          <div className="flex bg-stone-100 p-1 rounded-full shadow-inner">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeTab === 'overview' 
                  ? "bg-white text-stone-900 shadow-sm" 
                  : "text-stone-500 hover:text-stone-900"
              )}
            >
              概览与洞察
            </button>
            <button
              onClick={() => setActiveTab('chapters')}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeTab === 'chapters' 
                  ? "bg-white text-stone-900 shadow-sm" 
                  : "text-stone-500 hover:text-stone-900"
              )}
            >
              章节解析
            </button>
          </div>
          
          <button
            onClick={handleCopy}
            className="absolute right-0 top-0 md:relative md:right-auto md:top-auto p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
            title="复制摘要"
          >
            {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Core Insights - Left Column */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50 shadow-sm">
              <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2 mb-4 font-serif">
                <Lightbulb className="w-5 h-5" />
                核心洞察
              </h3>
              <ul className="space-y-4">
                {result.coreInsights.map((insight, idx) => (
                  <li key={idx} className="text-sm text-amber-900/80 leading-relaxed text-justify">
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50 shadow-sm">
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-4 font-serif">
                <CheckCircle2 className="w-5 h-5" />
                行动建议
              </h3>
              <ul className="space-y-3">
                {result.actionableTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-emerald-900/80 leading-relaxed text-justify">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-emerald-200/50 flex items-center justify-center text-xs font-bold text-emerald-700">
                      {idx + 1}
                    </span>
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full Summary - Right Column (Wider) */}
          <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm ring-1 ring-stone-900/5">
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-stone-400" />
              全书概览
            </h3>
            <div className="prose prose-stone prose-lg max-w-none text-stone-600 leading-relaxed text-justify">
              <ReactMarkdown>{result.fullSummary}</ReactMarkdown>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {result.chapterAnalysis.map((chapter, idx) => (
            <ChapterCard key={idx} chapter={chapter} index={idx} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ChapterCard({ chapter, index }: { chapter: { chapter: string; summary: string }; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm ring-1 ring-stone-900/5 overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-sm font-mono font-medium text-stone-600">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h4 className="text-lg font-medium text-stone-900 font-serif">{chapter.chapter}</h4>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-stone-400" /> : <ChevronDown className="w-5 h-5 text-stone-400" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0 text-stone-600 leading-relaxed border-t border-stone-100 text-justify">
              {chapter.summary}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
