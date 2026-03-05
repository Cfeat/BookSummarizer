import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-6 px-4 md:px-8 flex items-center justify-between border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-stone-900/20">
          <BookOpen className="w-6 h-6" />
        </div>
        <span className="font-serif font-bold text-xl tracking-tight text-stone-900">
          AI 智能书籍摘要
        </span>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
        <a href="#" className="hover:text-stone-900 transition-colors">使用指南</a>
        <a href="#" className="hover:text-stone-900 transition-colors">示例</a>
        <a href="#" className="hover:text-stone-900 transition-colors">关于我们</a>
      </nav>
    </header>
  );
}
