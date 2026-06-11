import { useApp } from '../../contexts/AppContext';
import { CATEGORY_LABELS } from '../../constants';
import { useStatsOverview } from '../../hooks/useStats';
import type { DatasetSnapshot } from '../../types/api';
import { SentimentChart } from '../sentiment/SentimentChart';
import { TrendingKeywords } from '../sentiment/TrendingKeywords';
import { DatasetStats } from '../sentiment/DatasetStats';

/** Compact analytics for the right rail's Insights tab: sentiment donut,
 * trending keywords and dataset stats — all fed by the SQL-side /api/stats
 * endpoints (the legacy full-dataset store is no longer touched here). */
export function InsightsRail() {
  const { t, selectedCategory } = useApp();
  const { data: overview } = useStatsOverview(selectedCategory);

  const categoryLabel =
    selectedCategory === 'all' ? t.allCategories : CATEGORY_LABELS[selectedCategory];

  const snapshot: DatasetSnapshot = {
    status: 'ok',
    totalResults: overview?.total ?? 0,
    articleCount: overview?.total ?? 0,
    scrapedAt: overview?.scrapedAt ?? null,
    categories: (overview?.categories ?? []) as DatasetSnapshot['categories'],
    aiModels: overview?.aiModels ?? {},
    sourceCount: overview?.sourceCount ?? 0,
  };

  return (
    <div className="space-y-4 w-full">
      <SentimentChart />
      <TrendingKeywords />
      <DatasetStats
        articleCount={overview?.total ?? 0}
        keywordCount={overview?.keywordCount ?? 0}
        snapshot={snapshot}
        categoryLabel={categoryLabel}
      />
    </div>
  );
}
