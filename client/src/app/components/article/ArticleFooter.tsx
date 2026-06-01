import { ExternalLink, PlayCircle } from 'lucide-react';
import type { NewsArticle } from '../../types/article';
import { panelBaseClass } from './helpers';

interface ArticleFooterProps {
  article: NewsArticle;
  isDark: boolean;
}

export function ArticleFooter({ article, isDark }: ArticleFooterProps) {
  const panelBase = panelBaseClass(isDark);

  return (
    <div className={`rounded-2xl border p-5 ${panelBase}`}>
      <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Continue with the original coverage and any linked media from this source.</p>
      <div className="flex flex-wrap gap-3">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all text-sm">
          <ExternalLink size={15} />Read on {article.source.name}
        </a>
        {article.videoUrl && (
          <a href={article.videoUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${isDark ? 'bg-slate-700 text-slate-100 hover:bg-slate-600' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            <PlayCircle size={15} />Watch video
          </a>
        )}
      </div>
    </div>
  );
}
