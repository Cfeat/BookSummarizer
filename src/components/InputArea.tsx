import { FileText, Upload, Loader2, Sparkles, Zap, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '../lib/utils';
import { extractTextFromPdf } from '../services/pdfService';

interface InputAreaProps {
  onSummarize: (text: string, type: 'book' | 'paper' | 'report') => void;
  isProcessing: boolean;
}

export function InputArea({ onSummarize, isProcessing }: InputAreaProps) {
  const [text, setText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');
    const isTxt = selectedFile.type === 'text/plain' || selectedFile.name.toLowerCase().endsWith('.txt');

    if (isPdf || isTxt) {
      setFile(selectedFile);
      setText(''); // Clear manual text if file is selected
    } else {
      alert('请上传 PDF 或 TXT 文件。');
    }
  };

  const handleSubmit = async () => {
    if (file) {
      try {
        setIsExtracting(true);
        let extractedText = '';
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        
        if (isPdf) {
          extractedText = await extractTextFromPdf(file);
        } else {
          extractedText = await file.text();
        }
        
        if (!extractedText || extractedText.trim().length === 0) {
          throw new Error("No text found in file");
        }
        
        onSummarize(extractedText, 'book');
      } catch (error) {
        console.error("Extraction error:", error);
        alert("文件读取失败，请确保是有效的文本 PDF 或 TXT 文件。");
      } finally {
        setIsExtracting(false);
      }
    } else if (text) {
      onSummarize(text, 'book');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="relative group">
        <div className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-stone-400 to-stone-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200",
          dragActive ? "opacity-60" : ""
        )}></div>
        <div 
          className={cn(
            "relative bg-white rounded-xl p-6 shadow-xl ring-1 ring-stone-900/5 transition-all duration-300",
            dragActive ? "scale-[1.02] ring-stone-500/50" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-stone-600" />
              输入内容
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-stone-600 hover:text-stone-800 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <Upload className="w-4 h-4" />
                上传 PDF
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".pdf,.txt" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          </div>

          {file ? (
            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-200">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-stone-600" />
                <div>
                  <p className="font-medium text-stone-900">{file.name}</p>
                  <p className="text-xs text-stone-500">{(file.size / 1024 / 1024).toFixed(2)} MB • 准备就绪</p>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setText(''); }}
                className="text-stone-400 hover:text-stone-600 p-1 hover:bg-stone-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="在此粘贴文本或直接拖入 PDF 文件..."
              className="w-full h-64 p-4 bg-stone-50 rounded-lg border-0 text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-stone-500 resize-none font-mono text-sm leading-relaxed"
            />
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={(!text && !file) || isProcessing || isExtracting}
              className={cn(
                "flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white shadow-lg shadow-stone-900/10 transition-all",
                (!text && !file) || isProcessing || isExtracting
                  ? "bg-stone-300 cursor-not-allowed shadow-none"
                  : "bg-stone-900 hover:bg-stone-800 hover:translate-y-[-1px]"
              )}
            >
              {isProcessing || isExtracting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isExtracting ? '正在读取...' : '深度思考中...'}
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  开始分析
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
