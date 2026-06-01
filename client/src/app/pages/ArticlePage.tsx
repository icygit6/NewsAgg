import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { TOPIC_TO_CATEGORY } from '../constants';
import { ArticleHeader } from '../components/article/ArticleHeader';
import { ArticleBody } from '../components/article/ArticleBody';
import { ArticleFooter } from '../components/article/ArticleFooter';
import { ArticleSidebar } from '../components/article/ArticleSidebar';
import { ArticleChat } from '../components/article/ArticleChat';
import { mutedTextClass, panelBaseClass } from '../components/article/helpers';
import {
  getAllArticles,
  getArticleById,
  getLiveEngagement,
  getSentimentDistribution,
  getTrendingKeywords,
} from '../services/newsAPI';
import type {
  NewsArticle,
  NewsCategoryFilter,
  TrendingKeyword,
  LiveEngagementItem,
} from '../types/article';
import type { SentimentDistributionItem } from '../types/sentiment';

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, isDark } = useApp();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(Date.now());

  // ── Async data state ──────────────────────────────────────────────────────
  const [categorySentimentDistribution, setCategorySentimentDistribution] = useState<SentimentDistributionItem[]>([]);
  const [categoryArticles, setCategoryArticles] = useState<NewsArticle[]>([]);
  const [categoryTrendingKeywords, setCategoryTrendingKeywords] = useState<TrendingKeyword[]>([]);
  const [categoryLiveEngagement, setCategoryLiveEngagement] = useState<LiveEngagementItem[]>([]);

  const handleBackToHome = () => {
    const historyIndex = window.history.state?.idx ?? 0;
    if (historyIndex > 0) { navigate(-1); return; }
    navigate('/');
  };

  // ── Fetch article by id ───────────────────────────────────────────────────
  useEffect(() => {
    if (!id) {
      setError('Article reference is missing.');
      setLoading(false);
      return;
    }
    getArticleById(id).then((found) => {
      setArticle(found);
      setError(found ? null : 'Article not found in the current dataset.');
      setLoading(false);
    });
  }, [id]);

  // ── Derive category once article is loaded ────────────────────────────────
  const articleCategory: NewsCategoryFilter = article ? TOPIC_TO_CATEGORY[article.topic] : 'all';

  // ── Fetch sidebar data when article category is known ─────────────────────
  useEffect(() => {
    if (!article) return;
    getSentimentDistribution(articleCategory).then(setCategorySentimentDistribution);
    getAllArticles(articleCategory).then(setCategoryArticles);
    getTrendingKeywords(8, articleCategory).then(setCategoryTrendingKeywords);
  }, [articleCategory, article]);

  // ── Fetch live engagement on tick ─────────────────────────────────────────
  useEffect(() => {
    if (!article) return;
    getLiveEngagement(tick, 6, articleCategory).then(setCategoryLiveEngagement);
  }, [tick, articleCategory, article]);

  // ── Tick timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 12_000);
    return () => window.clearInterval(id);
  }, []);

  const panelBase = panelBaseClass(isDark);
  const mutedText = mutedTextClass(isDark);

  if (loading) {
    return (
      <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
        <div className={`flex flex-col items-center justify-center py-20 ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>
          <div className="animate-spin text-3xl mb-4">Loading</div>
          <p className="text-lg font-medium">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="px-4 md:px-6 py-6 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <button type="button" onClick={handleBackToHome} className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}>
            <ArrowLeft size={16} />{t.backToHome}
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`text-center py-20 rounded-2xl border ${panelBase}`}>
          <div className="text-6xl mb-4">News</div>
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>Article Not Found</h2>
          <p className={`mb-6 ${mutedText}`}>{error}</p>
          <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all">
            Go to Homepage
          </Link>
        </motion.div>
      </div>
    );
  }

  // Sidebar content extracted to avoid duplication between desktop and mobile
  const sidebar = (
    <ArticleSidebar
      article={article}
      isDark={isDark}
      t={t}
      categorySentimentDistribution={categorySentimentDistribution}
      categoryArticles={categoryArticles}
      categoryTrendingKeywords={categoryTrendingKeywords}
      categoryLiveEngagement={categoryLiveEngagement}
    />
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="px-4 md:px-6 pt-6 md:pt-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <button type="button" onClick={handleBackToHome} className={`inline-flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}>
            <ArrowLeft size={16} />{t.backToHome}
          </button>
        </motion.div>
      </div>

      <div className="flex gap-6 px-4 md:px-6 pt-6 md:pt-8 flex-1 min-h-0 max-w-[1600px] mx-auto w-full">
        {/* Article content */}
        <div className="flex-1 min-w-0 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="pr-2 pb-50">
            <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="min-w-0">
              <ArticleHeader article={article} isDark={isDark} />
              <ArticleBody article={article} isDark={isDark} />
              <ArticleFooter article={article} isDark={isDark} />
            </motion.article>
          </div>
        </div>

        {/* Sidebar — desktop */}
        <div className="hidden lg:block w-72 xl:w-80 shrink-0 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="pr-2 pb-20">
            <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
              {sidebar}
            </motion.aside>
          </div>
        </div>
      </div>

      {/* Sidebar — mobile */}
      <div className="lg:hidden overflow-y-auto px-4 md:px-6 py-8" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <motion.aside initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
          {sidebar}
        </motion.aside>
      </div>

      {/* AI chat (Groq via backend proxy) */}
      <ArticleChat article={article} isDark={isDark} />
    </div>
  );
}
