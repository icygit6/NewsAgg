import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { NewsCard } from '../components/NewsCard';
import { useRankedHeadlines } from '../hooks/useArticles';

export function TopHeadlines() {
  const { t, isDark } = useApp();
  const { data, isLoading: loading, isError } = useRankedHeadlines(12);
  const articles = data?.articles ?? [];
  const error = isError ? 'Failed to fetch headlines. Please try again later.' : null;

  if (loading) {
    return (
      <div className={`px-4 md:px-6 py-6 max-w-[1600px] mx-auto`}>
        <div className={`flex flex-col items-center justify-center py-20 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
          <div className="animate-spin text-3xl mb-4">⏳</div>
          <p className="text-lg font-medium">{t.loading || 'Loading headlines...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`px-4 md:px-6 py-6 max-w-[1600px] mx-auto`}>
        <div className={`flex flex-col items-center justify-center py-20 text-center ${isDark ? 'text-red-400' : 'text-red-500'}`}>
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-lg font-medium">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-6 py-6 max-w-[1600px] mx-auto">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
          <TrendingUp size={20} className="text-white" />
        </div>
        <div>
          <h1 className={`font-poppins font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
            {t.topHeadlines}
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{t.topHeadlinesSubtitle}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5">
        {articles.map((article, i) => (
          <NewsCard key={article.url} article={article} index={i} />
        ))}
      </div>
    </div>
  );
}
