import { lazy, Suspense, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FooterCompact } from './Footer';

const PulseRail = lazy(() =>
  import('../posts/PulseRail').then((m) => ({ default: m.PulseRail }))
);
const InsightsRail = lazy(() =>
  import('./InsightsRail').then((m) => ({ default: m.InsightsRail }))
);
const MarketsWidget = lazy(() =>
  import('../widgets/MarketsWidget').then((m) => ({ default: m.MarketsWidget }))
);

type RailTab = 'pulse' | 'insights';

export function RightRail() {
  const { t, isDark, selectedCategory } = useApp();
  const [tab, setTab] = useState<RailTab>('insights');

  const tabButton = (key: RailTab, label: string) => (
    <button
      key={key}
      onClick={() => setTab(key)}
      className={`flex-1 py-2 text-sm font-semibold rounded-full transition-colors ${
        tab === key
          ? 'text-white'
          : isDark
            ? 'text-slate-400 hover:text-slate-200'
            : 'text-slate-500 hover:text-slate-800'
      }`}
      style={tab === key ? { background: 'var(--brand-grad, #06b6d4)' } : undefined}
    >
      {label}
    </button>
  );

  return (
    <aside
      className={`hidden lg:flex flex-col flex-1 min-w-[300px] max-w-[560px] border-l ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}
    >
      {/* Tab header — sibling to scroll container, mirrors FeedHeader structure */}
      <div
        className={`shrink-0 h-[88px] px-4 flex items-center border-b ${
          isDark ? 'border-slate-800/50' : 'border-slate-200/50'
        }`}
      >
        {selectedCategory === 'business' && (
          <Suspense fallback={null}>
            <MarketsWidget />
          </Suspense>
        )}
        <div
          className={`flex gap-1 rounded-full border p-1 w-full ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
          role="tablist"
        >
          {tabButton('insights', t.insights)}
          {tabButton('pulse', t.pulse)}
        </div>
      </div>

      {/* Scrollable content — independent scroll container */}
      <div className="flex-1 overflow-y-auto px-4 pb-6" style={{ scrollbarWidth: 'none' }}>
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <div className={`w-6 h-6 rounded-full border-2 border-t-transparent animate-spin ${isDark ? 'border-slate-600' : 'border-slate-300'}`} />
            </div>
          }
        >
          {tab === 'pulse' ? <PulseRail /> : <InsightsRail />}
        </Suspense>
        <div className={`mt-6 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <FooterCompact />
        </div>
      </div>
    </aside>
  );
}
