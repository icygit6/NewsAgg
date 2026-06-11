import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  fetchArticlesPage,
  type ArticlesPage,
  type ArticlesPageParams,
} from '../services/newsAPI';

/** Infinite paginated feed with server-side category/source/sentiment/search
 * filtering. The flat list lives in data.pages[].articles. */
export function useArticles(params: ArticlesPageParams) {
  const key = {
    category: params.category ?? 'all',
    sources: [...(params.sources ?? [])].sort(),
    sentiment: params.sentiment ?? 'all',
    q: params.q ?? '',
    sort: params.sort ?? 'latest',
    pageSize: params.pageSize ?? 20,
  };
  return useInfiniteQuery({
    queryKey: ['articles', key],
    queryFn: ({ pageParam }) => fetchArticlesPage(params, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last: ArticlesPage) =>
      last.page * last.pageSize < last.totalCount ? last.page + 1 : undefined,
  });
}

/** Single page of importance-ranked headlines (server-side `sort=rank`). */
export function useRankedHeadlines(limit = 12, category?: string) {
  return useQuery({
    queryKey: ['headlines', { limit, category: category ?? 'all' }],
    queryFn: () => fetchArticlesPage({ sort: 'rank', pageSize: limit, category }, 1),
  });
}
