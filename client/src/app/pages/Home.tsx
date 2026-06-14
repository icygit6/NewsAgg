import { lazy, Suspense } from 'react';
import { NewsGrid } from '../components/NewsGrid';
import { useApp } from '../contexts/AppContext';

// Lazy: pulls recharts, must stay out of the Home chunk until Business opens.
const BusinessTrendChart = lazy(() =>
  import('../components/widgets/BusinessTrendChart').then((m) => ({
    default: m.BusinessTrendChart,
  }))
);

export function Home() {
  const { selectedCategory } = useApp();

  return (
    <>
      {selectedCategory === 'business' && (
        <Suspense fallback={null}>
          <BusinessTrendChart />
        </Suspense>
      )}
      <div className="px-4 pb-5">
        <NewsGrid />
      </div>
    </>
  );
}
