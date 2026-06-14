import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { SlidersHorizontal, Search, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../contexts/AppContext';
import { CATEGORIES, CATEGORY_BADGE_CLASS, CATEGORY_LABELS, type Category } from '../../constants';
import { FilterSheet } from '../ui/FilterSheet';
import { SearchBox } from './SearchBox';

export function FeedHeader() {
  const {
    t, isDark, toggleTheme,
    selectedCategory, setSelectedCategory,
    selectedSources, selectedSentiment,
  } = useApp();

  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const chipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chipsRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (el.scrollWidth <= el.clientWidth) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      el.scrollLeft += delta;
      e.preventDefault();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const filterActiveCount = selectedSources.length + (selectedSentiment !== 'all' ? 1 : 0);

  const chip = (key: Category | 'all', label: string) => {
    const active = selectedCategory === key;
    const activeClass = key === 'all' ? 'text-white' : CATEGORY_BADGE_CLASS[key];
    return (
      <button
        key={key}
        onClick={() => setSelectedCategory(key)}
        className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
          active
            ? activeClass
            : isDark
              ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
        }`}
        style={active && key === 'all' ? { background: 'var(--brand-grad, #06b6d4)' } : undefined}
      >
        {label}
      </button>
    );
  };

  const iconBtn = `p-2 rounded-full transition-colors ${
    isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
  }`;

  const filterBtn = (
    <div className="relative shrink-0">
      <button
        onClick={() => setFilterOpen((p) => !p)}
        aria-label={t.filter}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          filterActiveCount > 0
            ? 'text-[var(--brand,#06b6d4)]'
            : isDark
              ? 'text-slate-300 hover:bg-slate-800'
              : 'text-slate-600 hover:bg-slate-100'
        }`}
      >
        <SlidersHorizontal size={16} />
        {filterActiveCount > 0 && (
          <span
            className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-white text-[11px] font-bold"
            style={{ background: 'var(--brand, #06b6d4)' }}
          >
            {filterActiveCount}
          </span>
        )}
      </button>
      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} />
    </div>
  );

  return (
    <header
      className={`z-30 border-b shrink-0 md:h-[88px] ${
        isDark ? 'border-slate-800/50' : 'border-slate-200/50'
      }`}
    >
      {/* Mobile: search bar row */}
      <div className="md:hidden flex items-center gap-2 px-3 py-2.5">
        <Link to="/" className="shrink-0">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center font-poppins font-bold text-white"
            style={{ background: 'var(--brand-grad, #06b6d4)' }}
          >
            N
          </span>
        </Link>
        <div className="flex-1 min-w-0">
          <SearchBox />
        </div>
        {filterBtn}
        <button onClick={toggleTheme} aria-label="Toggle theme" className={iconBtn}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Desktop: filter + chips + search icon */}
      <div className="hidden md:flex items-stretch h-full">
        <div className="flex-1 min-w-0 flex items-center gap-2 px-3">
          {filterBtn}

          {/* Scrollable chips */}
          <div
            ref={chipsRef}
            className="flex gap-2 overflow-x-auto overscroll-x-contain"
            style={{ scrollbarWidth: 'none' }}
          >
            {chip('all', t.allCategories)}
            {CATEGORIES.map((c) => chip(c, CATEGORY_LABELS[c]))}
          </div>

          {/* Search toggle — right edge */}
          <div className="relative ml-auto shrink-0">
            <button
              onClick={() => setSearchOpen((p) => !p)}
              aria-label={t.search}
              className={`${iconBtn} ${searchOpen ? 'text-[var(--brand,#06b6d4)]' : ''}`}
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className={`absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-xl overflow-hidden z-50 ${
                    isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'
                  }`}
                >
                  <div className="p-3">
                    <SearchBox />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
