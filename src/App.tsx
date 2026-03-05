import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputArea } from './components/InputArea';
import { SummaryDisplay } from './components/SummaryDisplay';
import { generateSummary, type SummaryResult } from './services/aiService';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async (text: string, type: 'book' | 'paper' | 'report') => {
    setIsProcessing(true);
    setError(null);
    try {
      const result = await generateSummary(text, type);
      setSummary(result);
    } catch (err) {
      console.error(err);
      setError("生成摘要失败，请稍后重试。");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSummary(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans text-stone-900">
      <Header />
      
      <main className="flex-1 w-full px-4 py-12 md:px-8">
        <AnimatePresence mode="wait">
          {!summary ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <div className="text-center mb-12 space-y-4">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">
                  解锁书籍智慧
                </h1>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                  将冗长的书籍、论文和报告转化为结构清晰的精华摘要，快速掌握核心洞察与实用建议。
                </p>
              </div>

              <InputArea onSummarize={handleSummarize} isProcessing={isProcessing} />
              
              {error && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 max-w-3xl mx-auto p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-center"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <div className="max-w-4xl mx-auto mb-8">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  分析另一篇
                </button>
              </div>
              <SummaryDisplay result={summary} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
